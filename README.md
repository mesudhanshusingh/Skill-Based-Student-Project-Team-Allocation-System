# Skill-Based Student Project Team Allocation System

A clean **Spring Boot & REST API** web application to register student skills, post project ideas, and automatically match project teams based on skill coverage.

---

## 📁 Project Architecture & Folder Structure

```
Skill-Based Student Project Team Allocation System/
├── backend/
│   ├── pom.xml                     # Maven project configuration (MySQL only)
│   └── src/
│       ├── main/
│       │   ├── java/com/example/teamallocation/
│       │   │   ├── controller/      # REST API Controllers
│       │   │   ├── service/         # Team Allocation & Skill Matching Service
│       │   │   ├── repository/      # Spring Data JPA Repositories
│       │   │   ├── entity/          # MySQL Entities (Student, Project, Team)
│       │   │   ├── dto/             # Data Transfer Objects
│       │   │   ├── config/          # CORS Configuration
│       │   │   └── init/            # Sample Data Initializer
│       │   └── resources/
│       │       └── application.properties # MySQL Database Configuration
│       └── test/java/com/example/teamallocation/
│
├── frontend/
│   ├── index.html                  # Dashboard
│   ├── student-register.html       # Self-Registration & Skills Portal
│   ├── students.html               # Registered Students Directory
│   ├── projects.html               # Student Projects Directory
│   ├── generate-team.html          # Find Teammates & Custom Team Builder
│   ├── teams.html                  # Allocated Project Teams View
│   ├── css/
│   │   └── style.css               # Responsive Stylesheet & Dark Mode Variables
│   └── js/
│       ├── main.js                 # API Helper, Theme Toggle & Footer Renderer
│       ├── student-register.js     # Self-Registration Script
│       ├── students.js             # Student Management Script
│       ├── projects.js             # Project Directory Script
│       ├── generate-team.js        # Matchmaker & Custom Builder Script
│       └── teams.js                # Teams View Script
│
├── Dockerfile                      # Multi-Stage Docker Build
├── .gitignore
└── README.md
```

---

## 🛢️ Database Configuration (MySQL Only)

**H2 is NOT used. The application uses MySQL only.**

### MySQL Local Credentials (default):
- **URL**: `jdbc:mysql://localhost:3306/team_allocation_db?createDatabaseIfNotExist=true`
- **Username**: `root`
- **Password**: `root`

### Environment Variable Overrides:
- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`

---

## ⚡ Key Features
1. **Student Self-Registration & Skills Portal**: Register roll number, branch, semester, and skillset.
2. **Student Projects Directory**: Post project title, description, required skills, and team size.
3. **Smart Skill Matchmaker**: Auto-suggests top matching students and calculates live skill coverage percentage.
4. **Custom Team Builder**: Manually select, add, or remove team members with live missing skills indicator.
5. **Allocated Project Teams View**: Directly lists formed project teams and member skills.
6. **Dark / Light Mode Toggle**: Persistent theme preference saved in `localStorage`.

---

## 🛠️ Tech Stack
- **Backend**: Java 17, Spring Boot 3.2.5, Spring Data JPA, Hibernate
- **Database**: MySQL 8.x (MySQL ONLY, 0 H2)
- **Frontend**: HTML5, Modern CSS3, JavaScript (Fetch API)
- **Deployment**: Docker, Maven

---

## 🚀 How to Run Locally

### Prerequisites:
- Java 17
- Maven 3.x
- Local MySQL Server running on port 3306

### Execution:
```bash
cd backend
mvn clean package
mvn spring-boot:run
```
Open **[http://localhost:8080/](http://localhost:8080/)** in your browser.

---

## 🐳 How to Run with Docker

```bash
# Build Docker Image
docker build -t skill-team-allocation .

# Run Container connected to Host MySQL
docker run -p 8080:8080 \
  -e DB_URL=jdbc:mysql://host.docker.internal:3306/team_allocation_db?createDatabaseIfNotExist=true \
  -e DB_USERNAME=root \
  -e DB_PASSWORD=root \
  skill-team-allocation
```
Open **[http://localhost:8080/](http://localhost:8080/)** in your browser.