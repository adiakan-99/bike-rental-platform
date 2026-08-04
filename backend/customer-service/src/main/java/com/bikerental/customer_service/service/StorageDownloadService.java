package com.bikerental.customer_service.service;

import com.bikerental.customer_service.customer.DTO.FileDownloadResponseDTO;

public interface StorageDownloadService {

	FileDownloadResponseDTO generateDownloadUrl(String fileUrl);

}
