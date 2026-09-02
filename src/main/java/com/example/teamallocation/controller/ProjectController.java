package com.example.teamallocation.controller;

import com.example.teamallocation.entity.Project;
import com.example.teamallocation.service.ProjectService;
import com.example.teamallocation.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {

    private final ProjectService projectService;
    private final TeamService teamService;

    @Autowired
    public ProjectController(ProjectService projectService, TeamService teamService) {
        this.projectService = projectService;
        this.teamService = teamService;
    }

    // Get all projects
    @GetMapping
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }

    // Get project by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getProjectById(@PathVariable Long id) {
        try {
            Project project = projectService.getProjectById(id);
            return ResponseEntity.ok(project);
        } catch (RuntimeException ex) {
            return createErrorResponse(ex.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Add project
    @PostMapping
    public ResponseEntity<?> addProject(@RequestBody Project project) {
        try {
            Project createdProject = projectService.addProject(project);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProject);
        } catch (RuntimeException ex) {
            return createErrorResponse(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Update project
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProject(@PathVariable Long id, @RequestBody Project projectDetails) {
        try {
            Project updatedProject = projectService.updateProject(id, projectDetails);
            return ResponseEntity.ok(updatedProject);
        } catch (RuntimeException ex) {
            return createErrorResponse(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete project
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        try {
            // First cleanup generated teams for this project
            teamService.deleteTeamsByProject(id);
            projectService.deleteProject(id);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Project and associated teams deleted successfully.");
            return ResponseEntity.ok(response);
        } catch (RuntimeException ex) {
            return createErrorResponse(ex.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    private ResponseEntity<Map<String, String>> createErrorResponse(String message, HttpStatus status) {
        Map<String, String> error = new HashMap<>();
        error.put("message", message);
        return new ResponseEntity<>(error, status);
    }
}
