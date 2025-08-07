package com.Ecostore.Backend.repository;

import com.Ecostore.Backend.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    // Basic user order queries
    List<Order> findByUserId(Long userId);
    
    // Sorted user order queries
    List<Order> findByUserIdOrderByOrderDateDesc(Long userId);
    
    // Paginated user order queries
    Page<Order> findByUserId(Long userId, Pageable pageable);
    
    // Order status-based queries
    Long countByUserIdAndOrderStatus(Long userId, String orderStatus);
    
    Long countByUserIdAndOrderStatusIn(Long userId, List<String> orderStatuses);
    
    // Additional useful queries for dashboard
    List<Order> findByUserIdAndOrderStatus(Long userId, String orderStatus);
}
