package com.bikerental.customer_service.dto;

import lombok.Data;

@Data
public class FileUploadRequestUrlDto {

    private String fileName;

    private String contentType;

}