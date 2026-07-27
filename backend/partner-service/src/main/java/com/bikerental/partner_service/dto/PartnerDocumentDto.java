package com.bikerental.partner_service.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.OffsetDateTime;

@Data
public class PartnerDocumentDto {

    private Integer documentId;
    private String docType;
    private String fileUrl;
    private LocalDate expiresAt;

}
