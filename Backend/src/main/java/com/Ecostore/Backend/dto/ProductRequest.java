package com.Ecostore.Backend.dto;

import lombok.Data;

@Data
public class ProductRequest {
    private String name;
    private String category;
    private String description;
    private double price;
    private Integer quantity;
    private String imageUrl;
    private double carbonSaved;
}
