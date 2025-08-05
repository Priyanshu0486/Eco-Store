package com.Ecostore.Backend.request;

import com.Ecostore.Backend.dto.AddressDto;
import com.Ecostore.Backend.dto.OrderItemDto;
import lombok.Data;

import java.util.List;

@Data
public class CreateOrderRequest {

    private String couponCode;
    private AddressDto shippingAddress;
    private List<OrderItemDto> orderItems;
    private String paymentMethod; // e.g., "COD", "Credit Card"
    private String paymentId; // The transaction ID from the payment gateway (razorpay_payment_id)
    private String razorpayOrderId; // The order ID from Razorpay
    private String razorpaySignature; // The signature from Razorpay to verify the payment

}
