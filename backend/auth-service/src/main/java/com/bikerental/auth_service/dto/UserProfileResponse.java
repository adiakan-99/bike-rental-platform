package com.bikerental.auth_service.dto;

import java.util.List;

import com.bikerental.auth_service.enums.AccountStatus;
import com.bikerental.auth_service.enums.Gender;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {

	private Integer userId;

	private String email;

	private String firstName;

	private String lastName;

	private String phoneNumber;

	private Gender gender;

	private AccountStatus accountStatus;

	private List<String> roles;

}