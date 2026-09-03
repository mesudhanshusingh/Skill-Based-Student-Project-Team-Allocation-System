package com.example.teamallocation.service;

import com.example.teamallocation.entity.Student;
import com.example.teamallocation.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    @Autowired
    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // Get all students
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // Get student by ID
    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
    }

    // Add new student
    public Student addStudent(Student student) {
        // Validate required fields
        validateStudent(student);

        // Check duplicate roll number
        Optional<Student> existingStudent = studentRepository.findByRollNumber(student.getRollNumber());
        if (existingStudent.isPresent()) {
            throw new RuntimeException("Student with roll number " + student.getRollNumber() + " already exists.");
        }

        // Set default allocation status
        if (student.getAllocationStatus() == null || student.getAllocationStatus().trim().isEmpty()) {
            student.setAllocationStatus("UNALLOCATED");
        }

        return studentRepository.save(student);
    }

    // Update existing student
    public Student updateStudent(Long id, Student studentDetails) {
        Student student = getStudentById(id);

        validateStudent(studentDetails);

        // Check if updating to a roll number that belongs to another student
        Optional<Student> existingStudent = studentRepository.findByRollNumber(studentDetails.getRollNumber());
        if (existingStudent.isPresent() && !existingStudent.get().getId().equals(id)) {
            throw new RuntimeException("Student with roll number " + studentDetails.getRollNumber() + " already exists.");
        }

        student.setRollNumber(studentDetails.getRollNumber());
        student.setName(studentDetails.getName());
        student.setEmail(studentDetails.getEmail());
        student.setBranch(studentDetails.getBranch());
        student.setSemester(studentDetails.getSemester());
        student.setSkills(studentDetails.getSkills());

        if (studentDetails.getAllocationStatus() != null) {
            student.setAllocationStatus(studentDetails.getAllocationStatus());
        }

        return studentRepository.save(student);
    }

    // Delete student
    public void deleteStudent(Long id) {
        Student student = getStudentById(id);
        studentRepository.delete(student);
    }

    // Search students by query keyword
    public List<Student> searchStudents(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllStudents();
        }
        return studentRepository.searchStudents(query.trim());
    }

    // Basic validation helper
    private void validateStudent(Student student) {
        if (student.getName() == null || student.getName().trim().isEmpty()) {
            throw new RuntimeException("Student name is required.");
        }
        if (student.getRollNumber() == null || student.getRollNumber().trim().isEmpty()) {
            throw new RuntimeException("Roll number is required.");
        }
        if (student.getEmail() == null || student.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email is required.");
        }
        if (student.getBranch() == null || student.getBranch().trim().isEmpty()) {
            throw new RuntimeException("Branch is required.");
        }
        if (student.getSemester() == null || student.getSemester() <= 0) {
            throw new RuntimeException("Valid semester is required.");
        }
        if (student.getSkills() == null || student.getSkills().trim().isEmpty()) {
            throw new RuntimeException("Skills are required.");
        }
    }
}
