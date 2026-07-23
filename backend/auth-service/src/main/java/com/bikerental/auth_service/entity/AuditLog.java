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
@Table(name = "audit_log")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "audit_id")
	private Integer auditId;

	@ManyToOne
	@JoinColumn(name = "actor_user_id")
	private User actorUser;

	@Column(nullable = false)
	private String action;

	@Column(name = "entity_type", nullable = false)
	private String entityType;

	@Column(name = "entity_id", nullable = false)
	private Integer entityId;

	@Column(name = "before_json", columnDefinition = "jsonb")
	private String beforeJson;

	@Column(name = "after_json", columnDefinition = "jsonb")
	private String afterJson;

	@Column(name = "ip_address")
	private String ipAddress;

	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;
}