package com.bikerental.auth_service.entity;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class UserRoleId implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Column(name = "user_id")
	private Integer userId;

	@Column(name = "role_id")
	private Integer roleId;

	/*
	 * @Override public int hashCode() { return Objects.hash(roleId, userId); }
	 */

	/*
	 * @Override public boolean equals(Object obj) { if (this == obj) return true;
	 * if (obj == null) return false; if (getClass() != obj.getClass()) return
	 * false; UserRoleId other = (UserRoleId) obj; return Objects.equals(roleId,
	 * other.roleId) && Objects.equals(userId, other.userId); }
	 */

	/*
	 * public Integer getUserId() { return userId; }
	 * 
	 * public void setUserId(Integer userId) { this.userId = userId; }
	 * 
	 * public Integer getRoleId() { return roleId; }
	 * 
	 * public void setRoleId(Integer roleId) { this.roleId = roleId; }
	 */

}