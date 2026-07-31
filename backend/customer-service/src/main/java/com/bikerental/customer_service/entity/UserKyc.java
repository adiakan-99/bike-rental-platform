package com.bikerental.customer_service.entity;

import com.bikerental.customer_service.enums.KycStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "user_kyc")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserKyc {

    @Id
    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @Column(name = "id_type", nullable = false)
    private String idType;

    @Column(name = "id_number", nullable = false, unique = true)
    private String idNumber;

    @Column(name = "id_upload_url", nullable = false)
    private String idUploadUrl;

    @Column(name = "driving_license_number")
    private String drivingLicenseNumber;

    @Column(name = "driving_licence_url")
    private String drivingLicenceUrl;

    @Column(name = "license_valid_to")
    private LocalDate licenseValidTo;

    @Enumerated(EnumType.STRING)
    @Column(name = "kyc_status", nullable = false)
    private KycStatus kycStatus;

    @Column(name = "verified_by")
    private Integer verifiedBy;

    @Column(name = "verified_at")
    private OffsetDateTime verifiedAt;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}