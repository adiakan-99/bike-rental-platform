package com.bikerental.customer_service.service.impl;

import com.bikerental.customer_service.dto.FileUploadRequestUrlDto;
import com.bikerental.customer_service.dto.FileUploadUrlDto;
import com.bikerental.customer_service.service.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StorageServiceImpl implements StorageService {

    @Override
    public FileUploadUrlDto generateUploadUrl(FileUploadRequestUrlDto request) {
        throw new UnsupportedOperationException("Storage service is not implemented yet.");
    }
}