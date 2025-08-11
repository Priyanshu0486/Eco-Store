package com.Ecostore.Backend.dto;

import lombok.Data;

@Data
public class RatingRequest {
    private String productId;
    private Double rating;
}
