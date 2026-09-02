package com.example.teamallocation.init;

import com.example.teamallocation.entity.Project;
import com.example.teamallocation.entity.Student;
import com.example.teamallocation.entity.Team;
import com.example.teamallocation.entity.TeamMember;
import com.example.teamallocation.repository.ProjectRepository;
import com.example.teamallocation.repository.StudentRepository;
import com.example.teamallocation.repository.TeamMemberRepository;
import com.example.teamallocation.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final StudentRepository studentRepository;
    private final ProjectRepository projectRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;

    @Autowired
    public DataInitializer(StudentRepository studentRepository,
                           ProjectRepository projectRepository,
                           TeamRepository teamRepository,
                           TeamMemberRepository teamMemberRepository) {
        this.studentRepository = studentRepository;
        this.projectRepository = projectRepository;
        this.teamRepository = teamRepository;
        this.teamMemberRepository = teamMemberRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Seed Students only if table is completely empty
        if (studentRepository.count() == 0) {
            List<Student> sampleStudents = Arrays.asList(
                    new Student("CS202401", "Sudhanshu Singh", "rathoresudhanshu@gmail.com", "Computer Science", 6, "Java, Spring Boot", "UNALLOCATED"),
                    new Student("CS202402", "Aman Verma", "aman.verma@example.com", "Computer Science", 6, "HTML, CSS, JavaScript", "UNALLOCATED"),
                    new Student("CS202403", "Neha Gupta", "neha.gupta@example.com", "Information Technology", 6, "Testing, Documentation, Java", "UNALLOCATED"),
                    new Student("CS202404", "Rohit Kumar", "rohit.kumar@example.com", "Computer Science", 6, "Java, MySQL, Python", "UNALLOCATED"),
                    new Student("CS202405", "Priya Singh", "priya.singh@example.com", "Software Engineering", 6, "HTML, CSS, Java, SQL", "UNALLOCATED"),
                    new Student("CS202406", "Vikas Patel", "vikas.patel@example.com", "Computer Science", 6, "Spring Boot, MySQL, Testing", "UNALLOCATED"),
                    new Student("CS202407", "Ananya Roy", "ananya.roy@example.com", "Information Technology", 6, "JavaScript, HTML, CSS, Communication", "UNALLOCATED"),
                    new Student("CS202408", "Siddharth Joshi", "siddharth.j@example.com", "Computer Science", 6, "Java, SQL, Spring Boot, Testing", "UNALLOCATED"),
                    new Student("CS202409", "Kavya Nair", "kavya.nair@example.com", "Information Technology", 6, "Python, SQL, Documentation", "UNALLOCATED"),
                    new Student("CS202410", "Aditya Saxena", "aditya.s@example.com", "Software Engineering", 6, "Java, HTML, JavaScript", "UNALLOCATED"),
                    new Student("CS202411", "Riya Jain", "riya.jain@example.com", "Computer Science", 6, "SQL, MySQL, Testing, Communication", "UNALLOCATED"),
                    new Student("CS202412", "Deepak Mehta", "deepak.m@example.com", "Information Technology", 6, "Java, Spring Boot, SQL", "UNALLOCATED"),
                    new Student("CS202413", "Sanjana Mishra", "sanjana.m@example.com", "Software Engineering", 6, "HTML, CSS, JavaScript, Testing", "UNALLOCATED"),
                    new Student("CS202414", "Manish Pandey", "manish.p@example.com", "Computer Science", 6, "Java, SQL, MySQL, Documentation", "UNALLOCATED"),
                    new Student("CS202415", "Pooja Reddy", "pooja.r@example.com", "Information Technology", 6, "Spring Boot, Testing, Communication", "UNALLOCATED"),
                    new Student("CS202416", "Tarun Choudhary", "tarun.c@example.com", "Computer Science", 6, "React, Node.js, JavaScript, HTML", "UNALLOCATED"),
                    new Student("CS202417", "Shweta Tiwari", "shweta.t@example.com", "Software Engineering", 6, "UI Design, CSS, HTML, Documentation", "UNALLOCATED"),
                    new Student("CS202418", "Gaurav Malhotra", "gaurav.m@example.com", "Information Technology", 6, "Java, Python, SQL, Testing", "UNALLOCATED"),
                    new Student("CS202419", "Divya Deshmukh", "divya.d@example.com", "Computer Science", 6, "Spring Boot, REST API, SQL", "UNALLOCATED"),
                    new Student("CS202420", "Harsh Vardhan", "harsh.v@example.com", "Software Engineering", 6, "Python, MySQL, Documentation", "UNALLOCATED"),
                    new Student("CS202421", "Megha Kapoor", "megha.k@example.com", "Information Technology", 6, "HTML, CSS, JavaScript, Communication", "UNALLOCATED"),
                    new Student("CS202422", "Abhishek Dubey", "abhishek.d@example.com", "Computer Science", 6, "Java, Spring Boot, MySQL", "UNALLOCATED"),
                    new Student("CS202423", "Nidhi Agarwal", "nidhi.a@example.com", "Software Engineering", 6, "Testing, SQL, Communication", "UNALLOCATED"),
                    new Student("CS202424", "Kartik Sharma", "kartik.s@example.com", "Computer Science", 6, "Java, SQL, Spring Boot, React", "UNALLOCATED"),
                    new Student("CS202425", "Ishita Bansal", "ishita.b@example.com", "Information Technology", 6, "HTML, CSS, UI Design, Documentation", "UNALLOCATED")
            );

            studentRepository.saveAll(sampleStudents);
            System.out.println("--> Sample students (25 records) initialized successfully.");
        }

        // Seed Projects only if table is completely empty
        if (projectRepository.count() == 0) {
            List<Project> sampleProjects = Arrays.asList(
                    new Project("Online Banking System", "Secure banking portal with transaction management and database audit", "Java, SQL, Spring Boot, Testing", 4, "Sudhanshu Singh"),
                    new Project("College Event Portal", "Web application for managing college events, registrations, and schedules", "HTML, CSS, JavaScript, Java", 4, "Aman Verma"),
                    new Project("E-Commerce Inventory Manager", "System to track inventory stocks, orders, and generate summary reports", "Java, MySQL, HTML, Documentation", 3, "Neha Gupta"),
                    new Project("Smart Attendance Tracker", "Facial & QR based student attendance logging portal", "Python, SQL, HTML, Testing", 4, "Rohit Kumar"),
                    new Project("Hospital Patient Records App", "Digital health records and appointment booking platform", "Java, Spring Boot, MySQL, REST API", 3, "Divya Deshmukh"),
                    new Project("Student Campus Marketplace", "Peer-to-peer buying and selling platform for college books and items", "React, Node.js, JavaScript, CSS", 4, "Tarun Choudhary"),
                    new Project("AI Resume Analyzer", "Automated student resume scanning and skill gap analyzer", "Python, Documentation, Communication", 3, "Kavya Nair")
            );

            projectRepository.saveAll(sampleProjects);
            System.out.println("--> Sample projects (7 records) initialized successfully.");
        }

        // Seed 1 Default Allocated Team on Startup if team table is empty
        if (teamRepository.count() == 0) {
            List<Project> projects = projectRepository.findAll();
            List<Student> students = studentRepository.findAll();

            if (!projects.isEmpty() && students.size() >= 4) {
                Project firstProject = projects.get(0); // Online Banking System

                Team initialTeam = new Team();
                initialTeam.setTeamName("Team 1");
                initialTeam.setProjectId(firstProject.getId());
                initialTeam.setSkillCoverage(100.0);
                Team savedTeam = teamRepository.save(initialTeam);

                // Assign first 4 students to Team 1: Sudhanshu Singh, Aman Verma, Neha Gupta, Rohit Kumar
                for (int i = 0; i < 4; i++) {
                    Student s = students.get(i);
                    TeamMember tm = new TeamMember();
                    tm.setTeamId(savedTeam.getId());
                    tm.setStudentId(s.getId());
                    teamMemberRepository.save(tm);

                    s.setAllocationStatus("ALLOCATED");
                    studentRepository.save(s);
                }
                System.out.println("--> Initial default team for Sudhanshu Singh (" + firstProject.getProjectName() + ") seeded successfully.");
            }
        }
    }
}
