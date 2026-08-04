package com.bikerental.customer_service.customer.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UploadUrlRequestDTO {

	private String fileName;

	private String contentType;

	private String documentType;

}