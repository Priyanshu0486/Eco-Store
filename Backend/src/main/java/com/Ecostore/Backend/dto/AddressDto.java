package com.Ecostore.Backend.dto;

import lombok.Data;

@Data
public class AddressDto {
    private String streetAddress;
    private String city;
    private String state;
    private String zipCode;
    private String country;
}