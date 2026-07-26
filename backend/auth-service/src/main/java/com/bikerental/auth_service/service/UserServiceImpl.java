package com.bikerental.auth_service.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bikerental.auth_service.dto.UserProfileResponse;
import com.bikerental.auth_service.entity.User;
import com.bikerental.auth_service.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;

	public UserServiceImpl(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Override
	public User getUserById(Integer id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<User> getAllUser() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void deactivateUser(Integer id) {
		// TODO Auto-generated method stub

	}

	@Override
	public void updateUser(User user) {
		// TODO Auto-generated method stub

	}

	@Override
	public UserProfileResponse getCurrentUser(String email) {
		// TODO Auto-generated method stub
		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

		List<String> roles = user.getUserRoles().stream().map(userRole -> userRole.getRole().getName()).toList();

		return new UserProfileResponse(

				user.getUserId(),

				user.getEmail(),

				user.getFirstName(),

				user.getLastName(),

				user.getPhoneNumber(),

				user.getGender(),

				user.getAccountStatus(),

				roles);
	}

}
