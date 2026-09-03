package com.example.teamallocation.dto;

import java.util.List;

public class ProjectTeamsGroupDto {

    private Long projectId;
    private String projectName;
    private String createdByName;
    private String requiredSkills;
    private Integer teamSize;
    private List<TeamDetailResponse> teams;

    public ProjectTeamsGroupDto() {
    }

    public ProjectTeamsGroupDto(Long projectId, String projectName, String createdByName, String requiredSkills, Integer teamSize, List<TeamDetailResponse> teams) {
        this.projectId = projectId;
        this.projectName = projectName;
        this.createdByName = createdByName;
        this.requiredSkills = requiredSkills;
        this.teamSize = teamSize;
        this.teams = teams;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getCreatedByName() {
        return createdByName;
    }

    public void setCreatedByName(String createdByName) {
        this.createdByName = createdByName;
    }

    public String getRequiredSkills() {
        return requiredSkills;
    }

    public void setRequiredSkills(String requiredSkills) {
        this.requiredSkills = requiredSkills;
    }

    public Integer getTeamSize() {
        return teamSize;
    }

    public void setTeamSize(Integer teamSize) {
        this.teamSize = teamSize;
    }

    public List<TeamDetailResponse> getTeams() {
        return teams;
    }

    public void setTeams(List<TeamDetailResponse> teams) {
        this.teams = teams;
    }
}
