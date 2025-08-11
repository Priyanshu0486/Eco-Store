package com.Ecostore.Backend.dto;

import lombok.Data;

import java.time.LocalDate;
@Data
public class SignUpRequest {
    private String username;
    private String email;
    private String password;
    private String phoneNumber;
    private LocalDate dateOfBirth;
}
