package com.bikerental.customer_service.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;
import java.time.OffsetDateTime;

@Getter
@Setter
@Entity
@Table(name = "user_kyc")
public class UserKyc {
    @Id
    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @Size(max = 20)
    @NotNull
    @ColumnDefault("'AADHAAR'")
    @Column(name = "id_type", nullable = false, length = 20)
    private String idType;

    @Size(max = 50)
    @NotNull
    @Column(name = "id_number", nullable = false, length = 50)
    private String idNumber;

    @Size(max = 500)
    @NotNull
    @Column(name = "id_upload_url", nullable = false, length = 500)
    private String idUploadUrl;

    @Size(max = 50)
    @Column(name = "driving_license_number", length = 50)
    private String drivingLicenseNumber;

    @Size(max = 500)
    @Column(name = "driving_licence_url", length = 500)
    private String drivingLicenceUrl;

    @Column(name = "license_valid_to")
    private LocalDate licenseValidTo;

    @Size(max = 20)
    @NotNull
    @ColumnDefault("'PENDING'")
    @Column(name = "kyc_status", nullable = false, length = 20)
    private String kycStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "verified_by")
    private User verifiedBy;

    @Column(name = "verified_at")
    private OffsetDateTime verifiedAt;

    @NotNull
    @ColumnDefault("now()")
    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;


}