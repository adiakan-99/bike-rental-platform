package com.bikerental.bike_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SpecificationDTO {

    @NotBlank(message = "Specification name is required")
    private String key;

    @NotBlank(message = "Specification value is required")
    private String value;
}