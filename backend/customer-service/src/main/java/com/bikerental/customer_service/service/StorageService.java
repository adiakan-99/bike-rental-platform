package com.bikerental.customer_service.service;

import com.bikerental.customer_service.dto.FileUploadRequestUrlDto;
import com.bikerental.customer_service.dto.FileUploadUrlDto;

public interface StorageService {

    FileUploadUrlDto generateUploadUrl(FileUploadRequestUrlDto request);

}