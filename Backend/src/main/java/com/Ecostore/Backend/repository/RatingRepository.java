package com.Ecostore.Backend.repository;

import com.Ecostore.Backend.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    
    // Find rating by user and product (to check if user already rated this product)
    Optional<Rating> findByUserIdAndProductId(Long userId, String productId);
    
    // Find all ratings for a specific product
    List<Rating> findByProductId(String productId);
    
    // Find all ratings by a specific user
    List<Rating> findByUserId(Long userId);
    
    // Get average rating for a product
    @Query("SELECT AVG(r.rating) FROM Rating r WHERE r.productId = :productId")
    Double getAverageRatingByProductId(@Param("productId") String productId);
    
    // Count total ratings for a product
    Long countByProductId(String productId);
}
