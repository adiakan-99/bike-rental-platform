package com.bikerental.customer_service.customer.DTO;

import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class CustomerResponseDTO {

	private Integer customerId;
	private Integer userId;
	private String addressLine1;
	private String addressLine2;
	private String city;
	private String state;
	private String pincode;
	private String emergencyContact;
	private String referralCode;
	private OffsetDateTime updatedAt;
	private OffsetDateTime createdAt;

}