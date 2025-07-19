package com.Ecostore.Backend.dto;

import lombok.Data;

import java.time.LocalDate;
@Data
public class SignUpRequest {
    private String username;
    private String email;
    private String password;
    private Integer age; // <-- Add this line
    private String phoneNumber; // <-- Add this line
    private LocalDate dateOfBirth; // <-- Add this line
}
