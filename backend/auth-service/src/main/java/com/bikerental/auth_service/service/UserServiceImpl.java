package com.bikerental.auth_service.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.bikerental.auth_service.dto.ChangePasswordRequest;
import com.bikerental.auth_service.dto.ResetPasswordRequest;
import com.bikerental.auth_service.dto.UserProfileResponse;
import com.bikerental.auth_service.entity.PasswordResetToken;
import com.bikerental.auth_service.entity.User;
import com.bikerental.auth_service.repository.PasswordResetTokenRepository;
import com.bikerental.auth_service.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;

	private final PasswordEncoder passwordEncoder;

	private final PasswordResetTokenRepository passwordResetTokenRepository;

	public UserServiceImpl(UserRepository userRepository,
			PasswordEncoder passwordencoder,
			PasswordResetTokenRepository passwordResetTokenRepository) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordencoder;
		this.passwordResetTokenRepository = passwordResetTokenRepository;
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
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("User not found"));

		List<String> roles = user.getUserRoles().stream()
				.map(userRole -> userRole.getRole().getName()).toList();

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

	@Override
	public void changePassword(String email, ChangePasswordRequest request) {
		// TODO Auto-generated method stub
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("User not Found"));

		boolean passwordMatches = passwordEncoder
				.matches(request.getOldPassword(), user.getPassword());

		if (!passwordMatches) {
			throw new RuntimeException("Old password is incorrect");
		}

		user.setPassword(passwordEncoder.encode(request.getNewPassword()));

		userRepository.save(user);

	}

	@Override
	public void forgotPassword(String email) {
		// TODO Auto-generated method stub
		Optional<User> optionalUser = userRepository.findByEmail(email);

		if (optionalUser.isEmpty()) {
			return; // because we don't want attackers discover valid email
		}

		User user = optionalUser.get();

		String token = UUID.randomUUID().toString();

		PasswordResetToken resetToken = PasswordResetToken.builder()
				.token(token).user(user).used(false)
				.createdAt(LocalDateTime.now())
				.expiryTime(LocalDateTime.now().plusMinutes(15)).build();

		passwordResetTokenRepository.save(resetToken);

	}

	@Override
	public void resetPassword(ResetPasswordRequest request) {
		// TODO Auto-generated method stub

		PasswordResetToken token = passwordResetTokenRepository
				.findByToken(request.getToken())
				.orElseThrow(() -> new RuntimeException("Invalid token"));

		if (token.getUsed()) {
			throw new RuntimeException("Token already used");
		}

		if (token.getExpiryTime().isBefore(LocalDateTime.now())) {
			throw new RuntimeException("Token expired.");
		}

		User user = token.getUser();

		if (passwordEncoder.matches(request.getNewPassword(),
				user.getPassword())) {
			throw new RuntimeException(
					"Old Password and New Password could not be same");
		}

		user.setPassword(passwordEncoder.encode(request.getNewPassword()));

		userRepository.save(user);

		token.setUsed(true);

		passwordResetTokenRepository.save(token);

	}

}
