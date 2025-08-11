package com.Ecostore.Backend.controller;

import com.Ecostore.Backend.repository.OrderRepository;
import com.Ecostore.Backend.repository.UserRepository;
import com.Ecostore.Backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        try {
            // Get total users count
            long totalUsers = userRepository.count();

            // Get total orders count
            long totalOrders = orderRepository.count();

            // Get total products count
            long totalProducts = productRepository.count();

            // Calculate total sales (sum of all order final prices)
            BigDecimal totalSales = orderRepository.findAll().stream()
                .map(order -> order.getFinalPrice() != null ? order.getFinalPrice() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

            // Create response
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalUsers", totalUsers);
            stats.put("totalOrders", totalOrders);
            stats.put("totalProducts", totalProducts);
            stats.put("totalSales", totalSales);

            return ResponseEntity.ok(stats);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch dashboard statistics");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}
