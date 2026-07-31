package com.bikerental.bike_service.entity;

import com.bikerental.bike_service.enums.ApprovalStatus;
import com.bikerental.bike_service.enums.BikeStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "bike", indexes = {
        @Index(name = "bike_approval_idx", columnList = "approval_status"),
        @Index(name = "bike_partner_idx", columnList = "partner_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bike_id")
    private Integer bikeId;

    @Column(name = "partner_id", nullable = false)
    private Integer partnerId;

    @Column(name = "registration_number", nullable = false)
    private String registrationNumber;

    @Column(name = "rc_upload_url", nullable = false)
    private String rcUploadUrl;

    @Column(name = "puc_upload_url", nullable = false)
    private String pucUploadUrl;

    @Column(name = "manufacturer", nullable = false)
    private String manufacturer;

    @Column(name = "model", nullable = false)
    private String model;

    @Column(name = "hourly_rate", precision = 10, scale = 2, nullable = false)
    private BigDecimal hourlyRate;

    @Column(name = "security_deposit", precision = 10, scale = 2)
    private BigDecimal securityDeposit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "insurance_id", nullable = false)
    private Insurance insurance;

    @Enumerated(EnumType.STRING)
    @Column(name = "bike_status", nullable = false)
    private BikeStatus bikeStatus = BikeStatus.INACTIVE;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "additional_services", columnDefinition = "jsonb")
    private Map<String, Object> additionalServices;

    @Enumerated(EnumType.STRING)
    @Column(name = "approval_status", nullable = false)
    private ApprovalStatus approvalStatus = ApprovalStatus.PENDING;

    @Column(name = "approved_by")
    private Integer approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "rejection_reason")
    private String rejectionReason;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Column(name = "registration_expiry", nullable = false)
    private LocalDate registrationExpiry;

    @Column(name = "puc_expiry", nullable = false)
    private LocalDate pucExpiry;

    // Relationships
    @OneToOne(mappedBy = "bike", cascade = CascadeType.ALL, orphanRemoval = true)
    private BikeDetails bikeDetails;

    @OneToMany(mappedBy = "bike", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<BikeImage> bikeImages;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.bikeStatus == null) this.bikeStatus = BikeStatus.INACTIVE;
        if (this.approvalStatus == null) this.approvalStatus = ApprovalStatus.PENDING;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}