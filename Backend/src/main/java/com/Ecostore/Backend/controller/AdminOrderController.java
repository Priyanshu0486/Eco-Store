package com.Ecostore.Backend.controller;

import com.Ecostore.Backend.model.Order;
import com.Ecostore.Backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class AdminOrderController {

    @Autowired
    private OrderRepository orderRepository;

    /**
     * Get all orders for admin management
     * GET /api/admin/orders
     */
    @GetMapping("/orders")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllOrders() {
        try {
            // Fetch all orders with user and orderItems data
            List<Order> orders = orderRepository.findAll();
            
            return ResponseEntity.ok(orders);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Failed to fetch orders: " + e.getMessage(), 500));
        }
    }

    /**
     * Update order status
     * PUT /api/admin/orders/{orderId}/status
     */
    @PutMapping("/orders/{orderId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody Map<String, String> request) {
        
        try {

            // Get the new order status from request
            String newOrderStatus = request.get("orderStatus");
            if (newOrderStatus == null || newOrderStatus.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse("Order status is required", 400));
            }

            // Validate order status values
            if (!isValidOrderStatus(newOrderStatus)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse("Invalid order status. Valid values: PLACED, CONFIRMED, SHIPPED, DELIVERED, CANCELLED", 400));
            }

            // Find the order
            Optional<Order> orderOptional = orderRepository.findById(orderId);
            if (orderOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse("Order not found with ID: " + orderId, 404));
            }

            Order order = orderOptional.get();
            
            // Update the order status (admins can change to any valid status)
            order.setOrderStatus(newOrderStatus);
            Order updatedOrder = orderRepository.save(order);

            // Create success response
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Order status updated successfully");
            
            Map<String, Object> orderData = new HashMap<>();
            orderData.put("id", updatedOrder.getId());
            orderData.put("orderStatus", updatedOrder.getOrderStatus());
            response.put("order", orderData);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Failed to update order status: " + e.getMessage(), 500));
        }
    }

    /**
     * Update payment status
     * PUT /api/admin/orders/{orderId}/payment-status
     */
    @PutMapping("/orders/{orderId}/payment-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updatePaymentStatus(
            @PathVariable Long orderId,
            @RequestBody Map<String, String> request) {
        
        try {

            // Get the new payment status from request
            String newPaymentStatus = request.get("paymentStatus");
            if (newPaymentStatus == null || newPaymentStatus.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse("Payment status is required", 400));
            }

            // Validate payment status values
            if (!isValidPaymentStatus(newPaymentStatus)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse("Invalid payment status. Valid values: PENDING, COMPLETED, FAILED, REFUNDED", 400));
            }

            // Find the order
            Optional<Order> orderOptional = orderRepository.findById(orderId);
            if (orderOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse("Order not found with ID: " + orderId, 404));
            }

            Order order = orderOptional.get();
            
            // Update the payment status
            order.setPaymentStatus(newPaymentStatus);
            Order updatedOrder = orderRepository.save(order);

            // Create success response
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Payment status updated successfully");
            
            Map<String, Object> orderData = new HashMap<>();
            orderData.put("id", updatedOrder.getId());
            orderData.put("paymentStatus", updatedOrder.getPaymentStatus());
            response.put("order", orderData);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Failed to update payment status: " + e.getMessage(), 500));
        }
    }

    // Helper method to create error response
    private Map<String, Object> createErrorResponse(String message, int status) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", message);
        errorResponse.put("status", status);
        return errorResponse;
    }

    // Helper method to validate order status
    private boolean isValidOrderStatus(String status) {
        return status.equals("PLACED") || status.equals("CONFIRMED") || 
               status.equals("SHIPPED") || status.equals("DELIVERED") || 
               status.equals("CANCELLED");
    }

    // Helper method to validate payment status
    private boolean isValidPaymentStatus(String status) {
        return status.equals("PENDING") || status.equals("COMPLETED") || 
               status.equals("FAILED") || status.equals("REFUNDED");
    }


}
