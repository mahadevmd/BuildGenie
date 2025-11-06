package com.buildgenie.controller;

import com.buildgenie.model.Component;
import com.buildgenie.service.ComponentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/components")
@RequiredArgsConstructor
public class ComponentController {
    
    private final ComponentService componentService;
    
    @GetMapping
    public ResponseEntity<List<Component>> getComponents(@RequestParam(required = false) String type) {
        if (type != null && !type.isEmpty()) {
            return ResponseEntity.ok(componentService.getComponentsByType(type));
        }
        return ResponseEntity.ok(componentService.getAllComponents());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Component> getComponentById(@PathVariable Long id) {
        return ResponseEntity.ok(componentService.getComponentById(id));
    }

    @PostMapping
    public ResponseEntity<Component> createComponent(@RequestBody Component component) {
        // Ensure client-provided IDs are ignored to avoid PK conflicts
        component.setId(null);
        return ResponseEntity.status(HttpStatus.CREATED).body(componentService.saveComponent(component));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Component> updateComponent(@PathVariable Long id, @RequestBody Component component) {
        // Ensure the component exists and update
        componentService.getComponentById(id);
        component.setId(id);
        return ResponseEntity.ok(componentService.saveComponent(component));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComponent(@PathVariable Long id) {
        componentService.deleteComponent(id);
        return ResponseEntity.noContent().build();
    }
}