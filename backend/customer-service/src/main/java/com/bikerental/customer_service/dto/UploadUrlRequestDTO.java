package com.bikerental.customer_service.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UploadUrlRequestDTO {

	private String fileName;

	private String contentType;

	private String documentType;

}