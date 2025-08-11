package com.Ecostore.Backend.controller;

import com.Ecostore.Backend.model.Product;
import com.Ecostore.Backend.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private static final Logger logger = LoggerFactory.getLogger(RecommendationController.class);

    @Autowired
    private RecommendationService recommendationService;

    /**
     * Get product recommendations for a given product ID
     * @param productId The product ID to get recommendations for
     * @return List of recommended products
     */
    @GetMapping("/{productId}")
    public ResponseEntity<Map<String, Object>> getRecommendations(@PathVariable String productId) {
        try {
            logger.info("Fetching recommendations for product ID: {}", productId);

            List<Product> recommendations = recommendationService.getRecommendations(productId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("productId", productId);
            response.put("recommendations", recommendations);
            response.put("count", recommendations.size());

            logger.info("Successfully fetched {} recommendations for product ID: {}", recommendations.size(), productId);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error fetching recommendations for product ID: {}", productId, e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to fetch recommendations");
            errorResponse.put("message", e.getMessage());
            errorResponse.put("productId", productId);
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    /**
     * Health check endpoint for recommendation API
     * @return API status
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            boolean isApiAvailable = recommendationService.isRecommendationApiAvailable();
            
            response.put("success", true);
            response.put("recommendationApiAvailable", isApiAvailable);
            response.put("status", isApiAvailable ? "UP" : "DOWN");
            response.put("message", isApiAvailable ? "Recommendation API is available" : "Recommendation API is not available - using fallback");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error checking recommendation API health", e);
            
            response.put("success", false);
            response.put("recommendationApiAvailable", false);
            response.put("status", "ERROR");
            response.put("message", "Error checking API health: " + e.getMessage());
            
            return ResponseEntity.status(500).body(response);
        }
    }
}
