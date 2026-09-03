# Skill-Based Student Project Team Allocation System

This is a web-based project developed using Java and Spring Boot to manage students, their skills, project requirements, and project team allocation.

The system matches student skills with the required skills of a project and helps create suitable teams based on skill matching and team size.

## Features

- Student registration
- Add and manage student skills
- View and search students
- Add and manage projects
- Add required skills for projects
- Skill-based student matching
- Automatic team generation
- Custom team builder
- Skill coverage percentage
- Shows missing skills in a team
- View allocated project teams
- Dark / Light mode

## How It Works

1. Students register their details and skills.
2. Projects are added with required skills and team size.
3. The system compares student skills with project requirements.
4. Suitable students are suggested based on matching skills.
5. Teams can be generated according to the project requirements.
6. The system shows covered and missing skills for the team.

The team allocation uses a simple rule-based skill matching approach.

## Technologies Used

### Backend
- Java 17
- Spring Boot
- Spring Data JPA
- Hibernate
- REST APIs
- Maven

### Database
- MySQL

### Frontend
- HTML5
- CSS3
- JavaScript
- Fetch API

### Deployment
- Docker
- Render
- Aiven MySQL

## Project Structure

```text
Skill-Based-Student-Project-Team-Allocation-System
│
├── backend
│   ├── src
│   └── pom.xml
│
├── frontend
│   ├── css
│   ├── js
│   ├── index.html
│   ├── student-register.html
│   ├── students.html
│   ├── projects.html
│   ├── generate-team.html
│   └── teams.html
│
├── Dockerfile
├── .gitignore
└── README.md