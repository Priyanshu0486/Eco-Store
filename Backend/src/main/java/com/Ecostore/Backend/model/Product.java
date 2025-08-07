package com.Ecostore.Backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
@NoArgsConstructor
@Table(name = "products")
@AllArgsConstructor
public class Product {
    @Id
    private String id;

    private String name;

    private String brand;

    private String category;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    private Integer quantity;

    private String imageUrl;

    @Column(precision = 10, scale = 2)
    private BigDecimal carbonSaved;

    private Double rating;

    private Integer totalReviewCount;

    private LocalDate dateAdded;
}
