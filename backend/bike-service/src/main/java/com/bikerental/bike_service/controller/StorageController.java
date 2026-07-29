package com.bikerental.bike_service.controller;

import com.bikerental.bike_service.dto.request.FileUploadRequestUrlDto;
import com.bikerental.bike_service.dto.response.FileUploadUrlDto;
import com.bikerental.bike_service.service.StorageServices;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/bikes")
public class StorageController {
    private final StorageServices storageServices;

    public StorageController(StorageServices storageServices) {
        this.storageServices = storageServices;
    }

    @PostMapping("/upload")
    public ResponseEntity<FileUploadUrlDto> getUploadUrl(@Valid @RequestBody FileUploadRequestUrlDto requestUrlDto) {
        return ResponseEntity.ok(storageServices.getFileUploadUrlDto(requestUrlDto));
    }
}
