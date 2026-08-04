package com.bikerental.admin_service.admin.DTO;

import com.bikerental.admin_service.enums.AccountStatus;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateAccountStatusRequest {

	@NotBlank
	AccountStatus accountStatus;

}
