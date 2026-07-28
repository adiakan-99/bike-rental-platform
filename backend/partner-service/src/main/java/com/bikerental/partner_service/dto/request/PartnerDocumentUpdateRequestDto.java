package com.bikerental.partner_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PartnerDocumentUpdateRequestDto {
    @NotBlank(message = "Document type is required (e.g., PAN, GST, LICENSE)")
    private String docType;

    @NotBlank(message = "File URL reference is required")
    private String fileUrl;
}
