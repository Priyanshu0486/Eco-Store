package com.Ecostore.Backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminOrderResponse {
    private boolean success;
    private String message;
    private Object order;
    
    public AdminOrderResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
}
