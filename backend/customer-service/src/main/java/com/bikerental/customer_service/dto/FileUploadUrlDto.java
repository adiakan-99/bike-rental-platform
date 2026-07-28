package com.bikerental.customer_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FileUploadUrlDto {

    private String uploadUrl;

    private String fileUrl;

}