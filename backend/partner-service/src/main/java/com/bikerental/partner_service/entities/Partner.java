package com.bikerental.partner_service.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "partner", schema = "public", indexes = {
        @Index(name = "partner_gst_unique",
                columnList = "gst_number",
                unique = true),
        @Index(name = "partner_city_idx",
                columnList = "city"),
        @Index(name = "partner_approval_idx",
                columnList = "approval_status")}, uniqueConstraints = {@UniqueConstraint(name = "partner_user_id_key",
        columnNames = {"user_id"})})
public class Partner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "partner_id", nullable = false)
    private Integer id;

    @NotNull
    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Size(max = 30)
    @NotNull
    @ColumnDefault("'INDIVIDUAL'")
    @Column(name = "seller_type", nullable = false, length = 30)
    private String sellerType;

    @Size(max = 150)
    @Column(name = "owner_name", length = 150)
    private String ownerName;

    @Size(max = 10)
    @NotNull
    @Column(name = "pan_number", nullable = false, length = 10)
    private String panNumber;

    @Size(max = 20)
    @Column(name = "contact_phone", length = 20)
    private String contactPhone;

    @Size(max = 255)
    @Column(name = "alternate_email")
    private String alternateEmail;

    @Size(max = 20)
    @Column(name = "alternate_phone_number", length = 20)
    private String alternatePhoneNumber;

    @Size(max = 200)
    @Column(name = "business_name", length = 200)
    private String businessName;

    @Size(max = 200)
    @Column(name = "trade_name", length = 200)
    private String tradeName;

    @Size(max = 15)
    @Column(name = "gst_number", length = 15)
    private String gstNumber;

    @Size(max = 50)
    @Column(name = "business_type", length = 50)
    private String businessType;

    @Size(max = 4)
    @Column(name = "year_of_establishment", length = 4)
    private String yearOfEstablishment;

    @Size(max = 50)
    @Column(name = "udyam_number", length = 50)
    private String udyamNumber;

    @Size(max = 150)
    @Column(name = "signatory_name", length = 150)
    private String signatoryName;

    @Size(max = 100)
    @Column(name = "signatory_designation", length = 100)
    private String signatoryDesignation;

    @Size(max = 100)
    @Column(name = "license_number", length = 100)
    private String licenseNumber;

    @Size(max = 150)
    @Column(name = "issuing_authority", length = 150)
    private String issuingAuthority;

    @Column(name = "license_valid_from")
    private LocalDate licenseValidFrom;

    @Column(name = "license_valid_to")
    private LocalDate licenseValidTo;

    @Size(max = 255)
    @NotNull
    @Column(name = "address_line_1", nullable = false)
    private String addressLine1;

    @Size(max = 255)
    @Column(name = "address_line_2")
    private String addressLine2;

    @Size(max = 100)
    @NotNull
    @Column(name = "city", nullable = false, length = 100)
    private String city;

    @Size(max = 100)
    @NotNull
    @Column(name = "state", nullable = false, length = 100)
    private String state;

    @Size(max = 6)
    @NotNull
    @Column(name = "pincode", nullable = false, length = 6)
    private String pincode;

    @Size(max = 30)
    @NotNull
    @ColumnDefault("'PENDING'")
    @Column(name = "approval_status", nullable = false, length = 30)
    private String approvalStatus;

    @Size(max = 20)
    @NotNull
    @ColumnDefault("'ACTIVE'")
    @Column(name = "account_status", nullable = false, length = 20)
    private String accountStatus;

    @Column(name = "approved_at")
    private OffsetDateTime approvedAt;

    @Column(name = "approved_by")
    private Integer approvedBy;

    @Column(name = "rejection_reason", length = Integer.MAX_VALUE)
    private String rejectionReason;

    @NotNull
    @ColumnDefault("now()")
    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @Column(name = "deleted_at")
    private OffsetDateTime deletedAt;

    @OneToMany(mappedBy = "partner", cascade = CascadeType.ALL)
    private List<PartnerDocument> documents;

    // Add this helper method
    public void addDocument(PartnerDocument document) {
        this.documents.add(document);
        document.setPartner(this); // This links the child back to the parent
    }
}