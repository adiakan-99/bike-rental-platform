package com.bikerental.auth_service.controllers;

import java.util.Map;

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
import com.bikerental.auth_service.dto.UserDashboardStatsDTO;
import com.bikerental.auth_service.dto.UserProfileResponse;
import com.bikerental.auth_service.service.InternalUserService;
import com.bikerental.auth_service.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/internal/users")
@RequiredArgsConstructor
public class InternalController {

	private final UserService userService;

	private final InternalUserService internalUserService;

	@GetMapping("/{id}")
	public ResponseEntity<UserProfileResponse> getUserById(
			@PathVariable Integer id) {
		return ResponseEntity.ok(userService.getUserById(id));
	}

	@PostMapping("/{id}/roles")
	public ResponseEntity<?> addRoles(@PathVariable(name = "id") Integer userId,
			@Valid @RequestBody AddRoleRequest request) {
		userService.addRole(userId, request.getRole());
		return ResponseEntity
				.ok(Map.of("message", "Role assigned successfully"));
	}

	@DeleteMapping("/{id}/roles/{roleName}")
	public ResponseEntity<?> removeRole(@PathVariable Integer id,
			@PathVariable String roleName) {
		userService.removeRole(id, roleName);
		return ResponseEntity
				.ok(Map.of("message", "Role removed successfully"));
	}

	@PutMapping("/{id}/status")
	public ResponseEntity<?> updateStatus(@PathVariable Integer id,
			@Valid @RequestBody UpdateAccountStatusRequest request) {
		userService.updateAccountStatus(id, request.getAccountStatus());
		return ResponseEntity
				.ok(Map.of("message", "Account status updated successfully"));
	}

	@GetMapping("/dashboard/stats")
	public ResponseEntity<UserDashboardStatsDTO> getDashboardStatus() {

		return ResponseEntity.ok(internalUserService.getDashboardStats());
	}

}