package com.Ecostore.Backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ProductRequest {
    private String name;
    private String brand;
    private String category;
    private String description;
    private BigDecimal price;
    private Integer quantity;
    private String imageUrl;
    private BigDecimal carbonSaved;
    private Double rating;
    private Integer totalReviewCount;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateAdded;
}
