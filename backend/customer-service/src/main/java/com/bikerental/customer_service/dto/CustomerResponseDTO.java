package com.bikerental.customer_service.dto;

import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class CustomerResponseDTO {

    private Integer customerId;
    private Integer userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String addressLine1;
    private String city;
    private String state;
    private String pincode;
    private String accountStatus;
    private OffsetDateTime joiningDate;
}