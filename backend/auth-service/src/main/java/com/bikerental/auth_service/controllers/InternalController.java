package com.bikerental.auth_service.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bikerental.auth_service.dto.AddRoleRequest;
import com.bikerental.auth_service.dto.UpdateAccountStatusRequest;
import com.bikerental.auth_service.dto.UserProfileResponse;
import com.bikerental.auth_service.repository.UserRepository;
import com.bikerental.auth_service.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/internal/users")
@RequiredArgsConstructor
public class InternalController {

	private final UserService userService;

	@GetMapping("/{id}")
	public ResponseEntity<UserProfileResponse> getUserById(
			@PathVariable Integer id) {

		return ResponseEntity.ok(userService.getUserById(id));

	}

	@PostMapping("/{id}/roles")
	public ResponseEntity<String> addRoles(
			@PathVariable(name = "id") Integer userId,
			@RequestBody AddRoleRequest request) {

		userService.addRole(userId, request.getRole());

		return ResponseEntity.ok("Role Assigned Successfully");

	}

	@DeleteMapping("/{id}/roles/{roleName}")
	public ResponseEntity<String> removeRole(

			@PathVariable Integer id,

			@PathVariable String roleName) {

		userService.removeRole(id, roleName);

		return ResponseEntity.ok("Role removed successfully.");

	}

	@PutMapping("/{id}/status")
	public ResponseEntity<String> updateStatus(@PathVariable Integer id,
			@RequestBody UpdateAccountStatusRequest request) {

		userService.updateAccountStatus(id, request.getAccountStatus());

		return ResponseEntity.ok(" Account status updated Successfully");

	}

}
