package com.example.teamallocation;

import com.example.teamallocation.dto.TeamDetailResponse;
import com.example.teamallocation.entity.Project;
import com.example.teamallocation.entity.Student;
import com.example.teamallocation.repository.StudentRepository;
import com.example.teamallocation.service.ProjectService;
import com.example.teamallocation.service.StudentService;
import com.example.teamallocation.service.TeamService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.TestPropertySource;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(locations = "classpath:application-test.properties")
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
class TeamAllocationServiceTest {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private StudentService studentService;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private TeamService teamService;

    @BeforeEach
    void setUp() {
        studentRepository.deleteAll();
    }

    @Test
    void testTeamGenerationAndSkillCoverage() {
        // Create student project requiring 4 skills
        Project proj = projectService.addProject(new Project("FinTech App", "Banking app", "Java, SQL, Spring Boot, Testing", 2, "Rahul"));

        // Create 2 unallocated students with complementary skills
        studentService.addStudent(new Student("ST101", "Student One", "s1@test.com", "CS", 6, "Java, SQL", "UNALLOCATED"));
        studentService.addStudent(new Student("ST102", "Student Two", "s2@test.com", "CS", 6, "Spring Boot, Testing", "UNALLOCATED"));

        List<TeamDetailResponse> teams = teamService.generateTeams(proj.getId());

        assertFalse(teams.isEmpty());
        assertEquals(1, teams.size());

        TeamDetailResponse team = teams.get(0);
        assertEquals(2, team.getMembers().size());
        assertEquals(100.0, team.getSkillCoverage());
        assertTrue(team.getMissingSkills().isEmpty());

        // Verify students are now ALLOCATED
        Student s1 = studentService.getStudentById(team.getMembers().get(0).getStudentId());
        assertEquals("ALLOCATED", s1.getAllocationStatus());
    }
}
