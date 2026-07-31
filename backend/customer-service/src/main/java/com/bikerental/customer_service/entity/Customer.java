package com.bikerental.customer_service.entity;

import com.bikerental.customer_service.enums.KycStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.OffsetDateTime;

@Getter
@Setter
@Entity
@Table(name = "customer")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id", nullable = false)
    private Integer id;

    @NotNull
    @Column(name = "user_id")
    private Integer userId;

    @Size(max = 255)
    @Column(name = "address_line_1")
    private String addressLine1;

    @Size(max = 255)
    @Column(name = "address_line_2")
    private String addressLine2;

    @Size(max = 100)
    @Column(name = "city", length = 100)
    private String city;

    @Size(max = 100)
    @Column(name = "state", length = 100)
    private String state;

    @Size(max = 6)
    @Column(name = "pincode", length = 6, columnDefinition = "char(6)")
    private String pincode;

    @Size(max = 20)
    @Column(name = "emergency_contact", length = 20)
    private String emergencyContact;

    @Size(max = 50)
    @Column(name = "referral_code", length = 50)
    private String referralCode;

    @NotNull
    @ColumnDefault("now()")
    @Column(name = "joining_date", nullable = false)
    private OffsetDateTime joiningDate;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
    
    @NotNull
    @Column(name = "account_status", nullable = false, length = 20)
    private String accountStatus;

    @Column(name = "is_verified", nullable = false)
    private Boolean isVerified = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "kyc_status", nullable = false)
    private KycStatus kycStatus = KycStatus.NOT_SUBMITTED;
}