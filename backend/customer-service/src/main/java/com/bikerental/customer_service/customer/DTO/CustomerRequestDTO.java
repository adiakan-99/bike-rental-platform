package com.bikerental.customer_service.customer.DTO;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CustomerRequestDTO {

	@NotBlank(message = "Address Line 1 is required")
	@Size(max = 255, message = "Address Line 1 cannot exceed 255 characters")
	private String addressLine1;

	@Size(max = 255, message = "Address Line 2 cannot exceed 255 characters")
	private String addressLine2;

	@NotBlank(message = "City is required")
	@Size(max = 100, message = "City cannot exceed 100 characters")
	private String city;

	@NotBlank(message = "State is required")
	@Size(max = 100, message = "State cannot exceed 100 characters")
	private String state;

	@NotBlank(message = "Pincode is required")
	@Pattern(regexp = "^[1-9][0-9]{5}$", message = "Invalid Indian pincode")
	private String pincode;

	@Pattern(regexp = "^$|^[6-9]\\d{9}$", message = "Emergency contact must be a valid 10-digit mobile number")
	private String emergencyContact;

	@Size(max = 50, message = "Referral code cannot exceed 50 characters")
	private String referralCode;
}