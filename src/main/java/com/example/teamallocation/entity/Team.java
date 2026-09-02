package com.example.teamallocation.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "teams")
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String teamName;
    private Long projectId;
    private Double skillCoverage;

    public Team() {
    }

    public Team(String teamName, Long projectId, Double skillCoverage) {
        this.teamName = teamName;
        this.projectId = projectId;
        this.skillCoverage = skillCoverage;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public Double getSkillCoverage() {
        return skillCoverage;
    }

    public void setSkillCoverage(Double skillCoverage) {
        this.skillCoverage = skillCoverage;
    }
}
