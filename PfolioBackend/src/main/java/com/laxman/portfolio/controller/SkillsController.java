package com.laxman.portfolio.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.laxman.portfolio.model.Skills;
import com.laxman.portfolio.service.SkillsService;

@RestController
@RequestMapping("/skills")
@CrossOrigin("*")
public class SkillsController {

    @Autowired
    private SkillsService service;
    
    @GetMapping("/countskills")
    public long countSkills() {
    	return service.countSkills();
    }

    @PostMapping("/add")
    public ResponseEntity<String> addSkill(@RequestBody Skills skill) {
        String response = service.addSkill(skill);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Skills>> getAllSkills() {
        List<Skills> skills = service.viewAllSkills();
        return ResponseEntity.ok(skills);
    }

    @PutMapping("/update/{name}")
    public ResponseEntity<String> updateSkill(@PathVariable String name, @RequestBody Skills skill) {
        String response = service.updateSkill(name, skill);
        if (response.equals("Skill not found")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete/{name}")
    public ResponseEntity<String> deleteSkill(@PathVariable String name) {
        String response = service.deleteSkill(name);
        if (response.equals("Skill not found")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Skills>> getSkillsByCategory(@PathVariable String category) {
        List<Skills> skills = service.viewByCategory(category);
        return ResponseEntity.ok(skills);
    }
}