package com.bikerental.customer_service.entity;

import java.time.OffsetDateTime;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "customer")
public class Customer {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "customer_id", nullable = false)
	private Integer customerId;

	@NotNull
	@Column(name = "user_id", nullable = false, unique = true)
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
	private OffsetDateTime createdAt;

	@UpdateTimestamp
	@Column(name = "updated_at")
	private OffsetDateTime updatedAt;

	// One Customer -> One KYC
	@OneToOne(mappedBy = "customer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private CustomerKyc customerKyc;
}