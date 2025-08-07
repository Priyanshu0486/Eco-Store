package com.Ecostore.Backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DiscountCoupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code;

    @Column(nullable = true)
    private Double discountPercentage;
    
    @Column(nullable = true)
    private Double discountAmount;
    
    @Column(nullable = false)
    private String discountType; // "PERCENTAGE" or "FIXED"

    @Column(nullable = false)
    private LocalDate expiryDate;

    @Column(nullable = false)
    private boolean isActive;
}
