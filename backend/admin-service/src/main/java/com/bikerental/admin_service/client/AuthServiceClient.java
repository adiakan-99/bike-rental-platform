package com.bikerental.admin_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.bikerental.admin_service.admin.DTO.UserResponseDTO;
import com.bikerental.admin_service.config.FeignClientConfig;

@FeignClient(name = "auth-service", url = "${auth.service.url}", configuration = FeignClientConfig.class)
public interface AuthServiceClient {

	@GetMapping("/api/v1/internal/users/{userId}")
	UserResponseDTO getUser(@PathVariable Integer userId);

}
