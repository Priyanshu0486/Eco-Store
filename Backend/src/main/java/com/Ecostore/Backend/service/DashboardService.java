package com.Ecostore.Backend.service;

import com.Ecostore.Backend.dto.DashboardStatsDto;
import com.Ecostore.Backend.model.Order;
import com.Ecostore.Backend.model.OrderItem;
import com.Ecostore.Backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class DashboardService {

    private final OrderRepository orderRepository;

    @Autowired
    public DashboardService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    /**
     * Calculate comprehensive dashboard statistics for a user
     * @param userId The user's ID
     * @return DashboardStatsDto with calculated statistics
     */
    public DashboardStatsDto calculateUserStats(Long userId) {
        // Get all user's orders
        List<Order> userOrders = orderRepository.findByUserId(userId);

        // Initialize totals
        BigDecimal totalSpent = BigDecimal.ZERO;
        BigDecimal totalSaved = BigDecimal.ZERO;
        BigDecimal totalCarbonSaved = BigDecimal.ZERO;
        Integer totalOrders = userOrders.size();

        // Calculate totals from orders
        for (Order order : userOrders) {
            // Add to total spent (final price paid by user)
            if (order.getFinalPrice() != null) {
                totalSpent = totalSpent.add(order.getFinalPrice());
            }

            // Add to total saved (discount amount)
            if (order.getDiscount() != null) {
                totalSaved = totalSaved.add(order.getDiscount());
            }

            // Calculate carbon saved from order items
            if (order.getOrderItems() != null) {
                for (OrderItem orderItem : order.getOrderItems()) {
                    if (orderItem.getProduct() != null && orderItem.getProduct().getCarbonSaved() != null) {
                        // Carbon saved = product's carbon saved * quantity
                        BigDecimal itemCarbonSaved = orderItem.getProduct().getCarbonSaved()
                                .multiply(BigDecimal.valueOf(orderItem.getQuantity()));
                        totalCarbonSaved = totalCarbonSaved.add(itemCarbonSaved);
                    }
                }
            }
        }

        // Calculate EcoCoins (1 EcoCoin per ₹10 spent)
        Integer ecoCoinsEarned = calculateEcoCoins(totalSpent);

        return new DashboardStatsDto(
                totalSpent,
                totalSaved,
                ecoCoinsEarned,
                totalCarbonSaved,
                totalOrders
        );
    }

    /**
     * Calculate EcoCoins based on total spent
     * Rule: 1 EcoCoin per ₹10 spent
     * @param totalSpent Total amount spent by user
     * @return Number of EcoCoins earned
     */
    private Integer calculateEcoCoins(BigDecimal totalSpent) {
        if (totalSpent == null || totalSpent.compareTo(BigDecimal.ZERO) <= 0) {
            return 0;
        }
        
        // 1 EcoCoin per ₹10 spent
        BigDecimal ecoCoinsDecimal = totalSpent.divide(BigDecimal.valueOf(10), 0, BigDecimal.ROUND_DOWN);
        return ecoCoinsDecimal.intValue();
    }

    /**
     * Get all orders for a user
     * @param userId The user's ID
     * @return List of user's orders sorted by date (newest first)
     */
    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByOrderDateDesc(userId);
    }

    /**
     * Get recent orders for a user (limited number)
     * @param userId The user's ID
     * @param limit Maximum number of orders to return
     * @return List of user's recent orders
     */
    public List<Order> getRecentUserOrders(Long userId, int limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by("orderDate").descending());
        return orderRepository.findByUserId(userId, pageable).getContent();
    }

    /**
     * Get user's order statistics by status
     * @param userId The user's ID
     * @return Count of orders by different statuses
     */
    public Long getCompletedOrdersCount(Long userId) {
        return orderRepository.countByUserIdAndOrderStatus(userId, "DELIVERED");
    }

    /**
     * Get user's pending orders count
     * @param userId The user's ID
     * @return Count of pending orders
     */
    public Long getPendingOrdersCount(Long userId) {
        List<String> pendingStatuses = List.of("PLACED", "CONFIRMED", "SHIPPED");
        return orderRepository.countByUserIdAndOrderStatusIn(userId, pendingStatuses);
    }
}
