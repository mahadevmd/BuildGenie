package com.buildgenie.controller;

import com.buildgenie.model.PcBuild;
import com.buildgenie.service.PCBuildService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/builds")
public class PcBuildController {

    private final PCBuildService pcBuildService;

    public PcBuildController(PCBuildService pcBuildService) {
        this.pcBuildService = pcBuildService;
    }

    @GetMapping
    public ResponseEntity<List<PcBuild>> getAllBuilds() {
        return ResponseEntity.ok(pcBuildService.getAllBuilds());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PcBuild> getBuildById(@PathVariable Long id) {
        return pcBuildService.getBuildById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<PcBuild>> getBuildsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(pcBuildService.getBuildsByCategory(category));
    }

    @GetMapping("/prebuilt")
    public ResponseEntity<List<PcBuild>> getPreBuiltConfigurations() {
        return ResponseEntity.ok(pcBuildService.getPreBuiltConfigurations());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PcBuild>> getUserBuilds(@PathVariable Long userId) {
        return ResponseEntity.ok(pcBuildService.getUserBuilds(userId));
    }

    @PostMapping
    public ResponseEntity<PcBuild> createBuild(@RequestBody PcBuild pcBuild) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pcBuildService.saveBuild(pcBuild));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PcBuild> updateBuild(@PathVariable Long id, @RequestBody PcBuild pcBuild) {
        return pcBuildService.getBuildById(id)
                .map(existingBuild -> {
                    // Create a new PcBuild with the existing ID
                    PcBuild updatedBuild = new PcBuild();
                    updatedBuild.setName(pcBuild.getName());
                    updatedBuild.setCategory(pcBuild.getCategory());
                    updatedBuild.setDescription(pcBuild.getDescription());
                    updatedBuild.setTotalPrice(pcBuild.getTotalPrice());
                    updatedBuild.setTotalWattage(pcBuild.getTotalWattage());
                    updatedBuild.setImageUrl(pcBuild.getImageUrl());
                    updatedBuild.setComponentIds(pcBuild.getComponentIds());
                    updatedBuild.setUser(pcBuild.getUser());
                    updatedBuild.setPreBuilt(pcBuild.isPreBuilt());
                    // Set the ID from the path parameter
                    updatedBuild.setId(id);
                    return ResponseEntity.ok(pcBuildService.saveBuild(updatedBuild));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBuild(@PathVariable Long id) {
        return pcBuildService.getBuildById(id)
                .map(build -> {
                    pcBuildService.deleteBuild(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}