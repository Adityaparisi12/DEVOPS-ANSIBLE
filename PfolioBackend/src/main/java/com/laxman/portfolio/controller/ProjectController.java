package com.laxman.portfolio.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.laxman.portfolio.model.Projects;
import com.laxman.portfolio.service.ProjectService;

@RestController
@RequestMapping("/projects")
@CrossOrigin("*")
public class ProjectController {

    //private final ProjectServiceImpl projectServiceImpl;

    @Autowired
    private ProjectService projectService;

//    ProjectController(ProjectServiceImpl projectServiceImpl) {
//        this.projectServiceImpl = projectServiceImpl;
//    }

    @PostMapping("/add")
    public ResponseEntity<Projects> addProject(
            @RequestPart("project") Projects project,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            Projects savedProject = projectService.addProject(project, image);
            return new ResponseEntity<>(savedProject, HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    
    @GetMapping("/viewAll")
    public ResponseEntity<List<Projects>> getAllProjects() {
        List<Projects> projects = projectService.viewAllProjects();
        return new ResponseEntity<>(projects, HttpStatus.OK);
    }

    
    @PutMapping("/update/{id}")
    public ResponseEntity<Projects> updateProject(
            @PathVariable Long id,
            @RequestBody Projects project) {
        try {
            Projects updatedProject = projectService.updateProject(id, project);
            return new ResponseEntity<>(updatedProject, HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/del/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        try {
            projectService.deleteProject(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @GetMapping("/countprojects")
    public long countProjects() {
    	return projectService.countProjects();
    }
}