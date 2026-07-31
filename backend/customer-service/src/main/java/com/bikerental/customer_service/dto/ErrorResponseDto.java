package com.bikerental.customer_service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.OffsetDateTime;

@Getter
@AllArgsConstructor
public class ErrorResponseDto {

    private OffsetDateTime timestamp;

    private Integer status;

    private String error;

    private String message;
}