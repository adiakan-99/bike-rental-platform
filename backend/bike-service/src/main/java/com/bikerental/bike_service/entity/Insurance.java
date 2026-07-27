package com.bikerental.bike_service.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "insurance")
public class Insurance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "insurance_id", nullable = false)
    private Integer id;

    @Size(max = 100)
    @NotNull
    @Column(name = "insurance_number", nullable = false, length = 100)
    private String insuranceNumber;

    @Size(max = 150)
    @NotNull
    @Column(name = "policy_provider", nullable = false, length = 150)
    private String policyProvider;

    @Size(max = 150)
    @NotNull
    @Column(name = "policy_holder_name", nullable = false, length = 150)
    private String policyHolderName;

    @NotNull
    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;
}