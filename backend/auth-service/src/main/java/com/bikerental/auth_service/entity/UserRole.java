package com.bikerental.auth_service.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "user_roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserRole {

	@EmbeddedId
	private UserRoleId id;

	@ManyToOne
	@MapsId("userId")
	@JoinColumn(name = "user_id")
	private User user;

	@ManyToOne
	@MapsId("roleId")
	@JoinColumn(name = "role_id")
	private Role role;

	@ManyToOne
	@JoinColumn(name = "assigned_by")
	private User assignedBy;

	@Column(name = "assigned_at", nullable = false)
	private LocalDateTime assignedAt;

	/*
	 * public UserRoleId getId() { return id; }
	 * 
	 * public User getUser() { return user; }
	 * 
	 * public void setUser(User user) { this.user = user; }
	 * 
	 * public Role getRole() { return role; }
	 * 
	 * public void setRole(Role role) { this.role = role; }
	 * 
	 * public User getAssignedBy() { return assignedBy; }
	 * 
	 * public void setAssignedBy(User assignedBy) { this.assignedBy = assignedBy; }
	 * 
	 * public LocalDateTime getAssignedAt() { return assignedAt; }
	 * 
	 * public void setAssignedAt(LocalDateTime assignedAt) { this.assignedAt =
	 * assignedAt; }
	 * 
	 * public void setId(UserRoleId id) { this.id = id; }
	 */

}
