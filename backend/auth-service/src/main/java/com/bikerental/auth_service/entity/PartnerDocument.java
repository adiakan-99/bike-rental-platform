package com.bikerental.auth_service.entity;

import java.time.LocalDate;
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
@Table(name = "partner_document")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PartnerDocument {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "document_id")
	private Integer documentId;

	@ManyToOne
	@JoinColumn(name = "partner_id", nullable = false)
	private Partner partner;

	@Column(name = "doc_type", nullable = false)
	private String docType;

	@Column(name = "file_url", nullable = false)
	private String fileUrl;

	@Column(nullable = false)
	private String status;

	@Column(name = "expires_at")
	private LocalDate expiresAt;

	@ManyToOne
	@JoinColumn(name = "verified_by")
	private User verifiedBy;

	@Column(name = "verified_at")
	private LocalDateTime verifiedAt;

	@Column(name = "reject_note")
	private String rejectNote;

	@Column(name = "uploaded_at", nullable = false)
	private LocalDateTime uploadedAt;
}