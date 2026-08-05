package com.bikerental.admin_service.service;

public interface AdminService {

	void promoteAdmin(Integer userId);

	void demoteAdmin(Integer userId);

}
