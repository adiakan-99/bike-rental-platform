package com.bikerental.partner_service.services;

import com.bikerental.partner_service.dto.request.FileUploadRequestUrlDto;
import com.bikerental.partner_service.dto.response.FileUploadUrlDto;

public interface StorageServices {
    FileUploadUrlDto getFileUploadUrl(FileUploadRequestUrlDto fileUploadRequestUrlDto, Integer userId);
    String getFileDownloadUrl(String permanentFileUrl);
}
