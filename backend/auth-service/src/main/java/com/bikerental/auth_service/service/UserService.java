package com.bikerental.auth_service.service;

import java.util.List;

import com.bikerental.auth_service.dto.AdminResponseDTO;
import com.bikerental.auth_service.dto.ChangePasswordRequest;
import com.bikerental.auth_service.dto.CreateAdminRequest;
import com.bikerental.auth_service.dto.ResetPasswordRequest;
import com.bikerental.auth_service.dto.UpdateProfileRequestDTO;
import com.bikerental.auth_service.dto.UpdateProfileResponseDTO;
import com.bikerental.auth_service.dto.UserProfileResponse;
import com.bikerental.auth_service.entity.User;
import com.bikerental.auth_service.enums.AccountStatus;

public interface UserService {

	UserProfileResponse getUserById(Integer id);

	List<User> getAllUser();

	void deactivateUser(Integer id);

	void updateUser(User user);

	UserProfileResponse getCurrentUser(String email);

	void changePassword(String email, ChangePasswordRequest request);

	String forgotPassword(String email);

	void resetPassword(ResetPasswordRequest request);

	void addRole(Integer userId, String roleName);

	void removeRole(Integer userId, String roleName);

	void updateAccountStatus(Integer userId, AccountStatus accountStatus);

	UpdateProfileResponseDTO updateProfile(Integer userId,
			UpdateProfileRequestDTO request);

	AdminResponseDTO createAdmin(CreateAdminRequest request);

	List<AdminResponseDTO> getAllAdmins();
}
