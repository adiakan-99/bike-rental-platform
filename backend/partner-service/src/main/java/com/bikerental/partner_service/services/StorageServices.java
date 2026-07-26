package com.bikerental.partner_service.services;

import com.bikerental.partner_service.dto.FileUploadRequestUrlDto;
import com.bikerental.partner_service.dto.FileUploadUrlDto;

public interface StorageServices {
    FileUploadUrlDto getFileUploadUrl(FileUploadRequestUrlDto fileUploadRequestUrlDto, Integer userId);
    String getFileDownloadUrl(String permanentFileUrl);
}
