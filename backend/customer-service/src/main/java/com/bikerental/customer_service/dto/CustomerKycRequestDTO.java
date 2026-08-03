package com.bikerental.customer_service.dto;

import java.time.LocalDate;

import com.bikerental.customer_service.enums.IdType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CustomerKycRequestDTO {

	@NotNull(message = "Date of birth is required")
	@Past(message = "Date of birth must be in past")
	private LocalDate dateOfBirth;

	@NotNull(message = "ID type is required")
	private IdType idType;

	@NotBlank(message = "ID number is required")
	@Size(max = 50, message = "ID number cannot exceed 50 characters")
	private String idNumber;

	@NotBlank(message = "ID upload URL is required")
	@Size(max = 500)
	private String idUploadUrl;

	@Size(max = 50)
	private String drivingLicenseNumber;

	@Size(max = 500)
	private String drivingLicenceUrl;

	private LocalDate licenseValidTo;
}