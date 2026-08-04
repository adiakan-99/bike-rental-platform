package com.bikerental.customer_service.customer.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FileUploadRequestDTO {

	@NotBlank
	private String fileName;

	@NotBlank
	private String contentType;

}