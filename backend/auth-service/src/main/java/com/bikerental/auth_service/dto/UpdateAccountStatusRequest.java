package com.bikerental.auth_service.dto;

import com.bikerental.auth_service.enums.AccountStatus;

import lombok.Data;

@Data
public class UpdateAccountStatusRequest {

	private AccountStatus accountStatus;
}
