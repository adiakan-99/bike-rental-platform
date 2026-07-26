package com.bikerental.auth_service.util;

import com.bikerental.auth_service.dto.UserProfileResponse;
import com.bikerental.auth_service.entity.User;

public class UserMapper {

	public static UserProfileResponse

			toDTO(User user) {

		UserProfileResponse dto = new UserProfileResponse();

		dto.setUserId(user.getUserId());
		dto.setEmail(user.getEmail());
		dto.setPhoneNumber(user.getPhoneNumber());
		dto.setFirstName(user.getFirstName());
		dto.setLastName(user.getLastName());
		dto.setGender(user.getGender());
		dto.setAccountStatus(user.getAccountStatus());

		if (user.getUserRoles() != null) {

			dto.setRoles(user.getUserRoles().stream().map(role -> role.getRole().getName()).toList());
		}

		return dto;
	}

}
