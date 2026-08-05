package com.bikerental.auth_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ResetPasswordRequest {

	@NotBlank(message = "OTP is required")
	private String token;

	@Size(min = 6, message = "Password must contain minimum 6 characters")
	private String newPassword;

}