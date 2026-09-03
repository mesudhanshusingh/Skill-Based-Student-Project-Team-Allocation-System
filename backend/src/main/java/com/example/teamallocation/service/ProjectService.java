package com.example.teamallocation.service;

import com.example.teamallocation.entity.Project;
import com.example.teamallocation.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    @Autowired
    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    // Get all projects
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    // Get project by ID
    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
    }

    // Add new project
    public Project addProject(Project project) {
        validateProject(project);

        if (project.getCreatedByName() == null || project.getCreatedByName().trim().isEmpty()) {
            project.setCreatedByName("Student Creator");
        }

        return projectRepository.save(project);
    }

    // Update existing project
    public Project updateProject(Long id, Project projectDetails) {
        Project project = getProjectById(id);

        validateProject(projectDetails);

        project.setProjectName(projectDetails.getProjectName());
        project.setDescription(projectDetails.getDescription());
        project.setRequiredSkills(projectDetails.getRequiredSkills());
        project.setTeamSize(projectDetails.getTeamSize());
        if (projectDetails.getCreatedByName() != null && !projectDetails.getCreatedByName().trim().isEmpty()) {
            project.setCreatedByName(projectDetails.getCreatedByName());
        }

        return projectRepository.save(project);
    }

    // Delete project
    public void deleteProject(Long id) {
        Project project = getProjectById(id);
        projectRepository.delete(project);
    }

    // Basic validation helper
    private void validateProject(Project project) {
        if (project.getProjectName() == null || project.getProjectName().trim().isEmpty()) {
            throw new RuntimeException("Project name is required.");
        }
        if (project.getRequiredSkills() == null || project.getRequiredSkills().trim().isEmpty()) {
            throw new RuntimeException("Required skills are required.");
        }
        if (project.getTeamSize() == null || project.getTeamSize() <= 0) {
            throw new RuntimeException("Team size must be greater than zero.");
        }
    }
}
