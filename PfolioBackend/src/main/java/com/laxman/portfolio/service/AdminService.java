package com.laxman.portfolio.service;

import com.laxman.portfolio.model.Admin;

public interface AdminService {
	public Admin checkadminlogin(String username, String password);
	public boolean updatePassword(String username, String currentPassword, String newPassword); // Added
}
