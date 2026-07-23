package com.bikerental.auth_service.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "partner_payout_account")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PartnerPayoutAccount {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "payout_id")
	private Integer payoutId;

	@ManyToOne
	@JoinColumn(name = "partner_id", nullable = false)
	private Partner partner;

	@Column(name = "account_holder", nullable = false)
	private String accountHolder;

	@Column(name = "account_number", nullable = false)
	private String accountNumber;

	@Column(nullable = false, length = 11)
	private String ifsc;

	@Column(name = "bank_name")
	private String bankName;

	@Column(name = "is_primary", nullable = false)
	private Boolean isPrimary = true;

	@Column(name = "verified_at")
	private LocalDateTime verifiedAt;

	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;
}