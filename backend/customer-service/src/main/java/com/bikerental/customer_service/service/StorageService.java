package com.bikerental.customer_service.service;

import com.bikerental.customer_service.dto.UploadUrlRequestDTO;
import com.bikerental.customer_service.dto.UploadUrlResponseDTO;

public interface StorageService {

	UploadUrlResponseDTO generateUploadUrl(Integer userId,
			UploadUrlRequestDTO request);
}