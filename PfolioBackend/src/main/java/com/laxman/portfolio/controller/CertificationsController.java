package com.laxman.portfolio.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.laxman.portfolio.model.Certifications;
import com.laxman.portfolio.service.CertificationsService;

@RestController
@RequestMapping("/certifications")
@CrossOrigin("*")
public class CertificationsController {

//    private final CertificationsServiceImpl certificationsServiceImpl;

    @Autowired
    private CertificationsService certificationsService;

//    CertificationsController(CertificationsServiceImpl certificationsServiceImpl) {
//        this.certificationsServiceImpl = certificationsServiceImpl;
//    }

    @PostMapping("/add")
    public ResponseEntity<Certifications> addCertificate(@RequestPart Certifications certification,
                                                        @RequestPart(required = false) MultipartFile image) throws IOException {
        Certifications savedCert = certificationsService.addCertificate(certification, image);
        return ResponseEntity.ok(savedCert);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Certifications> updateCertificate(@PathVariable Long id,
                                                           @RequestPart Certifications certification,
                                                           @RequestPart(required = false) MultipartFile image) throws IOException {
        certification.setId(id); // Ensure ID is set for update
        if (image != null && !image.isEmpty()) {
            String imgUrl = certificationsService.addCertificate(new Certifications(), image).getImgUrl();
            certification.setImgUrl(imgUrl);
        }
        Certifications updatedCert = certificationsService.updateCertificate(id, certification);
        return ResponseEntity.ok(updatedCert);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteCertificate(@PathVariable Long id) {
        certificationsService.deleteCertificate(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/viewAll")
    public ResponseEntity<List<Certifications>> viewAllCertificates() {
        List<Certifications> certificates = certificationsService.viewAllCertificates();
        return ResponseEntity.ok(certificates);
    }
    
    @GetMapping("/countcertifications")
    public long countCertificates(){
    	return certificationsService.countCertifications();
    }
}