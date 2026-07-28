package com.bikerental.customer_service.controller;

import com.bikerental.customer_service.dto.UserKycRequestDto;
import com.bikerental.customer_service.dto.UserKycResponseDto;
import com.bikerental.customer_service.service.UserKycService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/kyc")
@RequiredArgsConstructor
public class UserKycController {

    private final UserKycService userKycService;

    @PostMapping
    public ResponseEntity<UserKycResponseDto> createKyc(
            @RequestBody UserKycRequestDto request) {

        UserKycResponseDto response =
                userKycService.createKyc(request, 1);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}