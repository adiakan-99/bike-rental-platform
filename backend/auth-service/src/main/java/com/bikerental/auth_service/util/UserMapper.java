package com.bikerental.auth_service.util;

import java.util.stream.Collectors;

import com.bikerental.auth_service.dto.UserResponseDTO;
import com.bikerental.auth_service.entity.User;

public class UserMapper {

	public static UserResponseDTO toDTO(User user) {

		UserResponseDTO dto = new UserResponseDTO();

		dto.setUserId(user.getUserId());
		dto.setEmail(user.getEmail());
		dto.setPhoneNumber(user.getPhoneNumber());
		dto.setFirstName(user.getFirstName());
		dto.setLastName(user.getLastName());
		dto.setGender(user.getGender());
		dto.setAccountStatus(user.getAccountStatus());
		dto.setKycstatus(user.getKycStatus());

		if (user.getUserRoles() != null) {

			dto.setRoles(
					user.getUserRoles().stream().map(role -> role.getRole().getName()).collect(Collectors.toSet()));
		}

		return dto;
	}

}
