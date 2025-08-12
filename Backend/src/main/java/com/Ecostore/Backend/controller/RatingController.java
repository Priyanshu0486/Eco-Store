package com.Ecostore.Backend.controller;

import com.Ecostore.Backend.dto.RatingRequest;
import com.Ecostore.Backend.model.Rating;
import com.Ecostore.Backend.model.User;
import com.Ecostore.Backend.service.RatingService;
import com.Ecostore.Backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/ratings")

public class RatingController {
    
    @Autowired
    private RatingService ratingService;
    
    @Autowired
    private UserService userService;
    
    // Add or update a rating
    @PostMapping
    public ResponseEntity<?> addOrUpdateRating(
            @RequestHeader("Authorization") String jwt,
            @RequestBody RatingRequest ratingRequest) {
        try {
            User user = userService.findUserProfileByJwt(jwt);
            Rating rating = ratingService.addOrUpdateRating(user, ratingRequest);
            return ResponseEntity.ok(rating);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    // Get all ratings for a product
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Rating>> getProductRatings(@PathVariable String productId) {
        List<Rating> ratings = ratingService.getProductRatings(productId);
        return ResponseEntity.ok(ratings);
    }
    
    // Get all reviews (ratings with review text) for a product
    @GetMapping("/product/{productId}/reviews")
    public ResponseEntity<List<Rating>> getProductReviews(@PathVariable String productId) {
        List<Rating> reviews = ratingService.getProductReviews(productId);
        return ResponseEntity.ok(reviews);
    }
    
    // Get user's rating for a specific product
    @GetMapping("/user/product/{productId}")
    public ResponseEntity<?> getUserRatingForProduct(
            @RequestHeader("Authorization") String jwt,
            @PathVariable String productId) {
        try {
            User user = userService.findUserProfileByJwt(jwt);
            Optional<Rating> rating = ratingService.getUserRatingForProduct(user.getId(), productId);
            if (rating.isPresent()) {
                return ResponseEntity.ok(rating.get());
            } else {
                return ResponseEntity.ok(null);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    // Get all ratings by the current user
    @GetMapping("/user")
    public ResponseEntity<?> getUserRatings(@RequestHeader("Authorization") String jwt) {
        try {
            User user = userService.findUserProfileByJwt(jwt);
            List<Rating> ratings = ratingService.getUserRatings(user.getId());
            return ResponseEntity.ok(ratings);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    // Delete a rating
    @DeleteMapping("/product/{productId}")
    public ResponseEntity<?> deleteRating(
            @RequestHeader("Authorization") String jwt,
            @PathVariable String productId) {
        try {
            User user = userService.findUserProfileByJwt(jwt);
            ratingService.deleteRating(user, productId);
            return ResponseEntity.ok("Rating deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
