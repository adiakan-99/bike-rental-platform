package com.bikerental.partner_service.dto.response.internal;

import lombok.Data;

import java.util.List;

@Data
public class UserDataResponseDto {
    private int userId;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String gender;
    private String accountStatus;
    List<String> roles;
}
