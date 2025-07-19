package com.Ecostore.Backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@Table(name = "products")
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String category;

    private String description;

    private double price;

    private Integer quantity;

    private String imageUrl;

    private double carbonSaved;

    private double waterReduced;

    private int plasticItemsAvoided;
}
