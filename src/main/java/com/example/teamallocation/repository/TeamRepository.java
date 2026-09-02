package com.example.teamallocation.repository;

import com.example.teamallocation.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {

    List<Team> findByProjectId(Long projectId);

    void deleteByProjectId(Long projectId);
}
