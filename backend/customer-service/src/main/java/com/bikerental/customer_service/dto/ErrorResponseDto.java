package com.bikerental.customer_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@AllArgsConstructor
public class ErrorResponseDto {

    private OffsetDateTime timestamp;

    private Integer status;

    private String error;

    private String message;

}