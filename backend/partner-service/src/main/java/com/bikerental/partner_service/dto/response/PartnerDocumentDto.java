package com.bikerental.partner_service.dto.response;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PartnerDocumentDto {

    private Integer documentId;
    private String docType;
    private String fileUrl;
    private LocalDate expiresAt;

}
