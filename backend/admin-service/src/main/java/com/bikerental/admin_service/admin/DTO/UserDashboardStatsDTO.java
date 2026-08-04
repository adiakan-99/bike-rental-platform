package com.bikerental.admin_service.admin.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserDashboardStatsDTO {

	private long totalUsers;

	private long blockedUsers;

}