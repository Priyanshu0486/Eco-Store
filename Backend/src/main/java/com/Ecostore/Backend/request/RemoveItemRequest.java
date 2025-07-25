package com.Ecostore.Backend.request;

import lombok.Data;

@Data
public class RemoveItemRequest {
    private Long productId;
    private Integer quantity;

    public Long getProductId() {
        return productId;
    }
}
