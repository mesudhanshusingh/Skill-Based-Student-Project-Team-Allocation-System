package com.example.teamallocation.controller;

import com.example.teamallocation.entity.Student;
import com.example.teamallocation.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentService studentService;

    @Autowired
    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // Get all students
    @GetMapping
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    // Get student by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getStudentById(@PathVariable Long id) {
        try {
            Student student = studentService.getStudentById(id);
            return ResponseEntity.ok(student);
        } catch (RuntimeException ex) {
            return createErrorResponse(ex.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Search students by query
    @GetMapping("/search")
    public List<Student> searchStudents(@RequestParam(value = "query", required = false) String query) {
        return studentService.searchStudents(query);
    }

    // Add student
    @PostMapping
    public ResponseEntity<?> addStudent(@RequestBody Student student) {
        try {
            Student createdStudent = studentService.addStudent(student);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdStudent);
        } catch (RuntimeException ex) {
            return createErrorResponse(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Update student
    @PutMapping("/{id}")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @RequestBody Student studentDetails) {
        try {
            Student updatedStudent = studentService.updateStudent(id, studentDetails);
            return ResponseEntity.ok(updatedStudent);
        } catch (RuntimeException ex) {
            return createErrorResponse(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete student
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        try {
            studentService.deleteStudent(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Student deleted successfully.");
            return ResponseEntity.ok(response);
        } catch (RuntimeException ex) {
            return createErrorResponse(ex.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    private ResponseEntity<Map<String, String>> createErrorResponse(String message, HttpStatus status) {
        Map<String, String> error = new HashMap<>();
        error.put("message", message);
        return new ResponseEntity<>(error, status);
    }
}
