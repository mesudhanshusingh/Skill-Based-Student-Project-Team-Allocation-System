package com.example.teamallocation.controller;

import com.example.teamallocation.dto.CustomTeamRequest;
import com.example.teamallocation.dto.ProjectTeamsGroupDto;
import com.example.teamallocation.dto.TeamDetailResponse;
import com.example.teamallocation.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/teams")
@CrossOrigin(origins = "*")
public class TeamController {

    private final TeamService teamService;

    @Autowired
    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    // Get all project team groups
    @GetMapping("/all")
    public ResponseEntity<List<ProjectTeamsGroupDto>> getAllProjectTeams() {
        return ResponseEntity.ok(teamService.getAllProjectTeams());
    }

    // Generate teams for project
    @PostMapping("/generate/{projectId}")
    public ResponseEntity<?> generateTeams(@PathVariable Long projectId) {
        try {
            List<TeamDetailResponse> teams = teamService.generateTeams(projectId);
            return ResponseEntity.ok(teams);
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("message", ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    // Save custom selected team
    @PostMapping("/save-custom")
    public ResponseEntity<?> saveCustomTeam(@RequestBody CustomTeamRequest request) {
        try {
            TeamDetailResponse team = teamService.saveCustomTeam(request);
            return ResponseEntity.ok(team);
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("message", ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    // Get generated teams for project
    @GetMapping("/project/{projectId}")
    public ResponseEntity<?> getTeamsByProject(@PathVariable Long projectId) {
        try {
            List<TeamDetailResponse> teams = teamService.getTeamsByProject(projectId);
            return ResponseEntity.ok(teams);
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("message", ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    // Reset/Delete teams for project
    @DeleteMapping("/project/{projectId}")
    public ResponseEntity<?> deleteTeamsByProject(@PathVariable Long projectId) {
        try {
            teamService.deleteTeamsByProject(projectId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Teams reset successfully. Students marked as UNALLOCATED.");
            return ResponseEntity.ok(response);
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("message", ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }
}
