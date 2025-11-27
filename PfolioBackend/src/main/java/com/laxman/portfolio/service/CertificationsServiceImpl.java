package com.laxman.portfolio.service;

import com.cloudinary.Cloudinary;
import com.laxman.portfolio.model.Certifications;
import com.laxman.portfolio.repository.CertificationsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class CertificationsServiceImpl implements CertificationsService {

    @Autowired
    private CertificationsRepository certificationsRepository;

    @Autowired
    private Cloudinary cloudinary;

    @Override
    public Certifications addCertificate(Certifications certification, MultipartFile image) throws IOException {
        if (image != null && !image.isEmpty()) {
            String imgUrl = cloudinary.uploader().upload(image.getBytes(), Map.of("resource_type", "image")).get("secure_url").toString();
            certification.setImgUrl(imgUrl);
        }
        return certificationsRepository.save(certification);
    }

    @Override
    public Certifications updateCertificate(Long id, Certifications certification) throws IOException {
        Certifications existingCert = certificationsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Certificate not found with id: " + id));
        
        if (certification.getTitle() != null) existingCert.setTitle(certification.getTitle());
        if (certification.getIssuer() != null) existingCert.setIssuer(certification.getIssuer());
        if (certification.getIssueDate() != null) existingCert.setIssueDate(certification.getIssueDate());
        if (certification.getExpDate() != null) existingCert.setExpDate(certification.getExpDate());
        if (certification.getCredentialId() != null) existingCert.setCredentialId(certification.getCredentialId());
        if (certification.getCredentialUrl() != null) existingCert.setCredentialUrl(certification.getCredentialUrl());
        if (certification.getDescription() != null) existingCert.setDescription(certification.getDescription());
        if (certification.getStatus() != null) existingCert.setStatus(certification.getStatus());

        if (certification.getImgUrl() != null || certification.getImgUrl() != existingCert.getImgUrl()) {
            existingCert.setImgUrl(certification.getImgUrl()); // Use provided URL or keep existing
        }

        return certificationsRepository.save(existingCert);
    }

    @Override
    public void deleteCertificate(Long id) {
        Certifications existingCert = certificationsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Certificate not found with id: " + id));
        certificationsRepository.delete(existingCert);
    }

    @Override
    public List<Certifications> viewAllCertificates() {
        return certificationsRepository.findAll();
    }

	@Override
	public long countCertifications() {
		
		return certificationsRepository.count();
	}
}