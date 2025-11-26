package com.buildgenie.service;

import com.buildgenie.model.PcBuild;
import com.buildgenie.repository.PcBuildRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PCBuildService {

    private final PcBuildRepository pcBuildRepository;

    public PCBuildService(PcBuildRepository pcBuildRepository) {
        this.pcBuildRepository = pcBuildRepository;
    }

    public List<PcBuild> getAllBuilds() {
        return pcBuildRepository.findAll();
    }

    public Optional<PcBuild> getBuildById(Long id) {
        return pcBuildRepository.findById(id);
    }

    public List<PcBuild> getBuildsByCategory(String category) {
        return pcBuildRepository.findByCategory(category);
    }

    public List<PcBuild> getPreBuiltConfigurations() {
        return pcBuildRepository.findByIsPreBuilt(true);
    }

    public List<PcBuild> getUserBuilds(Long userId) {
        return pcBuildRepository.findByUserId(userId);
    }

    public PcBuild saveBuild(PcBuild pcBuild) {
        return pcBuildRepository.save(pcBuild);
    }

    public void deleteBuild(Long id) {
        pcBuildRepository.deleteById(id);
    }
}