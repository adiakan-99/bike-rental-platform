package com.bikerental.bike_service.service;

import com.bikerental.bike_service.dto.request.FileUploadRequestUrlDto;
import com.bikerental.bike_service.dto.response.FileUploadUrlDto;

public interface StorageServices {
    FileUploadUrlDto getFileUploadUrlDto(FileUploadRequestUrlDto requestDto);
    String getFileDownloadUrl(String permanentFileUrl);
}
