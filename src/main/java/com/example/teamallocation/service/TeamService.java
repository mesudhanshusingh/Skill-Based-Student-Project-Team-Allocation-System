package com.example.teamallocation.service;

import com.example.teamallocation.dto.CustomTeamRequest;
import com.example.teamallocation.dto.ProjectTeamsGroupDto;
import com.example.teamallocation.dto.TeamDetailResponse;
import com.example.teamallocation.dto.TeamMemberDetailDto;
import com.example.teamallocation.entity.Project;
import com.example.teamallocation.entity.Student;
import com.example.teamallocation.entity.Team;
import com.example.teamallocation.entity.TeamMember;
import com.example.teamallocation.repository.ProjectRepository;
import com.example.teamallocation.repository.StudentRepository;
import com.example.teamallocation.repository.TeamMemberRepository;
import com.example.teamallocation.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class TeamService {

    private final ProjectRepository projectRepository;
    private final StudentRepository studentRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;

    @Autowired
    public TeamService(ProjectRepository projectRepository,
                       StudentRepository studentRepository,
                       TeamRepository teamRepository,
                       TeamMemberRepository teamMemberRepository) {
        this.projectRepository = projectRepository;
        this.studentRepository = studentRepository;
        this.teamRepository = teamRepository;
        this.teamMemberRepository = teamMemberRepository;
    }

    // Generate teams for a selected project
    @Transactional
    public List<TeamDetailResponse> generateTeams(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));

        int teamSize = project.getTeamSize();
        if (teamSize <= 0) {
            throw new RuntimeException("Invalid project team size: " + teamSize);
        }

        List<Student> unallocatedStudents = studentRepository.findByAllocationStatus("UNALLOCATED");
        if (unallocatedStudents.isEmpty()) {
            throw new RuntimeException("No unallocated students available to form teams.");
        }

        if (unallocatedStudents.size() < teamSize) {
            throw new RuntimeException("Not enough unallocated students to form a team of size " + teamSize +
                    ". Available unallocated students: " + unallocatedStudents.size());
        }

        List<String> rawRequiredSkills = parseSkills(project.getRequiredSkills());
        if (rawRequiredSkills.isEmpty()) {
            throw new RuntimeException("Project has no required skills defined.");
        }

        List<StudentMatchScore> studentScores = new ArrayList<>();
        for (Student student : unallocatedStudents) {
            int matchCount = calculateMatchingSkillsCount(student.getSkills(), rawRequiredSkills);
            double score = ((double) matchCount / rawRequiredSkills.size()) * 100.0;
            studentScores.add(new StudentMatchScore(student, matchCount, score));
        }

        studentScores.sort(Comparator.comparingDouble(StudentMatchScore::getScore).reversed());

        int totalTeams = studentScores.size() / teamSize;
        if (totalTeams == 0) {
            throw new RuntimeException("Not enough unallocated students to form a complete team.");
        }

        deleteExistingTeamsForProject(projectId);

        List<TeamDetailResponse> generatedTeamsResponse = new ArrayList<>();
        List<StudentMatchScore> availablePool = new ArrayList<>(studentScores);

        int teamCounter = 1;
        while (availablePool.size() >= teamSize) {
            List<Student> teamMembers = new ArrayList<>();

            StudentMatchScore seed = availablePool.remove(0);
            teamMembers.add(seed.getStudent());

            while (teamMembers.size() < teamSize && !availablePool.isEmpty()) {
                int bestIndex = 0;
                int maxNewSkillsAdded = -1;

                Set<String> currentTeamSkills = getCombinedSkillsLower(teamMembers);

                for (int i = 0; i < availablePool.size(); i++) {
                    Student candidate = availablePool.get(i).getStudent();
                    List<String> candidateSkills = parseSkills(candidate.getSkills());

                    int newSkillsCount = 0;
                    for (String reqSkill : rawRequiredSkills) {
                        String reqLower = reqSkill.toLowerCase();
                        if (!currentTeamSkills.contains(reqLower) && containsIgnoreCase(candidateSkills, reqLower)) {
                            newSkillsCount++;
                        }
                    }

                    if (newSkillsCount > maxNewSkillsAdded) {
                        maxNewSkillsAdded = newSkillsCount;
                        bestIndex = i;
                    }
                }

                StudentMatchScore selected = availablePool.remove(bestIndex);
                teamMembers.add(selected.getStudent());
            }

            Set<String> coveredSkillsLower = new HashSet<>();
            for (Student member : teamMembers) {
                List<String> memberSkills = parseSkills(member.getSkills());
                for (String reqSkill : rawRequiredSkills) {
                    if (containsIgnoreCase(memberSkills, reqSkill.toLowerCase())) {
                        coveredSkillsLower.add(reqSkill.toLowerCase());
                    }
                }
            }

            double coverage = ((double) coveredSkillsLower.size() / rawRequiredSkills.size()) * 100.0;
            coverage = Math.round(coverage * 10.0) / 10.0;

            List<String> missingSkills = new ArrayList<>();
            for (String reqSkill : rawRequiredSkills) {
                if (!coveredSkillsLower.contains(reqSkill.toLowerCase())) {
                    missingSkills.add(reqSkill);
                }
            }

            Team team = new Team();
            team.setTeamName("Team " + teamCounter);
            team.setProjectId(projectId);
            team.setSkillCoverage(coverage);
            Team savedTeam = teamRepository.save(team);

            List<TeamMemberDetailDto> memberDtos = new ArrayList<>();
            for (Student member : teamMembers) {
                TeamMember teamMember = new TeamMember();
                teamMember.setTeamId(savedTeam.getId());
                teamMember.setStudentId(member.getId());
                teamMemberRepository.save(teamMember);

                member.setAllocationStatus("ALLOCATED");
                studentRepository.save(member);

                memberDtos.add(new TeamMemberDetailDto(
                        member.getId(),
                        member.getName(),
                        member.getRollNumber(),
                        member.getBranch(),
                        member.getSkills()
                ));
            }

            generatedTeamsResponse.add(new TeamDetailResponse(
                    savedTeam.getId(),
                    savedTeam.getTeamName(),
                    projectId,
                    coverage,
                    missingSkills,
                    memberDtos
            ));

            teamCounter++;
        }

        return generatedTeamsResponse;
    }

    // Save custom selected team
    @Transactional
    public TeamDetailResponse saveCustomTeam(CustomTeamRequest request) {
        if (request.getProjectId() == null) {
            throw new RuntimeException("Project ID is required.");
        }
        if (request.getStudentIds() == null || request.getStudentIds().isEmpty()) {
            throw new RuntimeException("At least one student must be selected for the team.");
        }

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + request.getProjectId()));

        List<String> rawRequiredSkills = parseSkills(project.getRequiredSkills());

        // Cleanup previous teams for this project
        deleteExistingTeamsForProject(request.getProjectId());

        List<Student> selectedStudents = new ArrayList<>();
        Set<String> coveredSkillsLower = new HashSet<>();

        for (Long studentId : request.getStudentIds()) {
            Student s = studentRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));
            selectedStudents.add(s);

            List<String> studentSkills = parseSkills(s.getSkills());
            for (String reqSkill : rawRequiredSkills) {
                if (containsIgnoreCase(studentSkills, reqSkill.toLowerCase())) {
                    coveredSkillsLower.add(reqSkill.toLowerCase());
                }
            }
        }

        double coverage = rawRequiredSkills.isEmpty() ? 100.0 : ((double) coveredSkillsLower.size() / rawRequiredSkills.size()) * 100.0;
        coverage = Math.round(coverage * 10.0) / 10.0;

        List<String> missingSkills = new ArrayList<>();
        for (String reqSkill : rawRequiredSkills) {
            if (!coveredSkillsLower.contains(reqSkill.toLowerCase())) {
                missingSkills.add(reqSkill);
            }
        }

        String teamName = (request.getTeamName() != null && !request.getTeamName().trim().isEmpty())
                ? request.getTeamName().trim() : "Team 1";

        Team team = new Team();
        team.setTeamName(teamName);
        team.setProjectId(request.getProjectId());
        team.setSkillCoverage(coverage);
        Team savedTeam = teamRepository.save(team);

        List<TeamMemberDetailDto> memberDtos = new ArrayList<>();
        for (Student s : selectedStudents) {
            TeamMember tm = new TeamMember();
            tm.setTeamId(savedTeam.getId());
            tm.setStudentId(s.getId());
            teamMemberRepository.save(tm);

            s.setAllocationStatus("ALLOCATED");
            studentRepository.save(s);

            memberDtos.add(new TeamMemberDetailDto(
                    s.getId(),
                    s.getName(),
                    s.getRollNumber(),
                    s.getBranch(),
                    s.getSkills()
            ));
        }

        return new TeamDetailResponse(
                savedTeam.getId(),
                savedTeam.getTeamName(),
                request.getProjectId(),
                coverage,
                missingSkills,
                memberDtos
        );
    }

    // Get all teams grouped by project
    public List<ProjectTeamsGroupDto> getAllProjectTeams() {
        List<Project> projects = projectRepository.findAll();
        List<ProjectTeamsGroupDto> groups = new ArrayList<>();

        for (Project project : projects) {
            List<TeamDetailResponse> projectTeams = getTeamsByProject(project.getId());
            groups.add(new ProjectTeamsGroupDto(
                    project.getId(),
                    project.getProjectName(),
                    project.getCreatedByName(),
                    project.getRequiredSkills(),
                    project.getTeamSize(),
                    projectTeams
            ));
        }

        return groups;
    }

    // Get generated teams for project
    public List<TeamDetailResponse> getTeamsByProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));

        List<String> rawRequiredSkills = parseSkills(project.getRequiredSkills());
        List<Team> teams = teamRepository.findByProjectId(projectId);

        List<TeamDetailResponse> responseList = new ArrayList<>();

        for (Team team : teams) {
            List<TeamMember> members = teamMemberRepository.findByTeamId(team.getId());
            List<TeamMemberDetailDto> memberDtos = new ArrayList<>();
            Set<String> coveredSkillsLower = new HashSet<>();

            for (TeamMember tm : members) {
                Student student = studentRepository.findById(tm.getStudentId()).orElse(null);
                if (student != null) {
                    memberDtos.add(new TeamMemberDetailDto(
                            student.getId(),
                            student.getName(),
                            student.getRollNumber(),
                            student.getBranch(),
                            student.getSkills()
                    ));

                    List<String> studentSkills = parseSkills(student.getSkills());
                    for (String reqSkill : rawRequiredSkills) {
                        if (containsIgnoreCase(studentSkills, reqSkill.toLowerCase())) {
                            coveredSkillsLower.add(reqSkill.toLowerCase());
                        }
                    }
                }
            }

            List<String> missingSkills = new ArrayList<>();
            for (String reqSkill : rawRequiredSkills) {
                if (!coveredSkillsLower.contains(reqSkill.toLowerCase())) {
                    missingSkills.add(reqSkill);
                }
            }

            responseList.add(new TeamDetailResponse(
                    team.getId(),
                    team.getTeamName(),
                    projectId,
                    team.getSkillCoverage(),
                    missingSkills,
                    memberDtos
            ));
        }

        return responseList;
    }

    // Reset / Delete teams for project
    @Transactional
    public void deleteTeamsByProject(Long projectId) {
        deleteExistingTeamsForProject(projectId);
    }

    private void deleteExistingTeamsForProject(Long projectId) {
        List<Team> existingTeams = teamRepository.findByProjectId(projectId);
        for (Team team : existingTeams) {
            List<TeamMember> teamMembers = teamMemberRepository.findByTeamId(team.getId());
            for (TeamMember tm : teamMembers) {
                Student student = studentRepository.findById(tm.getStudentId()).orElse(null);
                if (student != null) {
                    student.setAllocationStatus("UNALLOCATED");
                    studentRepository.save(student);
                }
            }
            teamMemberRepository.deleteByTeamId(team.getId());
        }
        teamRepository.deleteByProjectId(projectId);
    }

    private List<String> parseSkills(String skillsStr) {
        if (skillsStr == null || skillsStr.trim().isEmpty()) {
            return Collections.emptyList();
        }
        String[] parts = skillsStr.split(",");
        List<String> result = new ArrayList<>();
        for (String part : parts) {
            String trimmed = part.trim();
            if (!trimmed.isEmpty()) {
                result.add(trimmed);
            }
        }
        return result;
    }

    private int calculateMatchingSkillsCount(String studentSkillsStr, List<String> requiredSkills) {
        List<String> studentSkills = parseSkills(studentSkillsStr);
        int count = 0;
        for (String reqSkill : requiredSkills) {
            if (containsIgnoreCase(studentSkills, reqSkill.toLowerCase())) {
                count++;
            }
        }
        return count;
    }

    private boolean containsIgnoreCase(List<String> list, String targetLower) {
        for (String item : list) {
            if (item.equalsIgnoreCase(targetLower)) {
                return true;
            }
        }
        return false;
    }

    private Set<String> getCombinedSkillsLower(List<Student> students) {
        Set<String> set = new HashSet<>();
        for (Student s : students) {
            List<String> skills = parseSkills(s.getSkills());
            for (String sk : skills) {
                set.add(sk.toLowerCase());
            }
        }
        return set;
    }

    private static class StudentMatchScore {
        private final Student student;
        private final int matchCount;
        private final double score;

        public StudentMatchScore(Student student, int matchCount, double score) {
            this.student = student;
            this.matchCount = matchCount;
            this.score = score;
        }

        public Student getStudent() {
            return student;
        }

        public double getScore() {
            return score;
        }
    }
}
