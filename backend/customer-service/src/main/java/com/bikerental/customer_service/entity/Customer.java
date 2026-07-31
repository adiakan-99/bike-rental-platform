package com.bikerental.customer_service.entity;

import com.bikerental.customer_service.enums.AccountStatus;
import com.bikerental.customer_service.enums.KycStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
@Entity
@Table(name = "customer")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    private Integer customerId;
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "customer_id", nullable = false)
	private Integer id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Integer userId;
	@NotNull
	@Column(name = "user_id", nullable = false, unique = true)
	private Integer userId;

	@Size(max = 255)
	@Column(name = "address_line_1")
	private String addressLine1;
    @Column(name = "address_line_1")
    private String addressLine1;

    @Column(name = "address_line_2")
    private String addressLine2;
	@Size(max = 255)
	@Column(name = "address_line_2")
	private String addressLine2;

	@Size(max = 100)
	@Column(name = "city", length = 100)
	private String city;
    @Column(name = "city")
    private String city;

    @Column(name = "state")
    private String state;
	@Size(max = 100)
	@Column(name = "state", length = 100)
	private String state;

    @Column(name = "pincode")
    private String pincode;
	@Size(max = 6)
	@Column(name = "pincode", length = 6, columnDefinition = "char(6)")
	private String pincode;

    @Column(name = "emergency_contact")
    private String emergencyContact;
	@Size(max = 20)
	@Column(name = "emergency_contact", length = 20)
	private String emergencyContact;

    @Column(name = "referral_code")
    private String referralCode;
	@Size(max = 50)
	@Column(name = "referral_code", length = 50)
	private String referralCode;

    @Column(name = "joining_date")
    private OffsetDateTime joiningDate;
	@NotNull
	@ColumnDefault("now()")
	@Column(name = "joining_date", nullable = false)
	private OffsetDateTime createdAt;

	@Column(name = "updated_at")
	private OffsetDateTime updatedAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @NotNull
    @Column(name = "account_status", nullable = false, length = 20)
    private String accountStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "account_status")
    private AccountStatus accountStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "kyc_status")
    private KycStatus kycStatus;
}