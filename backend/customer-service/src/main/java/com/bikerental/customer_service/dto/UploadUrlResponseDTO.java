package com.bikerental.customer_service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UploadUrlResponseDTO {

	private String uploadUrl;

	private String fileUrl;
}