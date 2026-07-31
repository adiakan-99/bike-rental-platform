package com.bikerental.customer_service.controller;

import com.bikerental.customer_service.dto.FileUploadRequestDto;
import com.bikerental.customer_service.dto.FileUploadResponseDto;
import com.bikerental.customer_service.service.StorageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/storage")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CUSTOMER')")
public class StorageController {

    private final StorageService storageService;

    @PostMapping("/upload-url")
    public ResponseEntity<FileUploadResponseDto> generateUploadUrl(
            @Valid @RequestBody FileUploadRequestDto request) {

        return ResponseEntity.ok(
                storageService.generateUploadUrl(request)
        );
    }
}