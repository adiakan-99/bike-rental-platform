package com.bikerental.partner_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@AllArgsConstructor
public class ErrorResponse {
    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String message;

    // Used to send back specific field errors (e.g., {"panNumber": "Invalid format"})
    private Map<String, String> validationErrors;
}
