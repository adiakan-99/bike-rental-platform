package com.bikerental.customer_service.service;

import com.bikerental.customer_service.dto.FileUploadRequestDto;
import com.bikerental.customer_service.dto.FileUploadResponseDto;
import org.springframework.web.multipart.MultipartFile;

public interface StorageService {

    FileUploadResponseDto generateUploadUrl(FileUploadRequestDto request);
}