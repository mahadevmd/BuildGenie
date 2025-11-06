package com.buildgenie.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "pc_builds")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PcBuild {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    private String category;
    
    private String description;
    
    private BigDecimal totalPrice;

    // Aggregate system power draw in watts (excluding PSU capacity)
    private Integer totalWattage;

    private Integer fps;
    
    private String imageUrl;
    
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    @ElementCollection
    @CollectionTable(name = "pc_build_components", 
                    joinColumns = @JoinColumn(name = "build_id"))
    @MapKeyColumn(name = "component_type")
    @Column(name = "component_id")
    private Map<String, Long> componentIds = new HashMap<>();
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"savedBuilds", "hibernateLazyInitializer", "handler"})
    private User user;
    
    private boolean isPreBuilt;
}