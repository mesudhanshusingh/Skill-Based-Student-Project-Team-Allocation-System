package com.example.teamallocation.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String rollNumber;
    private String name;
    private String email;
    private String branch;
    private Integer semester;
    private String skills;
    private String allocationStatus; // UNALLOCATED or ALLOCATED

    public Student() {
    }

    public Student(String rollNumber, String name, String email, String branch, Integer semester, String skills, String allocationStatus) {
        this.rollNumber = rollNumber;
        this.name = name;
        this.email = email;
        this.branch = branch;
        this.semester = semester;
        this.skills = skills;
        this.allocationStatus = allocationStatus;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public Integer getSemester() {
        return semester;
    }

    public void setSemester(Integer semester) {
        this.semester = semester;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getAllocationStatus() {
        return allocationStatus;
    }

    public void setAllocationStatus(String allocationStatus) {
        this.allocationStatus = allocationStatus;
    }
}
