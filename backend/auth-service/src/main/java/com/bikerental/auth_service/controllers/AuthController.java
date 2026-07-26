package com.bikerental.auth_service.controllers;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bikerental.auth_service.dto.LoginRequest;
import com.bikerental.auth_service.dto.RegisterRequest;
import com.bikerental.auth_service.dto.UserProfileResponse;
import com.bikerental.auth_service.service.AuthenticationService;
import com.bikerental.auth_service.service.CaptchaService;
import com.bikerental.auth_service.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

	private final AuthenticationService authenticationService;

	private final UserService userService;

	private final CaptchaService captchaService;

	public AuthController(AuthenticationService authenticationService, UserService userService,
			CaptchaService captchaService) {
		this.authenticationService = authenticationService;
		this.userService = userService;
		this.captchaService = captchaService;
	}

	@PostMapping("/register")
	@CrossOrigin(origins = "http://localhost:5173")
	public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {

		boolean isHuman = captchaService.verifyCaptcha(request.getCaptchaToken());

		if (!isHuman) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(Map.of("message", "CAPTCHA verification failed. Please try again"));
		}

		return ResponseEntity.status(HttpStatus.CREATED).body(authenticationService.register(request));
	}

	@PostMapping("/login")
	public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {

		System.out.println(request.getEmail());
		System.out.println(request.getPassword());

		return ResponseEntity.ok(authenticationService.login(request));

	}

	/*
	 * @GetMapping("/me") private ResponseEntity<UserProfileResponse>
	 * getCurrentUser(Authentication authentication) {
	 * 
	 * String email = authentication.getName();
	 * 
	 * return ResponseEntity.ok(userService.getCurrentUser(email)); }
	 */

}