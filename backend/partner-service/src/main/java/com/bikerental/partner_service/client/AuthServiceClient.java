package com.bikerental.partner_service.client;

import com.bikerental.partner_service.config.FeignClientConfig;
import com.bikerental.partner_service.dto.request.internal.UserAddRoleRequestDto;
import com.bikerental.partner_service.dto.request.internal.UserStatusUpdateRequestDto;
import com.bikerental.partner_service.dto.response.internal.UserDataResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "auth-service", url = "${auth.service.url}", configuration = FeignClientConfig.class)
public interface AuthServiceClient {
    @PutMapping("/api/v1/internal/users/{id}/status")
    String updateUserStatus(@PathVariable("id") Integer id, UserStatusUpdateRequestDto requestDto);

    @PostMapping("/api/v1/internal/users/{id}/roles")
    String addUserRole(@PathVariable("id")  Integer id, UserAddRoleRequestDto requestDto);

    @GetMapping("/api/v1/internal/users/{id}")
    UserDataResponseDto getUserData(@PathVariable("id")  Integer id);

    @DeleteMapping("/api/v1/internal/users/{id}/roles/{roleName}")
    String deleteUserRole(@PathVariable("id")  Integer id, @PathVariable("roleName") String roleName);
}
