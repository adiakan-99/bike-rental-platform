package com.bikerental.customer_service.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FileUploadRequestDto {

    @NotBlank
    private String fileName;

    @NotBlank
    private String contentType;
}