package com.buildgenie.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Map;

@Entity
@Table(name = "components")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Component {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    private String type;
    
    private String brand;
    
    private BigDecimal price;

    private String imageUrl;

    // Power consumption or capacity in watts (PSU uses capacity)
    private Integer wattage;

    // Metadata fields
    private String model;

    // Generic component speed metric (e.g., RAM MHz, GPU clock)
    private Integer speed;

    // Human-friendly description
    @Column(length = 2048)
    private String description;
    
    @ElementCollection
    @CollectionTable(name = "component_details", 
                    joinColumns = @JoinColumn(name = "component_id"))
    @MapKeyColumn(name = "detail_key")
    @Column(name = "detail_value")
    private Map<String, String> details;
}