package com.bikerental.partner_service.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PartnerDocumentUploadDto {
    @NotBlank(message = "Document type is compulsory")
    private String docType; // e.g., "GST_CERTIFICATE"
    @NotBlank(message = "File URL is compulsory")
    private String fileUrl; // MinIO URL
}
