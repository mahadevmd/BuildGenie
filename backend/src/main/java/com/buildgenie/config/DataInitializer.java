package com.buildgenie.config;

import com.buildgenie.model.Component;
import com.buildgenie.repository.ComponentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;



@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ComponentRepository componentRepository;

    @Override
    public void run(String... args) {
        if (componentRepository.count() == 0) {
            seedComponents();
        }
    }

    private void seedComponents() {
        // CPU Components
        Component cpu1 = createCpu("Intel Core i9-12900K", "Intel", new BigDecimal("589.99"), 
                "https://example.com/images/i9-12900k.jpg", 125, "16 cores, 5.2GHz", "24MB", "LGA1700");
        
        Component cpu2 = createCpu("AMD Ryzen 9 5950X", "AMD", new BigDecimal("549.99"), 
                "https://example.com/images/ryzen-9-5950x.jpg", 105, "16 cores, 4.9GHz", "64MB", "AM4");
        
        // GPU Components
        Component gpu1 = createGpu("NVIDIA GeForce RTX 3080", "NVIDIA", new BigDecimal("699.99"), 
                "https://example.com/images/rtx-3080.jpg", 320, "10GB GDDR6X", "1710MHz");
        
        Component gpu2 = createGpu("AMD Radeon RX 6800 XT", "AMD", new BigDecimal("649.99"), 
                "https://example.com/images/rx-6800xt.jpg", 300, "16GB GDDR6", "2250MHz");
        
        // RAM Components
        Component ram1 = createRam("Corsair Vengeance RGB Pro", "Corsair", new BigDecimal("89.99"), 
                "https://example.com/images/corsair-vengeance.jpg", 8, "16GB (2x8GB)", "DDR4-3600");
        
        Component ram2 = createRam("G.Skill Trident Z Neo", "G.Skill", new BigDecimal("109.99"), 
                "https://example.com/images/gskill-trident.jpg", 12, "32GB (2x16GB)", "DDR4-3600");
        
        // Storage Components
        Component storage1 = createStorage("Samsung 970 EVO Plus", "Samsung", new BigDecimal("129.99"), 
                "https://example.com/images/samsung-970.jpg", 5, "1TB", "NVMe M.2", "3500MB/s read");
        
        Component storage2 = createStorage("WD Black SN850", "Western Digital", new BigDecimal("149.99"), 
                "https://example.com/images/wd-black.jpg", 5, "1TB", "NVMe M.2", "7000MB/s read");
        
        // Motherboard Components
        Component mobo1 = createMotherboard("ASUS ROG Strix Z690-E", "ASUS", new BigDecimal("469.99"), 
                "https://example.com/images/asus-z690.jpg", 60, "ATX", "LGA1700", "DDR5");
        
        Component mobo2 = createMotherboard("MSI MPG X570 Gaming Edge", "MSI", new BigDecimal("269.99"), 
                "https://example.com/images/msi-x570.jpg", 55, "ATX", "AM4", "DDR4");
        
        // Power Supply Components
        Component psu1 = createPsu("Corsair RM850x", "Corsair", new BigDecimal("129.99"), 
                "https://example.com/images/corsair-rm850x.jpg", 850, "80+ Gold", "Fully Modular");
        
        Component psu2 = createPsu("EVGA SuperNOVA 750 G5", "EVGA", new BigDecimal("109.99"), 
                "https://example.com/images/evga-supernova.jpg", 750, "80+ Gold", "Fully Modular");
        
        // Case Components
        Component case1 = createCase("Lian Li PC-O11 Dynamic", "Lian Li", new BigDecimal("149.99"), 
                "https://example.com/images/lian-li-o11.jpg", 0, "Mid Tower", "ATX, Micro-ATX, Mini-ITX");
        
        Component case2 = createCase("Corsair 4000D Airflow", "Corsair", new BigDecimal("94.99"), 
                "https://example.com/images/corsair-4000d.jpg", 0, "Mid Tower", "ATX, Micro-ATX, Mini-ITX");
        
        componentRepository.saveAll(List.of(
                cpu1, cpu2, gpu1, gpu2, ram1, ram2, storage1, storage2, 
                mobo1, mobo2, psu1, psu2, case1, case2
        ));
    }
    
    private Component createCpu(String name, String brand, BigDecimal price, String imageUrl, 
                               int wattage, String specs, String cache, String socket) {
        Component cpu = new Component();
        cpu.setName(name);
        cpu.setType("CPU");
        cpu.setBrand(brand);
        cpu.setPrice(price);
        cpu.setImageUrl(imageUrl);
        cpu.setWattage(wattage);
        
        Map<String, String> details = new HashMap<>();
        details.put("specs", specs);
        details.put("cache", cache);
        details.put("socket", socket);
        cpu.setDetails(details);
        
        return cpu;
    }
    
    private Component createGpu(String name, String brand, BigDecimal price, String imageUrl, 
                               int wattage, String memory, String clockSpeed) {
        Component gpu = new Component();
        gpu.setName(name);
        gpu.setType("GPU");
        gpu.setBrand(brand);
        gpu.setPrice(price);
        gpu.setImageUrl(imageUrl);
        gpu.setWattage(wattage);
        
        Map<String, String> details = new HashMap<>();
        details.put("memory", memory);
        details.put("clockSpeed", clockSpeed);
        gpu.setDetails(details);
        
        return gpu;
    }
    
    private Component createRam(String name, String brand, BigDecimal price, String imageUrl, 
                               int wattage, String capacity, String speed) {
        Component ram = new Component();
        ram.setName(name);
        ram.setType("RAM");
        ram.setBrand(brand);
        ram.setPrice(price);
        ram.setImageUrl(imageUrl);
        ram.setWattage(wattage);
        
        Map<String, String> details = new HashMap<>();
        details.put("capacity", capacity);
        details.put("speed", speed);
        ram.setDetails(details);
        
        return ram;
    }
    
    private Component createStorage(String name, String brand, BigDecimal price, String imageUrl, 
                                   int wattage, String capacity, String type, String speed) {
        Component storage = new Component();
        storage.setName(name);
        storage.setType("Storage");
        storage.setBrand(brand);
        storage.setPrice(price);
        storage.setImageUrl(imageUrl);
        storage.setWattage(wattage);
        
        Map<String, String> details = new HashMap<>();
        details.put("capacity", capacity);
        details.put("type", type);
        details.put("speed", speed);
        storage.setDetails(details);
        
        return storage;
    }
    
    private Component createMotherboard(String name, String brand, BigDecimal price, String imageUrl, 
                                       int wattage, String formFactor, String socket, String memoryType) {
        Component motherboard = new Component();
        motherboard.setName(name);
        motherboard.setType("Motherboard");
        motherboard.setBrand(brand);
        motherboard.setPrice(price);
        motherboard.setImageUrl(imageUrl);
        motherboard.setWattage(wattage);
        
        Map<String, String> details = new HashMap<>();
        details.put("formFactor", formFactor);
        details.put("socket", socket);
        details.put("memoryType", memoryType);
        motherboard.setDetails(details);
        
        return motherboard;
    }
    
    private Component createPsu(String name, String brand, BigDecimal price, String imageUrl, 
                               int wattage, String certification, String modularity) {
        Component psu = new Component();
        psu.setName(name);
        psu.setType("PSU");
        psu.setBrand(brand);
        psu.setPrice(price);
        psu.setImageUrl(imageUrl);
        psu.setWattage(wattage);
        
        Map<String, String> details = new HashMap<>();
        details.put("wattage", wattage + "W");
        details.put("certification", certification);
        details.put("modularity", modularity);
        psu.setDetails(details);
        
        return psu;
    }
    
    private Component createCase(String name, String brand, BigDecimal price, String imageUrl, 
                                int wattage, String formFactor, String compatibility) {
        Component pcCase = new Component();
        pcCase.setName(name);
        pcCase.setType("Case");
        pcCase.setBrand(brand);
        pcCase.setPrice(price);
        pcCase.setImageUrl(imageUrl);
        pcCase.setWattage(wattage);
        
        Map<String, String> details = new HashMap<>();
        details.put("formFactor", formFactor);
        details.put("compatibility", compatibility);
        pcCase.setDetails(details);
        
        return pcCase;
    }
}