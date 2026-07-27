package com.bikerental.bike_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class DocumentRequestDTO {

    @NotBlank(message = "RC document URL is required")
    private String rcCertificateUrl;

    @NotNull(message = "RC expiry date is required")
    private LocalDate rcExpiryDate;

    @NotBlank(message = "Insurance document URL is required")
    private String insuranceUrl;

    @NotNull(message = "Insurance expiry date is required")
    private LocalDate insuranceExpiryDate;

    @NotBlank(message = "PUC document URL is required")
    private String pucUrl;

    @NotNull(message = "PUC expiry date is required")
    private LocalDate pucExpiryDate;
}