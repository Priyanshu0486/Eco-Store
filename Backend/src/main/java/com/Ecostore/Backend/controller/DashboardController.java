package com.Ecostore.Backend.controller;

import com.Ecostore.Backend.dto.DashboardStatsDto;
import com.Ecostore.Backend.model.Order;
import com.Ecostore.Backend.model.User;
import com.Ecostore.Backend.service.DashboardService;
import com.Ecostore.Backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;
    private final UserService userService;

    @Autowired
    public DashboardController(DashboardService dashboardService, UserService userService) {
        this.dashboardService = dashboardService;
        this.userService = userService;
    }

    /**
     * Get dashboard statistics for the authenticated user
     * @return DashboardStatsDto containing user's spending, savings, ecocoins, and carbon data
     */
    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        try {
            // Get the authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName(); // JWT contains email, not username
            User user = userService.findUserByEmail(email);

            if (user == null) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }

            // Get dashboard statistics
            DashboardStatsDto stats = dashboardService.calculateUserStats(user.getId());
            return new ResponseEntity<>(stats, HttpStatus.OK);

        } catch (Exception e) {
            System.err.println("Error fetching dashboard stats: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get user's purchase history/orders
     * @return List of user's orders
     */
    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getUserOrders() {
        try {
            // Get the authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName(); // JWT contains email, not username
            User user = userService.findUserByEmail(email);

            if (user == null) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }

            // Get user's orders
            List<Order> orders = dashboardService.getUserOrders(user.getId());
            return new ResponseEntity<>(orders, HttpStatus.OK);

        } catch (Exception e) {
            System.err.println("Error fetching user orders: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get recent orders (limit to last 5 for dashboard preview)
     * @return List of user's recent orders
     */
    @GetMapping("/recent-orders")
    public ResponseEntity<List<Order>> getRecentOrders() {
        try {
            // Get the authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName(); // JWT contains email, not username
            User user = userService.findUserByEmail(email);

            if (user == null) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }

            // Get user's recent orders (limit 5)
            List<Order> recentOrders = dashboardService.getRecentUserOrders(user.getId(), 5);
            return new ResponseEntity<>(recentOrders, HttpStatus.OK);

        } catch (Exception e) {
            System.err.println("Error fetching recent orders: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
