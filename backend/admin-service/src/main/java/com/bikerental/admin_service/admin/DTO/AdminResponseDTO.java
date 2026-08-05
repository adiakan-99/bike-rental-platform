package com.bikerental.admin_service.admin.DTO;

import java.time.LocalDateTime;

import com.bikerental.admin_service.enums.AccountStatus;

import lombok.Data;

@Data
public class AdminResponseDTO {

	private Integer userId;

	private String firstName;

	private String lastName;

	private String email;

	private String phoneNumber;

	private AccountStatus accountStatus;

	private LocalDateTime createdAt;

}
