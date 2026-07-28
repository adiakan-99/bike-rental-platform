package com.bikerental.bike_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Value;

@Value
public class FileUploadRequestUrlDto {
    @NotBlank(message = "File name cannot be empty")
    String fileName;

    @NotBlank(message = "Content type cannot be empty")
    String contentType;

    @NotBlank(message = "Document type cannot be empty")
    String documentType;
}
