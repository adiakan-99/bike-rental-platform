package com.bikerental.auth_service.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "insurance")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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
}