package com.Ecostore.Backend.controller;

import com.Ecostore.Backend.model.User;
import com.Ecostore.Backend.service.EcoCoinService;
import com.Ecostore.Backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ecocoins")
public class EcoCoinController {

    @Autowired
    private EcoCoinService ecoCoinService;

    @Autowired
    private UserService userService;

    /**
     * Get user's current EcoCoin balance
     * @return Current EcoCoin balance
     */
    @GetMapping("/balance")
    public ResponseEntity<Map<String, Object>> getEcoCoinBalance() {
        try {
            // Get the authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            User user = userService.findUserByEmail(email);

            if (user == null) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }

            // Get user's EcoCoin balance
            Integer balance = ecoCoinService.getUserEcoCoinBalance(user.getId());

            Map<String, Object> response = new HashMap<>();
            response.put("balance", balance);
            response.put("userId", user.getId());
            response.put("message", "EcoCoin balance retrieved successfully");

            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (Exception e) {
            System.err.println("Error fetching EcoCoin balance: " + e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch EcoCoin balance");
            errorResponse.put("message", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Redeem EcoCoins for discount
     * @param request Request containing ecoCoins to redeem
     * @return Discount amount and updated balance
     */
    @PostMapping("/redeem")
    public ResponseEntity<Map<String, Object>> redeemEcoCoins(@RequestBody Map<String, Integer> request) {
        try {
            // Get the authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            User user = userService.findUserByEmail(email);

            if (user == null) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }

            Integer ecoCoinsToRedeem = request.get("ecoCoins");
            if (ecoCoinsToRedeem == null || ecoCoinsToRedeem <= 0) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Invalid EcoCoin amount");
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }

            // Validate sufficient balance
            if (!ecoCoinService.validateEcoCoinBalance(user.getId(), ecoCoinsToRedeem)) {
                Integer currentBalance = ecoCoinService.getUserEcoCoinBalance(user.getId());
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Insufficient EcoCoin balance");
                errorResponse.put("currentBalance", currentBalance);
                errorResponse.put("required", ecoCoinsToRedeem);
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }

            // Deduct EcoCoins and calculate discount
            Integer newBalance = ecoCoinService.deductEcoCoins(user.getId(), ecoCoinsToRedeem);
            BigDecimal discountAmount = ecoCoinService.convertEcoCoinsToDiscount(ecoCoinsToRedeem);
            
            // Generate coupon code
            String couponCode = ecoCoinService.generateDiscountCoupon(ecoCoinsToRedeem);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("ecoCoinsRedeemed", ecoCoinsToRedeem);
            response.put("discountAmount", discountAmount);
            response.put("couponCode", couponCode);
            response.put("newBalance", newBalance);
            response.put("message", "EcoCoins redeemed successfully! Your coupon code is: " + couponCode);

            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (Exception e) {
            System.err.println("Error redeeming EcoCoins: " + e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to redeem EcoCoins");
            errorResponse.put("message", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Calculate potential EcoCoins from order amount (for preview)
     * @param request Request containing order amount
     * @return Potential EcoCoins that would be earned
     */
    @PostMapping("/calculate")
    public ResponseEntity<Map<String, Object>> calculateEcoCoins(@RequestBody Map<String, BigDecimal> request) {
        try {
            BigDecimal orderAmount = request.get("amount");
            if (orderAmount == null || orderAmount.compareTo(BigDecimal.ZERO) <= 0) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Invalid order amount");
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }

            Integer ecoCoinsEarned = ecoCoinService.calculateEcoCoinsEarned(orderAmount);

            Map<String, Object> response = new HashMap<>();
            response.put("orderAmount", orderAmount);
            response.put("ecoCoinsEarned", ecoCoinsEarned);
            response.put("formula", "1 EcoCoin per ₹10 spent");

            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (Exception e) {
            System.err.println("Error calculating EcoCoins: " + e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to calculate EcoCoins");
            errorResponse.put("message", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
