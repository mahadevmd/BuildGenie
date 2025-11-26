// Mock data for BuildGenie application

// PC Components by category
export const components = {
  CPU: [
    {
      id: 1,
      name: "Intel Core i9-12900K",
      brand: "Intel",
      type: "CPU",
      price: 589.99,
      imageUrl: "https://example.com/images/i9-12900k.jpg",
      details: {
        specs: "16 cores, 5.2GHz",
        cache: "24MB",
        socket: "LGA1700"
      }
    },
    {
      id: 2,
      name: "AMD Ryzen 9 5950X",
      brand: "AMD",
      type: "CPU",
      price: 549.99,
      imageUrl: "https://example.com/images/ryzen-9-5950x.jpg",
      details: {
        specs: "16 cores, 4.9GHz",
        cache: "64MB",
        socket: "AM4"
      }
    },
    {
      id: 3,
      name: "Intel Core i7-12700K",
      brand: "Intel",
      type: "CPU",
      price: 409.99,
      imageUrl: "https://example.com/images/i7-12700k.jpg",
      details: {
        specs: "12 cores, 5.0GHz",
        cache: "25MB",
        socket: "LGA1700"
      }
    },
    {
      id: 4,
      name: "AMD Ryzen 7 5800X",
      brand: "AMD",
      type: "CPU",
      price: 349.99,
      imageUrl: "https://example.com/images/ryzen-7-5800x.jpg",
      details: {
        specs: "8 cores, 4.7GHz",
        cache: "32MB",
        socket: "AM4"
      }
    }
  ],
  GPU: [
    {
      id: 5,
      name: "NVIDIA GeForce RTX 3080",
      brand: "NVIDIA",
      type: "GPU",
      price: 699.99,
      imageUrl: "https://example.com/images/rtx-3080.jpg",
      details: {
        memory: "10GB GDDR6X",
        clockSpeed: "1710MHz"
      }
    },
    {
      id: 6,
      name: "AMD Radeon RX 6800 XT",
      brand: "AMD",
      type: "GPU",
      price: 649.99,
      imageUrl: "https://example.com/images/rx-6800xt.jpg",
      details: {
        memory: "16GB GDDR6",
        clockSpeed: "2250MHz"
      }
    },
    {
      id: 7,
      name: "NVIDIA GeForce RTX 3070",
      brand: "NVIDIA",
      type: "GPU",
      price: 499.99,
      imageUrl: "https://example.com/images/rtx-3070.jpg",
      details: {
        memory: "8GB GDDR6",
        clockSpeed: "1730MHz"
      }
    },
    {
      id: 8,
      name: "AMD Radeon RX 6700 XT",
      brand: "AMD",
      type: "GPU",
      price: 479.99,
      imageUrl: "https://example.com/images/rx-6700xt.jpg",
      details: {
        memory: "12GB GDDR6",
        clockSpeed: "2581MHz"
      }
    }
  ],
  RAM: [
    {
      id: 9,
      name: "Corsair Vengeance RGB Pro",
      brand: "Corsair",
      type: "RAM",
      price: 89.99,
      imageUrl: "https://example.com/images/corsair-vengeance.jpg",
      details: {
        capacity: "16GB (2x8GB)",
        speed: "DDR4-3600"
      }
    },
    {
      id: 10,
      name: "G.Skill Trident Z Neo",
      brand: "G.Skill",
      type: "RAM",
      price: 109.99,
      imageUrl: "https://example.com/images/gskill-trident.jpg",
      details: {
        capacity: "32GB (2x16GB)",
        speed: "DDR4-3600"
      }
    },
    {
      id: 11,
      name: "Crucial Ballistix",
      brand: "Crucial",
      type: "RAM",
      price: 79.99,
      imageUrl: "https://example.com/images/crucial-ballistix.jpg",
      details: {
        capacity: "16GB (2x8GB)",
        speed: "DDR4-3200"
      }
    },
    {
      id: 12,
      name: "Kingston FURY Beast",
      brand: "Kingston",
      type: "RAM",
      price: 94.99,
      imageUrl: "https://example.com/images/kingston-fury.jpg",
      details: {
        capacity: "16GB (2x8GB)",
        speed: "DDR4-3200"
      }
    }
  ],
  Storage: [
    {
      id: 13,
      name: "Samsung 970 EVO Plus",
      brand: "Samsung",
      type: "Storage",
      price: 129.99,
      imageUrl: "https://example.com/images/samsung-970.jpg",
      details: {
        capacity: "1TB",
        type: "NVMe M.2",
        speed: "3500MB/s read"
      }
    },
    {
      id: 14,
      name: "WD Black SN850",
      brand: "Western Digital",
      type: "Storage",
      price: 149.99,
      imageUrl: "https://example.com/images/wd-black.jpg",
      details: {
        capacity: "1TB",
        type: "NVMe M.2",
        speed: "7000MB/s read"
      }
    },
    {
      id: 15,
      name: "Crucial MX500",
      brand: "Crucial",
      type: "Storage",
      price: 99.99,
      imageUrl: "https://example.com/images/crucial-mx500.jpg",
      details: {
        capacity: "1TB",
        type: "SATA SSD",
        speed: "560MB/s read"
      }
    },
    {
      id: 16,
      name: "Seagate Barracuda",
      brand: "Seagate",
      type: "Storage",
      price: 49.99,
      imageUrl: "https://example.com/images/seagate-barracuda.jpg",
      details: {
        capacity: "2TB",
        type: "HDD",
        speed: "7200RPM"
      }
    }
  ],
  Motherboard: [
    {
      id: 17,
      name: "ASUS ROG Strix Z690-E",
      brand: "ASUS",
      type: "Motherboard",
      price: 469.99,
      imageUrl: "https://example.com/images/asus-z690.jpg",
      details: {
        formFactor: "ATX",
        socket: "LGA1700",
        memoryType: "DDR5"
      }
    },
    {
      id: 18,
      name: "MSI MPG X570 Gaming Edge",
      brand: "MSI",
      type: "Motherboard",
      price: 269.99,
      imageUrl: "https://example.com/images/msi-x570.jpg",
      details: {
        formFactor: "ATX",
        socket: "AM4",
        memoryType: "DDR4"
      }
    },
    {
      id: 19,
      name: "Gigabyte B550 AORUS Elite",
      brand: "Gigabyte",
      type: "Motherboard",
      price: 159.99,
      imageUrl: "https://example.com/images/gigabyte-b550.jpg",
      details: {
        formFactor: "ATX",
        socket: "AM4",
        memoryType: "DDR4"
      }
    },
    {
      id: 20,
      name: "ASRock B660M Pro RS",
      brand: "ASRock",
      type: "Motherboard",
      price: 139.99,
      imageUrl: "https://example.com/images/asrock-b660m.jpg",
      details: {
        formFactor: "Micro-ATX",
        socket: "LGA1700",
        memoryType: "DDR4"
      }
    }
  ],
  PSU: [
    {
      id: 21,
      name: "Corsair RM850x",
      brand: "Corsair",
      type: "PSU",
      price: 129.99,
      imageUrl: "https://example.com/images/corsair-rm850x.jpg",
      details: {
        wattage: "850W",
        certification: "80+ Gold",
        modularity: "Fully Modular"
      }
    },
    {
      id: 22,
      name: "EVGA SuperNOVA 750 G5",
      brand: "EVGA",
      type: "PSU",
      price: 109.99,
      imageUrl: "https://example.com/images/evga-supernova.jpg",
      details: {
        wattage: "750W",
        certification: "80+ Gold",
        modularity: "Fully Modular"
      }
    },
    {
      id: 23,
      name: "Seasonic FOCUS GX-650",
      brand: "Seasonic",
      type: "PSU",
      price: 89.99,
      imageUrl: "https://example.com/images/seasonic-focus.jpg",
      details: {
        wattage: "650W",
        certification: "80+ Gold",
        modularity: "Fully Modular"
      }
    },
    {
      id: 24,
      name: "be quiet! Pure Power 11",
      brand: "be quiet!",
      type: "PSU",
      price: 79.99,
      imageUrl: "https://example.com/images/bequiet-purepower.jpg",
      details: {
        wattage: "600W",
        certification: "80+ Gold",
        modularity: "Semi-Modular"
      }
    }
  ],
  Case: [
    {
      id: 25,
      name: "Lian Li PC-O11 Dynamic",
      brand: "Lian Li",
      type: "Case",
      price: 149.99,
      imageUrl: "https://example.com/images/lian-li-o11.jpg",
      details: {
        formFactor: "Mid Tower",
        compatibility: "ATX, Micro-ATX, Mini-ITX"
      }
    },
    {
      id: 26,
      name: "Corsair 4000D Airflow",
      brand: "Corsair",
      type: "Case",
      price: 94.99,
      imageUrl: "https://example.com/images/corsair-4000d.jpg",
      details: {
        formFactor: "Mid Tower",
        compatibility: "ATX, Micro-ATX, Mini-ITX"
      }
    },
    {
      id: 27,
      name: "NZXT H510",
      brand: "NZXT",
      type: "Case",
      price: 69.99,
      imageUrl: "https://example.com/images/nzxt-h510.jpg",
      details: {
        formFactor: "Mid Tower",
        compatibility: "ATX, Micro-ATX, Mini-ITX"
      }
    },
    {
      id: 28,
      name: "Fractal Design Meshify C",
      brand: "Fractal Design",
      type: "Case",
      price: 89.99,
      imageUrl: "https://example.com/images/fractal-meshify.jpg",
      details: {
        formFactor: "Mid Tower",
        compatibility: "ATX, Micro-ATX, Mini-ITX"
      }
    }
  ]
};

