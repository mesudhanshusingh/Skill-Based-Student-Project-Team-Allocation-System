package com.example.teamallocation.dto;

public class TeamMemberDetailDto {

    private Long studentId;
    private String name;
    private String rollNumber;
    private String branch;
    private String skills;

    public TeamMemberDetailDto() {
    }

    public TeamMemberDetailDto(Long studentId, String name, String rollNumber, String branch, String skills) {
        this.studentId = studentId;
        this.name = name;
        this.rollNumber = rollNumber;
        this.branch = branch;
        this.skills = skills;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }
}
