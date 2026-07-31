package com.bikerental.customer_service.controller;

import com.bikerental.customer_service.dto.UserKycRequestDto;
import com.bikerental.customer_service.dto.UserKycResponseDto;
import com.bikerental.customer_service.security.JwtUser;
import com.bikerental.customer_service.service.UserKycService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/customers")
@RequestMapping("/api/customers/me/kyc")
@RequiredArgsConstructor
public class UserKycController {

    private final UserKycService userKycService;

    @PostMapping("/kyc")
    public ResponseEntity<UserKycResponseDto> createKyc(
            @Valid @RequestBody UserKycRequestDto request,
            Authentication authentication) {

        JwtUser jwtUser = (JwtUser) authentication.getPrincipal();

        UserKycResponseDto response =
                userKycService.createKyc(request, jwtUser.getUserId());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<UserKycResponseDto> getMyKyc(
            Authentication authentication) {

        JwtUser jwtUser = (JwtUser) authentication.getPrincipal();

        return ResponseEntity.ok(
                userKycService.getKyc(jwtUser.getUserId())
        );
    }

    @PutMapping
    public ResponseEntity<UserKycResponseDto> updateKyc(
            @Valid @RequestBody UserKycRequestDto request,
            Authentication authentication) {

        JwtUser jwtUser = (JwtUser) authentication.getPrincipal();

        return ResponseEntity.ok(
                userKycService.updateKyc(request, jwtUser.getUserId())
        );
    }
}