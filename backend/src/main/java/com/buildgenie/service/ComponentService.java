package com.buildgenie.service;

import com.buildgenie.model.Component;
import com.buildgenie.repository.ComponentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ComponentService {
    
    private final ComponentRepository componentRepository;
    
    public List<Component> getAllComponents() {
        try {
            return componentRepository.findAll();
        } catch (Exception e) {
            log.error("Failed to fetch components from database", e);
            return Collections.emptyList();
        }
    }
    
    public List<Component> getComponentsByType(String type) {
        try {
            return componentRepository.findByType(type);
        } catch (Exception e) {
            log.error("Failed to fetch components by type {}", type, e);
            return Collections.emptyList();
        }
    }
    
    public Component saveComponent(Component component) {
        try {
            return componentRepository.save(component);
        } catch (Exception e) {
            log.error("Failed to save component {}", component.getName(), e);
            throw new RuntimeException("Unable to save component");
        }
    }
    
    public Component getComponentById(Long id) {
        try {
            return componentRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Component not found with id: " + id));
        } catch (Exception e) {
            log.error("Failed to fetch component with id {}", id, e);
            throw new RuntimeException("Unable to fetch component by id");
        }
    }
    
    public void deleteComponent(Long id) {
        try {
            componentRepository.deleteById(id);
        } catch (Exception e) {
            log.error("Failed to delete component with id {}", id, e);
            throw new RuntimeException("Unable to delete component");
        }
    }
}