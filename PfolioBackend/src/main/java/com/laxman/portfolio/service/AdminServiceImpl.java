package com.laxman.portfolio.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.laxman.portfolio.model.Admin;
import com.laxman.portfolio.repository.AdminRepository;

@Service
public class AdminServiceImpl implements AdminService {
    @Autowired
    private AdminRepository adminRepository;

    public Admin checkadminlogin(String username, String password) {
        return adminRepository.findByUsernameAndPassword(username, password);
    }
    
    // Added password update method
    public boolean updatePassword(String username, String currentPassword, String newPassword) {
        try {
            // First verify current password
            Admin admin = adminRepository.findByUsernameAndPassword(username, currentPassword);
            if (admin != null) {
                // Update password
                admin.setPassword(newPassword);
                adminRepository.save(admin);
                return true;
            }
            return false; // Current password is incorrect
        } catch (Exception e) {
            return false;
        }
    }
}