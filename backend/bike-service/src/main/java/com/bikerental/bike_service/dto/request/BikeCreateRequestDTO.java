package com.bikerental.bike_service.dto.request;

import com.bikerental.bike_service.entity.Insurance;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class BikeCreateRequestDTO {

    // Bike Details
    @NotBlank(message = "Model name is required")
    @Size(max = 100)
    private String modelName;

    @NotBlank(message = "Manufacturer is required")
    @Size(max = 100)
    private String manufacturer;

    @NotBlank(message = "Registration number is required")
    @Size(max = 20)
    private String registrationNumber;

    @Size(max = 1000)
    private String description;

    // Pricing
    @NotNull(message = "Price per day is required")
    @DecimalMin(value = "1.0", message = "Price must be greater than 0")
    private BigDecimal hourlyRate;

    @NotNull(message = "Security deposit is required")
    @DecimalMin(value = "0.0", message = "Security deposit cannot be negative")
    private BigDecimal securityDeposit;

    @NotNull(message = "Daily KM limit is required")
    @Positive(message = "Daily KM limit must be positive")
    private Integer dailyKmLimit;

    @NotNull(message = "Extra KM charge is required")
    @DecimalMin(value = "0.0", message = "Extra KM charge cannot be negative")
    private BigDecimal extraKmCharge;

    @NotNull(message = "Bike details are required")
    private BikeDetailRequestDTO bikeDetail;

    @NotNull(message = "Documents are required")
    private DocumentRequestDTO documents;

    @NotEmpty(message = "At least one bike image is required")
    private List<BikeImageRequestDTO> images;

    private List<SpecificationDTO> specifications;



    //insurance mapping

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "insurance_id", nullable = false)
    private Insurance insurance;
}