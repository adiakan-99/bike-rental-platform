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
@Table(name = "report")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Report {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "report_id")
	private Integer reportId;

	@ManyToOne
	@JoinColumn(name = "booking_id", nullable = false)
	private BikeBookingDetails booking;

	@ManyToOne
	@JoinColumn(name = "raised_by", nullable = false)
	private User raisedBy;

	@Column(name = "report_type")
	private String reportType;

	@Column(nullable = false)
	private String reason;

	@Column(nullable = false)
	private String status;

	@ManyToOne
	@JoinColumn(name = "resolved_by")
	private User resolvedBy;

	@Column(name = "resolved_at")
	private LocalDateTime resolvedAt;

	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;
}