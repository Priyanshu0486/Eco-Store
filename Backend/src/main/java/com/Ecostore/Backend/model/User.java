package com.Ecostore.Backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    private String email;

    private String password;

    private Integer age; // <-- Add this line

    private String phoneNumber; // <-- Add this line

    private LocalDate dateOfBirth; // <-- Add this line

    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "ecocoin_balance", nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer ecocoinBalance = 0; // EcoCoin balance for the user
}
