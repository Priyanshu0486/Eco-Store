package com.Ecostore.Backend.request;

import lombok.Data;

@Data
public class AddItemRequest {
    private Long productId;
    private int quantity;
}
