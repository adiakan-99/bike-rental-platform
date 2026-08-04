package com.bikerental.customer_service.customer.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FileUploadUrlDTO {

    private String uploadUrl;

    private String fileUrl;

}