// Pre-configured PC builds
export const preBuiltConfigurations = {
  gaming: [
    {
      id: 1,
      name: "Entry-Level Gaming",
      price: 799.99,
      image: "https://example.com/images/entry-gaming.jpg",
      description: "Perfect for 1080p gaming at medium settings. Great for esports titles and casual gaming.",
      components: {
        CPU: "AMD Ryzen 5 5600X",
        GPU: "NVIDIA GeForce GTX 1660 Super",
        RAM: "16GB DDR4-3200",
        Storage: "500GB NVMe SSD",
        Motherboard: "B550 ATX",
        PSU: "550W 80+ Bronze",
        Case: "Mid Tower ATX"
      }
    },
    {
      id: 2,
      name: "Mid-Range Gaming",
      price: 1299.99,
      image: "https://example.com/images/mid-gaming.jpg",
      description: "Excellent 1440p gaming performance. Handle most AAA titles at high settings with good framerates.",
      components: {
        CPU: "AMD Ryzen 7 5800X",
        GPU: "NVIDIA GeForce RTX 3070",
        RAM: "32GB DDR4-3600",
        Storage: "1TB NVMe SSD",
        Motherboard: "X570 ATX",
        PSU: "750W 80+ Gold",
        Case: "Mid Tower ATX RGB"
      }
    },
    {
      id: 3,
      name: "High-End Gaming",
      price: 2499.99,
      image: "https://example.com/images/high-gaming.jpg",
      description: "Ultimate 4K gaming experience. Run any game at max settings with high framerates.",
      components: {
        CPU: "Intel Core i9-12900K",
        GPU: "NVIDIA GeForce RTX 3080 Ti",
        RAM: "32GB DDR5-5200",
        Storage: "2TB NVMe Gen4 SSD",
        Motherboard: "Z690 ATX",
        PSU: "850W 80+ Platinum",
        Case: "Full Tower ATX"
      }
    }
  ],
  office: [
    {
      id: 4,
      name: "Basic Office PC",
      price: 499.99,
      image: "https://example.com/images/basic-office.jpg",
      description: "Perfect for everyday office tasks, web browsing, and document editing.",
      components: {
        CPU: "Intel Core i3-12100",
        GPU: "Integrated Intel UHD Graphics",
        RAM: "8GB DDR4-3200",
        Storage: "256GB SATA SSD",
        Motherboard: "H610 Micro-ATX",
        PSU: "400W 80+ Bronze",
        Case: "Micro-ATX Tower"
      }
    },
    {
      id: 5,
      name: "Professional Office PC",
      price: 799.99,
      image: "https://example.com/images/pro-office.jpg",
      description: "Enhanced performance for multitasking and productivity applications.",
      components: {
        CPU: "Intel Core i5-12400",
        GPU: "Integrated Intel UHD Graphics",
        RAM: "16GB DDR4-3200",
        Storage: "512GB NVMe SSD",
        Motherboard: "B660 ATX",
        PSU: "500W 80+ Bronze",
        Case: "Mid Tower ATX"
      }
    },
    {
      id: 6,
      name: "Executive Office PC",
      price: 1099.99,
      image: "https://example.com/images/exec-office.jpg",
      description: "Premium performance for demanding business applications and light content creation.",
      components: {
        CPU: "Intel Core i7-12700",
        GPU: "NVIDIA GeForce GTX 1650",
        RAM: "32GB DDR4-3600",
        Storage: "1TB NVMe SSD + 2TB HDD",
        Motherboard: "B660 ATX",
        PSU: "650W 80+ Gold",
        Case: "Mid Tower ATX"
      }
    }
  ],
  workstation: [
    {
      id: 7,
      name: "Content Creator Workstation",
      price: 1799.99,
      image: "https://example.com/images/content-workstation.jpg",
      description: "Optimized for video editing, graphic design, and content creation.",
      components: {
        CPU: "AMD Ryzen 9 5900X",
        GPU: "NVIDIA GeForce RTX 3070",
        RAM: "32GB DDR4-3600",
        Storage: "1TB NVMe SSD + 2TB HDD",
        Motherboard: "X570 ATX",
        PSU: "750W 80+ Gold",
        Case: "Mid Tower ATX"
      }
    },
    {
      id: 8,
      name: "Professional Workstation",
      price: 2499.99,
      image: "https://example.com/images/pro-workstation.jpg",
      description: "High-performance system for 3D rendering, CAD, and professional applications.",
      components: {
        CPU: "AMD Ryzen 9 5950X",
        GPU: "NVIDIA GeForce RTX 3080",
        RAM: "64GB DDR4-3600",
        Storage: "2TB NVMe SSD + 4TB HDD",
        Motherboard: "X570 ATX",
        PSU: "850W 80+ Platinum",
        Case: "Full Tower ATX"
      }
    },
    {
      id: 9,
      name: "Enterprise Workstation",
      price: 3999.99,
      image: "https://example.com/images/enterprise-workstation.jpg",
      description: "Ultimate performance for the most demanding professional workloads.",
      components: {
        CPU: "AMD Threadripper 3970X",
        GPU: "NVIDIA RTX A5000",
        RAM: "128GB DDR4-3200 ECC",
        Storage: "4TB NVMe SSD + 8TB HDD RAID",
        Motherboard: "TRX40 EATX",
        PSU: "1200W 80+ Titanium",
        Case: "Full Tower EATX"
      }
    }
  ],
  budget: [
    {
      id: 10,
      name: "Ultra Budget PC",
      price: 399.99,
      image: "https://example.com/images/ultra-budget.jpg",
      description: "Affordable PC for basic computing needs and light gaming.",
      components: {
        CPU: "AMD Ryzen 3 4100",
        GPU: "Integrated AMD Radeon Graphics",
        RAM: "8GB DDR4-3200",
        Storage: "256GB SATA SSD",
        Motherboard: "A520 Micro-ATX",
        PSU: "400W 80+ White",
        Case: "Micro-ATX Tower"
      }
    },
    {
      id: 11,
      name: "Budget Gaming PC",
      price: 599.99,
      image: "https://example.com/images/budget-gaming.jpg",
      description: "Affordable gaming PC for 1080p gaming on medium settings.",
      components: {
        CPU: "Intel Core i3-12100F",
        GPU: "NVIDIA GeForce GTX 1650",
        RAM: "16GB DDR4-3200",
        Storage: "500GB NVMe SSD",
        Motherboard: "B660 Micro-ATX",
        PSU: "500W 80+ Bronze",
        Case: "Micro-ATX Tower"
      }
    },
    {
      id: 12,
      name: "Value Gaming PC",
      price: 799.99,
      image: "https://example.com/images/value-gaming.jpg",
      description: "Best value for 1080p gaming with good performance-to-price ratio.",
      components: {
        CPU: "AMD Ryzen 5 5600",
        GPU: "AMD Radeon RX 6600",
        RAM: "16GB DDR4-3600",
        Storage: "1TB NVMe SSD",
        Motherboard: "B550 ATX",
        PSU: "550W 80+ Bronze",
        Case: "Mid Tower ATX"
      }
    }
  ]
};

// User data
export const users = [
  {
    id: 1,
    username: "john_doe",
    email: "john@example.com",
    savedBuilds: [1, 3]
  },
  {
    id: 2,
    username: "jane_smith",
    email: "jane@example.com",
    savedBuilds: [2, 5]
  }
];

// Helper function to get all components as a flat array
export const getAllComponents = () => {
  return Object.values(components).flat();
};

// Helper function to get a component by ID
export const getComponentById = (id) => {
  const allComponents = getAllComponents();
  return allComponents.find(component => component.id === id);
};

// Helper function to get components by type
export const getComponentsByType = (type) => {
  return components[type] || [];
};

// Helper function to get a pre-built configuration by ID
export const getPreBuiltConfigById = (id) => {
  const allConfigs = Object.values(preBuiltConfigurations).flat();
  return allConfigs.find(config => config.id === id);
};

// Helper function to get pre-built configurations by category
export const getPreBuiltConfigsByCategory = (category) => {
  return preBuiltConfigurations[category] || [];
};

export default {
  components,
  preBuiltConfigurations,
  users,
  getAllComponents,
  getComponentById,
  getComponentsByType,
  getPreBuiltConfigById,
  getPreBuiltConfigsByCategory
};