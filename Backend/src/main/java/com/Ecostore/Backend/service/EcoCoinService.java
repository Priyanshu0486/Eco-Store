package com.Ecostore.Backend.service;

import com.Ecostore.Backend.model.User;
import com.Ecostore.Backend.model.DiscountCoupon;
import com.Ecostore.Backend.repository.UserRepository;
import com.Ecostore.Backend.repository.DiscountCouponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Random;

@Service
public class EcoCoinService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private DiscountCouponRepository discountCouponRepository;

    /**
     * Get user's current EcoCoin balance
     * @param userId User ID
     * @return Current EcoCoin balance
     */
    public Integer getUserEcoCoinBalance(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return user.getEcocoinBalance() != null ? user.getEcocoinBalance() : 0;
    }

    /**
     * Add EcoCoins to user's balance (earned from purchases)
     * @param userId User ID
     * @param amount Amount of EcoCoins to add
     * @return Updated balance
     */
    @Transactional
    public Integer addEcoCoins(Long userId, Integer amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Integer currentBalance = user.getEcocoinBalance() != null ? user.getEcocoinBalance() : 0;
        Integer newBalance = currentBalance + amount;
        
        user.setEcocoinBalance(newBalance);
        userRepository.save(user);

        return newBalance;
    }

    /**
     * Deduct EcoCoins from user's balance (spent/redeemed)
     * @param userId User ID
     * @param amount Amount of EcoCoins to deduct
     * @return Updated balance
     */
    @Transactional
    public Integer deductEcoCoins(Long userId, Integer amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Integer currentBalance = user.getEcocoinBalance() != null ? user.getEcocoinBalance() : 0;
        
        if (currentBalance < amount) {
            throw new IllegalArgumentException("Insufficient EcoCoin balance. Current balance: " + currentBalance + ", Required: " + amount);
        }

        Integer newBalance = currentBalance - amount;
        user.setEcocoinBalance(newBalance);
        userRepository.save(user);

        return newBalance;
    }

    /**
     * Validate if user has sufficient EcoCoin balance
     * @param userId User ID
     * @param amount Amount to validate
     * @return true if sufficient balance, false otherwise
     */
    public boolean validateEcoCoinBalance(Long userId, Integer amount) {
        Integer currentBalance = getUserEcoCoinBalance(userId);
        return currentBalance >= amount;
    }

    /**
     * Calculate EcoCoins earned from order amount
     * Formula: 10 EcoCoins per ₹100 spent (1 EcoCoin per ₹10)
     * @param orderAmount Order total amount
     * @return EcoCoins earned
     */
    public Integer calculateEcoCoinsEarned(BigDecimal orderAmount) {
        if (orderAmount == null || orderAmount.compareTo(BigDecimal.ZERO) <= 0) {
            return 0;
        }
        
        // 1 EcoCoin per ₹10 spent
        return orderAmount.divide(BigDecimal.TEN).intValue();
    }

    /**
     * Convert EcoCoins to discount amount
     * Formula: 1 EcoCoin = ₹1 discount
     * @param ecoCoins Number of EcoCoins
     * @return Discount amount in rupees
     */
    public BigDecimal convertEcoCoinsToDiscount(Integer ecoCoins) {
        if (ecoCoins == null || ecoCoins <= 0) {
            return BigDecimal.ZERO;
        }
        
        // 1 EcoCoin = ₹1 discount
        return BigDecimal.valueOf(ecoCoins);
    }

    /**
     * Process EcoCoin earning after successful order
     * @param userId User ID
     * @param orderAmount Order total amount
     * @return EcoCoins earned and added to balance
     */
    @Transactional
    public Integer processEcoCoinEarning(Long userId, BigDecimal orderAmount) {
        Integer ecoCoinsEarned = calculateEcoCoinsEarned(orderAmount);
        
        if (ecoCoinsEarned > 0) {
            addEcoCoins(userId, ecoCoinsEarned);
        }
        
        return ecoCoinsEarned;
    }
    
    /**
     * Generate a random coupon code
     * @param prefix Coupon prefix (ECO50 or ECO150)
     * @return Random coupon code
     */
    private String generateCouponCode(String prefix) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random random = new Random();
        StringBuilder code = new StringBuilder(prefix + "-");
        
        for (int i = 0; i < 6; i++) {
            code.append(chars.charAt(random.nextInt(chars.length())));
        }
        
        return code.toString();
    }
    
    /**
     * Generate and save a discount coupon
     * @param ecoCoinsRedeemed Number of EcoCoins redeemed
     * @return Generated coupon code
     */
    @Transactional
    public String generateDiscountCoupon(Integer ecoCoinsRedeemed) {
        String couponCode;
        Double discountAmount;
        
        // Determine coupon type based on EcoCoins redeemed
        if (ecoCoinsRedeemed >= 200) {
            // ECO150 coupon for 200+ EcoCoins
            couponCode = generateCouponCode("ECO150");
            discountAmount = 150.0;
        } else if (ecoCoinsRedeemed >= 100) {
            // ECO50 coupon for 100+ EcoCoins
            couponCode = generateCouponCode("ECO50");
            discountAmount = 50.0;
        } else {
            throw new IllegalArgumentException("Insufficient EcoCoins for coupon generation. Minimum 100 required.");
        }
        
        // Ensure unique coupon code
        while (discountCouponRepository.findByCode(couponCode).isPresent()) {
            couponCode = generateCouponCode(ecoCoinsRedeemed >= 200 ? "ECO150" : "ECO50");
        }
        
        // Create and save coupon
        DiscountCoupon coupon = new DiscountCoupon();
        coupon.setCode(couponCode);
        coupon.setDiscountAmount(discountAmount);
        coupon.setDiscountPercentage(0.0); // Set to 0 for FIXED type coupons
        coupon.setDiscountType("FIXED");
        coupon.setExpiryDate(LocalDate.now().plusMonths(6)); // 6 months validity
        coupon.setActive(true);
        
        discountCouponRepository.save(coupon);
        
        return couponCode;
    }
}
