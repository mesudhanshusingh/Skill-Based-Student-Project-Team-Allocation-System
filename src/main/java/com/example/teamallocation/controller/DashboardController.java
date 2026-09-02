package com.example.teamallocation.controller;

import com.example.teamallocation.repository.ProjectRepository;
import com.example.teamallocation.repository.StudentRepository;
import com.example.teamallocation.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final StudentRepository studentRepository;
    private final ProjectRepository projectRepository;
    private final TeamRepository teamRepository;

    @Autowired
    public DashboardController(StudentRepository studentRepository,
                               ProjectRepository projectRepository,
                               TeamRepository teamRepository) {
        this.studentRepository = studentRepository;
        this.projectRepository = projectRepository;
        this.teamRepository = teamRepository;
    }

    @GetMapping("/stats")
    public Map<String, Long> getDashboardStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalStudents", studentRepository.count());
        stats.put("totalProjects", projectRepository.count());
        stats.put("totalTeams", teamRepository.count());
        stats.put("unallocatedStudents", studentRepository.countByAllocationStatus("UNALLOCATED"));
        return stats;
    }
}
