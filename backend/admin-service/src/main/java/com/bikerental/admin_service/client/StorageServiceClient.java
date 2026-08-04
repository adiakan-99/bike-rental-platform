package com.bikerental.admin_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.bikerental.admin_service.admin.DTO.FileDownloadResponseDTO;

@FeignClient(name = "customer-service", url = "${customer.service.url}", contextId = "customerStorageClient")
public interface StorageServiceClient {

	@GetMapping("/api/v1/internal/storage/download-url")
	FileDownloadResponseDTO getDownloadUrl(@RequestParam String objectName);

}
