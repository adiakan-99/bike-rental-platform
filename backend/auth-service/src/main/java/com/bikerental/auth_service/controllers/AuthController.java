package com.bikerental.auth_service.controllers;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bikerental.auth_service.dto.ChangePasswordRequest;
import com.bikerental.auth_service.dto.ForgotPasswordRequest;
import com.bikerental.auth_service.dto.LoginRequest;
import com.bikerental.auth_service.dto.RegisterRequest;
import com.bikerental.auth_service.dto.ResetPasswordRequest;
import com.bikerental.auth_service.dto.UpdateProfileRequestDTO;
import com.bikerental.auth_service.dto.UpdateProfileResponseDTO;
import com.bikerental.auth_service.dto.UserProfileResponse;
import com.bikerental.auth_service.security.CustomUserDetails;
import com.bikerental.auth_service.security.JwtUser;
import com.bikerental.auth_service.service.AuthenticationService;
import com.bikerental.auth_service.service.CaptchaServiceImpl;
import com.bikerental.auth_service.service.UserService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@AllArgsConstructor
public class AuthController {

	private final AuthenticationService authenticationService;
	private final UserService userService;
	private final CaptchaServiceImpl captchaService;

	@PostMapping("/register")
	public ResponseEntity<?> register(
			@Valid @RequestBody RegisterRequest request) {
		boolean isHuman = captchaService
				.verifyCaptcha(request.getCaptchaToken());

		if (!isHuman) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(Map.of("message",
							"CAPTCHA verification failed. Please try again"));
		}

		return ResponseEntity.status(HttpStatus.CREATED)
				.body(authenticationService.register(request));
	}

	@PostMapping("/login")
	public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
		return ResponseEntity.ok(authenticationService.login(request));
	}

	@GetMapping("/me")
	public ResponseEntity<UserProfileResponse> getCurrentUser(
			Authentication authentication) {
		String email = authentication.getName();
		UserProfileResponse response = userService.getCurrentUser(email);
		return ResponseEntity.ok(response);
	}

	@PutMapping("/password")
	public ResponseEntity<?> changePassword(
			@Valid @RequestBody ChangePasswordRequest request,
			Authentication authentication) {
		String email = authentication.getName();
		userService.changePassword(email, request);
		return ResponseEntity
				.ok(Map.of("message", "Password updated successfully"));
	}

	@PostMapping("/forgot-password")
	public ResponseEntity<?> forgotPassword(
			@Valid @RequestBody ForgotPasswordRequest request) {
		return ResponseEntity.ok(Map.of("message",
				"If an account exists, a password reset link has been sent"));
	}

	@PostMapping("/reset-password")
	public ResponseEntity<?> resetPassword(
			@Valid @RequestBody ResetPasswordRequest request) {
		userService.resetPassword(request);
		return ResponseEntity
				.ok(Map.of("message", "Password reset successfully"));
	}

	@PutMapping("/me")
	public ResponseEntity<UpdateProfileResponseDTO> updateProfile(
			Authentication authentication,
			@Valid @RequestBody UpdateProfileRequestDTO request) {

		CustomUserDetails userDetails = (CustomUserDetails) authentication
				.getPrincipal();

		return ResponseEntity
				.ok(userService.updateProfile(userDetails.getUserId(), request));

	}

}