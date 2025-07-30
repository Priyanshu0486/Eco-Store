package com.Ecostore.Backend.request;

import lombok.Data;

@Data
public class PaymentRequest {
    private String paymentMethod; // e.g., "PayPal", "Stripe", "Credit Card"
    private String paymentId;     // The transaction ID from the payment provider
}
