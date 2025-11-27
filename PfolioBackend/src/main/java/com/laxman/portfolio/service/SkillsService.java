package com.laxman.portfolio.service;

import java.util.List;

import com.laxman.portfolio.model.Skills;

public interface SkillsService {

	public String addSkill(Skills obj);
	public List<Skills> viewAllSkills();
	public String updateSkill(String name,Skills updatedSkill);
	public String deleteSkill(String name);
	public List<Skills> viewByCategory(String category);
	public long countSkills();
}
