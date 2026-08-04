package com.bikerental.admin_service.admin.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminDashboardResponseDTO {

	private Long totalUsers;

	private Long totalCustomers;

	private Long pendingKyc;

	private Long verifiedKyc;

	private Long rejectedKyc;

	private Long blockedUsers;

}