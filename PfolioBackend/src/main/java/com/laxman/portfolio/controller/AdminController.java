package com.laxman.portfolio.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;
import com.laxman.portfolio.model.Admin;
import com.laxman.portfolio.service.AdminService;

@RestController
@RequestMapping("/admin")
@CrossOrigin("*")
public class AdminController {
    @Autowired
    private AdminService service;

    @PostMapping("/checkadminlogin")
    public ResponseEntity<?> checkadminlogin(@RequestBody Admin admin) {
        try {
            Admin a = service.checkadminlogin(admin.getUsername(), admin.getPassword());
            if (a != null) {
                return ResponseEntity.ok(a);
            } else {
                return ResponseEntity.status(401).body("Invalid Username or Password");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Login failed: " + e.getMessage());
        }
    }
    
    // Added password update endpoint
    @PostMapping("/updatepassword")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, String> passwordRequest) {
        try {
            String username = passwordRequest.get("username");
            String currentPassword = passwordRequest.get("currentPassword");
            String newPassword = passwordRequest.get("newPassword");
            
            // Basic validation
            if (username == null || username.trim().isEmpty()) {
                return ResponseEntity.status(400).body("Username is required");
            }
            if (currentPassword == null || currentPassword.trim().isEmpty()) {
                return ResponseEntity.status(400).body("Current password is required");
            }
            if (newPassword == null || newPassword.trim().isEmpty()) {
                return ResponseEntity.status(400).body("New password is required");
            }
            
            // Password strength validation (based on UI requirements)
            if (!isValidPassword(newPassword)) {
                return ResponseEntity.status(400).body("Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character");
            }
            
            boolean isUpdated = service.updatePassword(username, currentPassword, newPassword);
            
            if (isUpdated) {
                return ResponseEntity.ok("Password updated successfully");
            } else {
                return ResponseEntity.status(401).body("Current password is incorrect");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Password update failed: " + e.getMessage());
        }
    }
    
    // Helper method for password validation
    private boolean isValidPassword(String password) {
        if (password.length() < 8) {
            return false;
        }
        
        boolean hasUpper = false, hasLower = false, hasDigit = false, hasSpecial = false;
        
        for (char c : password.toCharArray()) {
            if (Character.isUpperCase(c)) hasUpper = true;
            else if (Character.isLowerCase(c)) hasLower = true;
            else if (Character.isDigit(c)) hasDigit = true;
            else if (!Character.isLetterOrDigit(c)) hasSpecial = true;
        }
        
        return hasUpper && hasLower && hasDigit && hasSpecial;
    }
}