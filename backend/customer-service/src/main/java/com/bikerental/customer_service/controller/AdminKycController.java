package com.bikerental.customer_service.controller;

import com.bikerental.customer_service.dto.AdminKycResponseDto;
import com.bikerental.customer_service.security.JwtUser;
import com.bikerental.customer_service.service.AdminKycService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/kyc")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminKycController {

    private final AdminKycService adminKycService;

    @GetMapping("/pending")
    public ResponseEntity<List<AdminKycResponseDto>> getPendingKycs() {

        return ResponseEntity.ok(
                adminKycService.getPendingKycs()
        );
    }

    @PutMapping("/{userId}/approve")
    public ResponseEntity<AdminKycResponseDto> approveKyc(
            @PathVariable Integer userId,
            Authentication authentication) {

        JwtUser admin = (JwtUser) authentication.getPrincipal();

        return ResponseEntity.ok(
                adminKycService.approveKyc(userId, admin.getUserId())
        );
    }

    @PutMapping("/{userId}/reject")
    public ResponseEntity<AdminKycResponseDto> rejectKyc(
            @PathVariable Integer userId,
            Authentication authentication) {

        JwtUser admin = (JwtUser) authentication.getPrincipal();

        return ResponseEntity.ok(
                adminKycService.rejectKyc(userId, admin.getUserId())
        );
    }
}