package com.bikerental.admin_service.admin.DTO;

import java.time.OffsetDateTime;

import com.bikerental.admin_service.enums.AccountStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminCustomerResponseDTO {

	private Integer customerId;
	private Integer userId;

	private String firstName;
	private String lastName;
	private String email;
	private String phoneNumber;
	private AccountStatus accountStatus;

	private String addressLine1;
	private String addressLine2;
	private String city;
	private String state;
	private String pincode;
	private String emergencyContact;
	private String referralCode;

	private OffsetDateTime createdAt;
	private OffsetDateTime updatedAt;

}
