package com.Ecostore.Backend.service;

import com.Ecostore.Backend.dto.RatingRequest;
import com.Ecostore.Backend.model.Product;
import com.Ecostore.Backend.model.Rating;
import com.Ecostore.Backend.model.User;
import com.Ecostore.Backend.repository.ProductRepository;
import com.Ecostore.Backend.repository.RatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class RatingService {
    
    @Autowired
    private RatingRepository ratingRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private UserService userService;
    
    /**
     * Add or update a rating for a product by a user
     * Formula: (old rating * old total_review_count) + (new rating given by user) / (old total_review_count + 1)
     */
    @Transactional
    public Rating addOrUpdateRating(User user, RatingRequest ratingRequest) {
        Long userId = user.getId();
        // Validate rating value (1-5 stars)
        if (ratingRequest.getRating() < 1.0 || ratingRequest.getRating() > 5.0) {
            throw new RuntimeException("Rating must be between 1.0 and 5.0");
        }
        
        // Check if product exists
        Product product = productRepository.findById(ratingRequest.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        

        
        // Check if user has already rated this product
        Optional<Rating> existingRating = ratingRepository.findByUserIdAndProductId(userId, ratingRequest.getProductId());
        
        if (existingRating.isPresent()) {
            // User has already rated this product - prevent duplicate rating
            throw new RuntimeException("You have already rated this product. Each user can only rate a product once.");
        }
        
        // Create new rating (only new ratings allowed)
        Rating rating = new Rating();
        rating.setUserId(userId);
        rating.setProductId(ratingRequest.getProductId());
        rating.setRating(ratingRequest.getRating());
        boolean isNewRating = true;
        
        // Save the rating
        rating = ratingRepository.save(rating);
        
        // Update product rating using the specified formula
        updateProductRating(product, ratingRequest.getRating(), isNewRating);
        
        return rating;
    }
    
    /**
     * Update product rating using the formula:
     * (old rating * old total_review_count) + (new rating given by user) / (old total_review_count + 1)
     */
    private void updateProductRating(Product product, Double newRating, boolean isNewRating) {
        Double currentRating = product.getRating() != null ? product.getRating() : 0.0;
        Integer currentReviewCount = product.getTotalReviewCount() != null ? product.getTotalReviewCount() : 0;
        
        // Apply the formula for new rating (only new ratings allowed)
        Double updatedRating;
        Integer updatedReviewCount;
        
        if (currentReviewCount == 0) {
            // First rating for this product
            updatedRating = Math.round(newRating * 100.0) / 100.0;
            updatedReviewCount = 1;
        } else {
            // Apply the specified formula
            updatedRating = ((currentRating * currentReviewCount) + newRating) / (currentReviewCount + 1);
            updatedRating = Math.round(updatedRating * 100.0) / 100.0; // Round to 2 decimal places
            updatedReviewCount = currentReviewCount + 1;
        }
        
        // Update product with new rating and review count
        product.setRating(updatedRating);
        product.setTotalReviewCount(updatedReviewCount);
        productRepository.save(product);
    }
    
    /**
     * Get all ratings for a specific product
     */
    public List<Rating> getProductRatings(String productId) {
        return ratingRepository.findByProductId(productId);
    }
    
    /**
     * Get all reviews (ratings with review text) for a specific product
     */
    public List<Rating> getProductReviews(String productId) {
        return ratingRepository.findByProductId(productId);
    }
    
    /**
     * Get all ratings by a specific user
     */
    public List<Rating> getUserRatings(Long userId) {
        return ratingRepository.findByUserId(userId);
    }
    
    /**
     * Get user's rating for a specific product
     */
    public Optional<Rating> getUserRatingForProduct(Long userId, String productId) {
        return ratingRepository.findByUserIdAndProductId(userId, productId);
    }
    
    /**
     * Delete a rating
     */
    @Transactional
    public void deleteRating(User user, String productId) {
        Optional<Rating> ratingOpt = ratingRepository.findByUserIdAndProductId(user.getId(), productId);
        
        if (!ratingOpt.isPresent()) {
            throw new RuntimeException("Rating not found");
        }
        
        Rating rating = ratingOpt.get();
        
        // Delete the rating
        ratingRepository.delete(rating);
        
        // Update product rating after deletion
        Product product = productRepository.findById(rating.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        List<Rating> remainingRatings = ratingRepository.findByProductId(rating.getProductId());
        
        if (remainingRatings.isEmpty()) {
            product.setRating(0.0);
            product.setTotalReviewCount(0);
        } else {
            Double averageRating = remainingRatings.stream()
                    .mapToDouble(Rating::getRating)
                    .average()
                    .orElse(0.0);
            averageRating = Math.round(averageRating * 100.0) / 100.0; // Round to 2 decimal places
            product.setRating(averageRating);
            product.setTotalReviewCount(remainingRatings.size());
        }
        
        productRepository.save(product);
    }
}
