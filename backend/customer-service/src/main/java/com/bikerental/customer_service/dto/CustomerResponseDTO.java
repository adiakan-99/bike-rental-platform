package com.bikerental.customer_service.dto;

import com.bikerental.customer_service.enums.AccountStatus;
import com.bikerental.customer_service.enums.KycStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
public class CustomerResponseDto {

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

    private Integer customerId;
    private Integer userId;

    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;

    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String pincode;

    private AccountStatus accountStatus;

    private Boolean isVerified;

    private KycStatus kycStatus;

    private OffsetDateTime joiningDate;
}