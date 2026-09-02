# Skill-Based Student Project Team Allocation System

A simple web application that helps college coordinators create project teams based on students' skills.

The coordinator can add students, create projects, enter required skills, and generate suitable teams based on skill matching.

## Project Overview

In college projects, creating balanced teams manually can take time. This project makes the process easier by comparing student skills with the skills required for a project.

The system uses a simple rule-based matching method. It is not an AI or machine learning project.

## Features

- Add, update, view and delete students
- Search students by name, roll number, branch or skill
- Add, update, view and delete projects
- Enter required skills for each project
- Generate project teams based on skill matching
- Calculate skill matching score
- Calculate team skill coverage
- Show missing skills if any
- Show allocated and unallocated students
- Prevent duplicate team allocation
- Reset generated teams

## Technology Used

- Java 17
- Spring Boot
- Spring Data JPA
- MySQL
- HTML
- CSS
- JavaScript
- Maven

## How the Project Works

The basic flow of the application is:

```text
User
  ↓
HTML / CSS / JavaScript
  ↓
REST API
  ↓
Spring Boot Controller
  ↓
Service Layer
  ↓
JPA Repository
  ↓
MySQL Database