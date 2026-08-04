package com.bikerental.admin_service.admin.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CustomerDashboardStatsDTO {

	private long totalCustomers;

	private long pendingKyc;

	private long verifiedKyc;

	private long rejectedKyc;

}