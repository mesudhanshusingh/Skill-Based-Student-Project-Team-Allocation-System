package com.example.teamallocation.repository;

import com.example.teamallocation.entity.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {

    List<TeamMember> findByTeamId(Long teamId);

    void deleteByTeamId(Long teamId);

    void deleteByTeamIdIn(List<Long> teamIds);
}
