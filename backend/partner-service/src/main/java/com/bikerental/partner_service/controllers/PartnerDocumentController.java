package com.bikerental.partner_service.controllers;

import com.bikerental.partner_service.dto.FileUploadRequestUrlDto;
import com.bikerental.partner_service.dto.FileUploadUrlDto;
import com.bikerental.partner_service.services.StorageServices;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/partners/documents")
public class PartnerDocumentController {

    private final StorageServices storageServices;

    public PartnerDocumentController(StorageServices storageServices) {
        this.storageServices = storageServices;
    }

    private Integer getAuthenticatedUserId() {
        return (Integer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @PostMapping("/upload-url")
    public ResponseEntity<FileUploadUrlDto> getUploadUrl(@RequestBody FileUploadRequestUrlDto requestDto) {
        Integer userId = getAuthenticatedUserId();
        FileUploadUrlDto responseDto = storageServices.getFileUploadUrl(requestDto, userId);
        return ResponseEntity.ok(responseDto);
    }
}
