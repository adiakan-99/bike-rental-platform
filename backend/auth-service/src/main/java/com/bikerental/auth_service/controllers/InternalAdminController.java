package com.bikerental.auth_service.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bikerental.auth_service.dto.AdminResponseDTO;
import com.bikerental.auth_service.dto.CreateAdminRequest;
import com.bikerental.auth_service.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/internal/admins")
@RequiredArgsConstructor
public class InternalAdminController {

	private final UserService userService;

	@PostMapping
	public ResponseEntity<AdminResponseDTO> createAdmin(
			@Valid @RequestBody CreateAdminRequest request) {

		return ResponseEntity.status(HttpStatus.CREATED)
				.body(userService.createAdmin(request));
	}

	@GetMapping
	public ResponseEntity<List<AdminResponseDTO>> getAdmins() {

		return ResponseEntity.ok(userService.getAllAdmins());
	}

}