package com.Ecostore.Backend.dto;

import lombok.Data;

@Data
public class OrderItemDto {
    private String productId;
    private int quantity;
}