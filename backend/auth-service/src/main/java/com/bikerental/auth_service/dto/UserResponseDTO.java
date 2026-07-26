package com.bikerental.auth_service.dto;

import java.util.Set;

import com.bikerental.auth_service.enums.AccountStatus;
import com.bikerental.auth_service.enums.Gender;
import com.bikerental.auth_service.enums.KycStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {

	private Integer userId;

	private String email;

	private String phoneNumber;

	private String firstName;

	private String lastName;

	private Gender gender;

	private AccountStatus accountStatus;

	private KycStatus kycstatus;

	private Boolean isVerified;

	private Set<String> roles;

}
