package com.Ecostore.Backend.request;

import com.Ecostore.Backend.dto.AddressDto;
import com.Ecostore.Backend.dto.OrderItemDto;
import lombok.Data;

import java.util.List;

@Data
public class CreateOrderRequest {
    private AddressDto shippingAddress;
    private List<OrderItemDto> orderItems;
    private String paymentMethod; // e.g., "COD", "Credit Card"
    private String paymentId; // The transaction ID from the payment gateway

}
