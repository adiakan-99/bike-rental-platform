package com.bikerental.customer_service.service;

import com.bikerental.customer_service.customer.DTO.UploadUrlRequestDTO;
import com.bikerental.customer_service.customer.DTO.UploadUrlResponseDTO;

public interface StorageService {

	UploadUrlResponseDTO generateUploadUrl(Integer userId,
			UploadUrlRequestDTO request);
}