package com.example.teamallocation.dto;

import java.util.List;

public class CustomTeamRequest {

    private Long projectId;
    private String teamName;
    private List<Long> studentIds;

    public CustomTeamRequest() {
    }

    public CustomTeamRequest(Long projectId, String teamName, List<Long> studentIds) {
        this.projectId = projectId;
        this.teamName = teamName;
        this.studentIds = studentIds;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public List<Long> getStudentIds() {
        return studentIds;
    }

    public void setStudentIds(List<Long> studentIds) {
        this.studentIds = studentIds;
    }
}
