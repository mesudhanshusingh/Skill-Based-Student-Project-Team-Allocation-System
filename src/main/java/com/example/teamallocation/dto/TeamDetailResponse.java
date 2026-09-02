package com.example.teamallocation.dto;

import java.util.List;

public class TeamDetailResponse {

    private Long teamId;
    private String teamName;
    private Long projectId;
    private Double skillCoverage;
    private List<String> missingSkills;
    private List<TeamMemberDetailDto> members;

    public TeamDetailResponse() {
    }

    public TeamDetailResponse(Long teamId, String teamName, Long projectId, Double skillCoverage, List<String> missingSkills, List<TeamMemberDetailDto> members) {
        this.teamId = teamId;
        this.teamName = teamName;
        this.projectId = projectId;
        this.skillCoverage = skillCoverage;
        this.missingSkills = missingSkills;
        this.members = members;
    }

    public Long getTeamId() {
        return teamId;
    }

    public void setTeamId(Long teamId) {
        this.teamId = teamId;
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

    public List<String> getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(List<String> missingSkills) {
        this.missingSkills = missingSkills;
    }

    public List<TeamMemberDetailDto> getMembers() {
        return members;
    }

    public void setMembers(List<TeamMemberDetailDto> members) {
        this.members = members;
    }
}
