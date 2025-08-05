package com.Ecostore.Backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();
    private LocalDateTime orderDate;
    private LocalDateTime deliveryDate;
    private Double totalPrice; // The sub-total before discount

    private Double discount; // The discount amount applied

    private Double finalPrice; // The final price after discount

    private String orderStatus; // e.g., PENDING, PLACED, SHIPPED, DELIVERED
    private String shippingAddress;

    // For payment details
    private String paymentMethod; // e.g., "Credit Card", "PayPal"
    private String paymentId; // from the payment provider
    private String razorpayOrderId; // from razorpay
    private String paymentStatus = "PENDING";
}
