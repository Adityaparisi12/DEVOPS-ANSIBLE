package com.laxman.portfolio.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.laxman.portfolio.model.Skills;
import com.laxman.portfolio.repository.SkillsRepository;

@Service
public class SkillsServiceImpl implements SkillsService {

    @Autowired
    private SkillsRepository skillrepo;

    @Override
    public String addSkill(Skills obj) {
        if (obj != null) {
            skillrepo.save(obj);
            return "Skill added successfully";
        }
        return "Failed to add skill";
    }

    @Override
    public List<Skills> viewAllSkills() {
        return skillrepo.findAll();
    }

    @Override
    public String updateSkill(String name, Skills updatedSkill) {
        Optional<Skills> skill = skillrepo.findBySkillname(name);
        if (skill.isPresent()) {
            Skills existingSkill = skill.get();
            existingSkill.setSkillname(updatedSkill.getSkillname());
            existingSkill.setCategory(updatedSkill.getCategory());
            existingSkill.setIconUrl(updatedSkill.getIconUrl());
            existingSkill.setDescription(updatedSkill.getDescription());
            existingSkill.setLearningtype(updatedSkill.getLearningtype());
            skillrepo.save(existingSkill);
            return "Skill updated successfully";
        }
        return "Skill not found";
    }

    @Override
    public String deleteSkill(String name) {
        Optional<Skills> skill = skillrepo.findBySkillname(name);
        if (skill.isPresent()) {
            skillrepo.delete(skill.get()); // Use delete() instead of deleteById()
            return "Skill deleted successfully";
        }
        return "Skill not found";
    }

    @Override
    public List<Skills> viewByCategory(String category) {
        return skillrepo.findByCategory(category);
    }

	@Override
	public long countSkills() {
		
		return skillrepo.count();
	}
}