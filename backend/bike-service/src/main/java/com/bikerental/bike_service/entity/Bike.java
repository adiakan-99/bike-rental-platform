package com.bikerental.bike_service.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Map;

@Getter
@Setter
@Entity
@Table(name = "bike")
public class Bike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bike_id", nullable = false)
    private Integer id;

    @NotNull
    @Column(name = "partner_id", nullable = false)
    private Integer partnerId;

    @Size(max = 20)
    @NotNull
    @Column(name = "registration_number", nullable = false, length = 20)
    private String registrationNumber;

    @Size(max = 500)
    @NotNull
    @Column(name = "rc_upload_url", nullable = false, length = 500)
    private String rcUploadUrl;

    @Size(max = 500)
    @NotNull
    @Column(name = "puc_upload_url", nullable = false, length = 500)
    private String pucUploadUrl;

    @NotNull
    @Column(name = "registration_expiry", nullable = false)
    private LocalDate registrationExpiry;

    @NotNull
    @Column(name = "puc_expiry", nullable = false)
    private LocalDate pucExpiry;

    @Size(max = 100)
    @NotNull
    @Column(name = "manufacturer", nullable = false, length = 100)
    private String manufacturer;

    @Size(max = 100)
    @NotNull
    @Column(name = "model", nullable = false, length = 100)
    private String model;

    @NotNull
    @Column(name = "hourly_rate", nullable = false, precision = 10, scale = 2)
    private BigDecimal hourlyRate;

    @Column(name = "security_deposit", precision = 10, scale = 2)
    private BigDecimal securityDeposit;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "insurance_id", nullable = false)
    private Insurance insurance;

    @Size(max = 20)
    @NotNull
    @ColumnDefault("'DRAFT'")
    @Column(name = "bike_status", nullable = false, length = 20)
    private String bikeStatus;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "additional_services")
    private Map<String, Object> additionalServices;

    @Size(max = 30)
    @NotNull
    @ColumnDefault("'PENDING_APPROVAL'")
    @Column(name = "approval_status", nullable = false, length = 30)
    private String approvalStatus;

    @Column(name = "approved_by")
    private Integer approvedBy;

    @Column(name = "approved_at")
    private OffsetDateTime approvedAt;

    @Column(name = "rejection_reason")
    private String rejectionReason;

    @NotNull
    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @Column(name = "deleted_at")
    private OffsetDateTime deletedAt;
}