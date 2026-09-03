package com.example.teamallocation;

import com.example.teamallocation.entity.Student;
import com.example.teamallocation.service.StudentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class StudentServiceTest {

    @Autowired
    private StudentService studentService;

    @Test
    void testAddAndGetStudent() {
        Student student = new Student("TEST001", "Test Student", "test@example.com", "CS", 6, "Java, SQL", "UNALLOCATED");
        Student saved = studentService.addStudent(student);

        assertNotNull(saved.getId());
        assertEquals("TEST001", saved.getRollNumber());

        Student retrieved = studentService.getStudentById(saved.getId());
        assertEquals("Test Student", retrieved.getName());
    }

    @Test
    void testDuplicateRollNumberFails() {
        Student student1 = new Student("TEST002", "Student One", "s1@example.com", "CS", 6, "Java", "UNALLOCATED");
        studentService.addStudent(student1);

        Student student2 = new Student("TEST002", "Student Two", "s2@example.com", "IT", 6, "SQL", "UNALLOCATED");
        assertThrows(RuntimeException.class, () -> studentService.addStudent(student2));
    }

    @Test
    void testSearchStudents() {
        Student student = new Student("TEST003", "Karan Johar", "karan@example.com", "Biotech", 4, "Python, ML", "UNALLOCATED");
        studentService.addStudent(student);

        List<Student> results = studentService.searchStudents("Karan");
        assertFalse(results.isEmpty());
        assertEquals("Karan Johar", results.get(0).getName());
    }
}
