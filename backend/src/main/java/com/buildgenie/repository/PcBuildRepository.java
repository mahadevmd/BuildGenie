package com.buildgenie.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.buildgenie.model.PcBuild;

import java.util.List;

@Repository
public interface PcBuildRepository extends JpaRepository<PcBuild, Long> {
    List<PcBuild> findByCategory(String category);
    List<PcBuild> findByUserId(Long userId);
    List<PcBuild> findByIsPreBuilt(boolean isPreBuilt);
}