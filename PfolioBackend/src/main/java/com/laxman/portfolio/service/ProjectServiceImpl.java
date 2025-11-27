package com.laxman.portfolio.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.cloudinary.Cloudinary;
import com.laxman.portfolio.model.Projects;
import com.laxman.portfolio.repository.ProjectsRepository;

@Service
public class ProjectServiceImpl implements ProjectService {

    @Autowired
    private Cloudinary cloudinary;

    @Autowired
    private ProjectsRepository projectRepository;

    @Override
    public Projects addProject(Projects pro, MultipartFile image) throws IOException {
        // Upload image to Cloudinary if provided
        if (image != null && !image.isEmpty()) {
            String imgUrl = cloudinary.uploader().upload(image.getBytes(), 
                Map.of("resource_type", "image")).get("secure_url").toString();
            pro.setImgurl(imgUrl);
        }
        
        // Save project to MongoDB
        return projectRepository.save(pro);
    }

    @Override
    public List<Projects> viewAllProjects() {
        return projectRepository.findAll();
    }

    @Override
    public Projects updateProject(Long id, Projects project) throws IOException {
        // Check if project exists
        Projects existingProject = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));

        // Update fields only if provided (non-null)
        if (project.getTitle() != null) existingProject.setTitle(project.getTitle());
        if (project.getDescription() != null) existingProject.setDescription(project.getDescription());
        if (project.getFdescription() != null) existingProject.setFdescription(project.getFdescription());
        if (project.getCategory() != null) existingProject.setCategory(project.getCategory());
        if (project.getSdate() != null) existingProject.setSdate(project.getSdate());
        if (project.getEdate() != null) existingProject.setEdate(project.getEdate());
        if (project.getTechnologies() != null) existingProject.setTechnologies(project.getTechnologies());
        if (project.getGitlink() != null) existingProject.setGitlink(project.getGitlink());
        if (project.getLiveurl() != null) existingProject.setLiveurl(project.getLiveurl());
        
        // Update image URL only if provided or different
        if (project.getImgurl() != null || project.getImgurl() != existingProject.getImgurl()) {
            existingProject.setImgurl(project.getImgurl());
        }

        // Save updated project
        return projectRepository.save(existingProject);
    }

    @Override
    public void deleteProject(Long id) {
        // Check if project exists
        Projects existingProject = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
        projectRepository.delete(existingProject);
    }

	@Override
	public long countProjects() {
		
		return projectRepository.count();
	}
}