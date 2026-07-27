package com.bikerental.auth_service.service;

import java.util.List;

import com.bikerental.auth_service.dto.ChangePasswordRequest;
import com.bikerental.auth_service.dto.ResetPasswordRequest;
import com.bikerental.auth_service.dto.UserProfileResponse;
import com.bikerental.auth_service.entity.User;

public interface UserService {

	User getUserById(Integer id);

	List<User> getAllUser();

	void deactivateUser(Integer id);

	void updateUser(User user);

	UserProfileResponse getCurrentUser(String email);

	void changePassword(String email, ChangePasswordRequest request);

	void forgotPassword(String email);

	void resetPassword(ResetPasswordRequest request);
}
