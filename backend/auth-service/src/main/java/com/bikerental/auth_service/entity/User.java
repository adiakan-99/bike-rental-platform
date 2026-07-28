package com.bikerental.auth_service.entity;

import java.time.LocalDateTime;
import java.util.Set;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.bikerental.auth_service.enums.AccountStatus;
import com.bikerental.auth_service.enums.Gender;
import com.bikerental.auth_service.enums.KycStatus;
import com.bikerental.auth_service.enums.PartnerStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_id")
	private Integer userId;

	@Column(name = "email", nullable = false, unique = true)
	private String email;

	@Column(name = "password", nullable = false)
	private String password;

	@Column(name = "phone_number", nullable = false, unique = true)
	private String phoneNumber;

	@Column(name = "first_name", nullable = false)
	private String firstName;

	@Column(name = "last_name", nullable = false)
	private String lastName;

	@Enumerated(EnumType.STRING)
	@Column(name = "gender")
	private Gender gender;

	@Enumerated(EnumType.STRING)
	@Column(name = "account_status")
	private AccountStatus accountStatus;

	@Enumerated(EnumType.STRING)
	@Column(name = "kyc_status")
	private KycStatus kycStatus;

	@Enumerated(EnumType.STRING)
	@Column(name = "partner_status")
	private PartnerStatus partnerStatus;

	@Column(name = "last_login_at")
	private LocalDateTime lastLoginAt;

	@CreationTimestamp
	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;

	@UpdateTimestamp
	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	@Column(name = "deleted_at")
	private LocalDateTime deletedAt;

//	@Column(name = "is_verified", nullable = false)
//	private Boolean isVerified = false;

	@OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
	private Set<UserRole> userRoles;

	/*
	 * public Integer getUserId() { return userId; }
	 */

	/*
	 * public Set<UserRole> getRoles() { return roles; }
	 * 
	 * public void setRoles(Set<UserRole> roles) { this.roles = roles; }
	 * 
	 * public void setUserId(Integer userId) { this.userId = userId; }
	 * 
	 * public String getEmail() { return email; }
	 * 
	 * public void setEmail(String email) { this.email = email; }
	 * 
	 * public String getPassword() { return password; }
	 * 
	 * public void setPassword(String password) { this.password = password; }
	 * 
	 * public String getPhoneNumber() { return phoneNumber; }
	 * 
	 * public void setPhoneNumber(String phoneNumber) { this.phoneNumber =
	 * phoneNumber; }
	 * 
	 * public AccountStatus getAccountStatus() { return accountStatus; }
	 * 
	 * public void setAccountStatus(AccountStatus accountStatus) {
	 * this.accountStatus = accountStatus; }
	 * 
	 * public LocalDateTime getLastLoginAt() { return lastLoginAt; }
	 * 
	 * public void setLastLoginAt(LocalDateTime lastLoginAt) { this.lastLoginAt =
	 * lastLoginAt; }
	 * 
	 * public LocalDateTime getCreatedAt() { return createdAt; }
	 * 
	 * public void setCreatedAt(LocalDateTime createdAt) { this.createdAt =
	 * createdAt; }
	 * 
	 * public LocalDateTime getUpdatedAt() { return updatedAt; }
	 * 
	 * public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt =
	 * updatedAt; }
	 * 
	 * public LocalDateTime getDeletedAt() { return deletedAt; }
	 * 
	 * public void setDeletedAt(LocalDateTime deletedAt) { this.deletedAt =
	 * deletedAt; }
	 * 
	 * public Boolean getIsVerified() { return isVerified; }
	 * 
	 * public void setIsVerified(Boolean isVerified) { this.isVerified = isVerified;
	 * }
	 * 
	 * public String getFirstName() { return firstName; }
	 * 
	 * public void setFirstName(String firstName) { this.firstName = firstName; }
	 * 
	 * public String getLastName() { return lastName; }
	 * 
	 * public void setLastName(String lastName) { this.lastName = lastName; }
	 * 
	 * public Gender getGender() { return gender; }
	 * 
	 * public void setGender(Gender gender) { this.gender = gender; }
	 */
}