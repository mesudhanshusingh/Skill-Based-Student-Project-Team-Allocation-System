package com.example.teamallocation;

import com.example.teamallocation.entity.Project;
import com.example.teamallocation.service.ProjectService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(locations = "classpath:application-test.properties")
class ProjectServiceTest {

    @Autowired
    private ProjectService projectService;

    @Test
    void testAddAndGetProject() {
        Project project = new Project("Smart Agriculture System", "IoT based farming solution", "Java, IoT, Python", 3, "Student Developer");
        Project saved = projectService.addProject(project);

        assertNotNull(saved.getId());
        assertEquals("Smart Agriculture System", saved.getProjectName());

        Project fetched = projectService.getProjectById(saved.getId());
        assertEquals(3, fetched.getTeamSize());
    }

    @Test
    void testInvalidTeamSizeValidation() {
        Project project = new Project("Invalid Team Size Project", "Desc", "Java", 0, "Student");
        assertThrows(RuntimeException.class, () -> projectService.addProject(project));
    }
}
