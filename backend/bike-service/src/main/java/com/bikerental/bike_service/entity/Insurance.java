package com.bikerental.bike_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "insurance")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Insurance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "insurance_id")
    private Integer insuranceId;

    @Column(name = "insurance_number", nullable = false)
    private String insuranceNumber;

    @Column(name = "policy_provider", nullable = false)
    private String policyProvider;

    @Column(name = "policy_holder_name", nullable = false)
    private String policyHolderName;

    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;

    @Column(name = "insurance_upload_url", length = 500)
    private String insuranceUploadUrl;
}