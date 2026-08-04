package com.bikerental.admin_service.admin.DTO;

import com.bikerental.admin_service.enums.AccountStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponseDTO {

	private Integer userId;

	private String firstName;

	private String lastName;

	private String email;

	private String phoneNumber;

	private AccountStatus accountStatus;

}