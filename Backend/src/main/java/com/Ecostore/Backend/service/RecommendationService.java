package com.Ecostore.Backend.service;

import com.Ecostore.Backend.dto.RecommendationRequest;
import com.Ecostore.Backend.dto.RecommendationResponse;
import com.Ecostore.Backend.model.Product;
import com.Ecostore.Backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private static final Logger logger = LoggerFactory.getLogger(RecommendationService.class);

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ProductRepository productRepository;

    @Value("${recommendation.api.url:http://localhost:5000}")
    private String recommendationApiUrl;

    /**
     * Get product recommendations from Python API
     * @param productId The product ID to get recommendations for
     * @return List of recommended products
     */
    public List<Product> getRecommendations(String productId) {
        try {
            logger.info("Getting recommendations for product ID: {}", productId);

            // Prepare request
            RecommendationRequest request = new RecommendationRequest(productId);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<RecommendationRequest> entity = new HttpEntity<>(request, headers);

            // Call Python API
            String url = recommendationApiUrl + "/recommend";
            ResponseEntity<RecommendationResponse> response = restTemplate.exchange(
                url, 
                HttpMethod.POST, 
                entity, 
                RecommendationResponse.class
            );

            if (response.getBody() != null && response.getBody().getRecommendations() != null) {
                List<List<String>> recommendations = response.getBody().getRecommendations();
                
                // Flatten the nested list and get unique product IDs
                List<String> productIds = recommendations.stream()
                    .flatMap(List::stream)
                    .distinct()
                    .limit(20) // Limit to 20 recommendations
                    .collect(Collectors.toList());

                logger.info("Received {} product IDs from recommendation API", productIds.size());

                // Fetch product details from database
                return getProductsByIds(productIds);
            }

            logger.warn("No recommendations received from API for product ID: {}", productId);
            return new ArrayList<>();

        } catch (Exception e) {
            logger.error("Error calling recommendation API for product ID: {}", productId, e);
            // Return fallback recommendations or empty list
            return getFallbackRecommendations(productId);
        }
    }

    /**
     * Get products by their IDs
     * @param productIds List of product IDs
     * @return List of Product entities
     */
    private List<Product> getProductsByIds(List<String> productIds) {
        List<Product> products = new ArrayList<>();
        
        for (String productId : productIds) {
            try {
                Optional<Product> product = productRepository.findById(productId);
                if (product.isPresent()) {
                    products.add(product.get());
                } else {
                    logger.warn("Product not found in database: {}", productId);
                }
            } catch (Exception e) {
                logger.error("Error fetching product with ID: {}", productId, e);
            }
        }
        
        logger.info("Found {} products in database out of {} requested", products.size(), productIds.size());
        return products;
    }

    /**
     * Fallback recommendations when API fails
     * @param productId The original product ID
     * @return List of fallback recommended products
     */
    private List<Product> getFallbackRecommendations(String productId) {
        try {
            logger.info("Using fallback recommendations for product ID: {}", productId);
            
            // Get the original product to find similar category products
            Optional<Product> originalProduct = productRepository.findById(productId);
            
            if (originalProduct.isPresent()) {
                String category = originalProduct.get().getCategory();
                List<Product> categoryProducts = productRepository.findByCategory(category);
                
                // Return up to 6 products from same category (excluding the original)
                return categoryProducts.stream()
                    .filter(p -> !p.getId().equals(productId))
                    .limit(6)
                    .collect(Collectors.toList());
            } else {
                // If original product not found, return recent products
                return productRepository.findLastProduct().stream()
                    .limit(6)
                    .collect(Collectors.toList());
            }
            
        } catch (Exception e) {
            logger.error("Error getting fallback recommendations", e);
            return new ArrayList<>();
        }
    }

    /**
     * Check if recommendation API is available
     * @return true if API is reachable
     */
    public boolean isRecommendationApiAvailable() {
        try {
            String url = recommendationApiUrl + "/recommend";
            // Simple ping test with a dummy request
            RecommendationRequest testRequest = new RecommendationRequest("test");
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<RecommendationRequest> entity = new HttpEntity<>(testRequest, headers);
            
            ResponseEntity<String> response = restTemplate.exchange(
                url, 
                HttpMethod.POST, 
                entity, 
                String.class
            );
            
            return response.getStatusCode().is2xxSuccessful() || response.getStatusCode().is4xxClientError();
        } catch (Exception e) {
            logger.warn("Recommendation API is not available: {}", e.getMessage());
            return false;
        }
    }
}
