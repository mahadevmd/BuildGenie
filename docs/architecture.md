# BuildGenie System Architecture

This document provides a detailed, C4-style view of BuildGenie, including system context, containers, core components, key runtime flows, data model, security, and environment setup.

## System Context
- Actors: `End User` (browser/mobile), `Admin` (component insertion), `Developer` (local env).
- Systems: `BuildGenie Frontend (React/Angular)`, `BuildGenie Mobile App (Capacitor)`, `BuildGenie Backend (Spring Boot)`, `PostgreSQL`, `AI Forecasting Model (XGBoost/LightGBM)`.
- Protocols: `HTTP/REST`, `JSON`, `JWT`.

```mermaid
flowchart TB
  subgraph "Users & Devices"
    User["End User<br/>(Web Browser)"]
    Mobile["Mobile User<br/>(iOS/Android App)"]
    Admin["Admin User<br/>(Component Management)"]
  end

  subgraph "BuildGenie System"
    subgraph "Frontend Layer"
      WebApp["React/Angular SPA<br/>• Component Selection<br/>• Real-time Compatibility Checks<br/>• Power Supply Validation<br/>• Build Summary & Pricing"]
      MobileApp["Mobile App<br/>(Capacitor Wrapper)<br/>• Same UI/UX as Web<br/>• Native App Distribution"]
    end

    subgraph "Backend Services"
      API["Spring Boot API<br/>• JWT Authentication<br/>• Component CRUD<br/>• Build Management<br/>• AI Integration"]
      
      subgraph "Core Features"
        CompCheck["Compatibility Engine<br/>• Socket Validation<br/>• Form Factor Checks<br/>• Memory Type Matching"]
        PowerCalc["Power Calculator<br/>• Wattage Summation<br/>• PSU Sufficiency<br/>• 20% Safety Margin"]
        BuildMgmt["Build Management<br/>• Save/Load Builds<br/>• User Profiles<br/>• Build History"]
      end
    end

    subgraph "Data & AI Layer"
      DB[(PostgreSQL Database<br/>• Users & Authentication<br/>• Component Catalog<br/>• Saved Builds<br/>• Component Specifications)]
      AI["AI Forecasting Model<br/>(XGBoost/LightGBM)<br/>• Performance Prediction<br/>• FPS Estimation<br/>• Gaming Benchmarks"]
    end
  end

  subgraph "External Systems"
    AppStores["App Stores<br/>(iOS App Store<br/>Google Play Store)"]
  end

  %% User Interactions
  User -->|"Browse, Build, Save"| WebApp
  Mobile -->|"Native App Experience"| MobileApp
  Admin -->|"Component Management"| WebApp

  %% Frontend to Backend
  WebApp -->|"HTTP/REST + JWT<br/>Component Queries<br/>Build Operations"| API
  MobileApp -->|"Same API Endpoints"| API

  %% Backend Internal Flow
  API --> CompCheck
  API --> PowerCalc
  API --> BuildMgmt
  API -->|"JDBC Queries"| DB
  API -->|"Performance Prediction"| AI
  AI -->|"Forecasting Results"| API

  %% Frontend Validation
  WebApp -.->|"Client-side Validation"| CompCheck
  WebApp -.->|"Real-time Calculation"| PowerCalc

  %% Mobile Distribution
  MobileApp -->|"App Distribution"| AppStores

  %% Data Flow
  CompCheck -->|"Component Specs"| DB
  PowerCalc -->|"Wattage Data"| DB
  BuildMgmt -->|"User Builds"| DB
```

## Container Diagram
- Frontend: React SPA, routes guarded by `ProtectedRoute`, state in `AuthContext`, API via `services/api.js`.
- Backend: Controllers, Services, Repos, Security (`JwtAuthenticationFilter`, `SecurityConfig`), DTOs, Models.
- DB: `users`, `components`, `pc_builds` tables.

```mermaid
flowchart TB
  subgraph "Frontend" ["Frontend (React/Angular)"]
    App["App.js + Router"]
    Auth["AuthContext.js"]
    PR["ProtectedRoute"]
    Pages["Pages: Builder, SavedBuilds, SavedBuildDetail, Login, Register"]
    API["services/api.js (axios + interceptors)"]
    BuildSummary["BuildSummary + ForecastButton"]
    App --> Auth --> PR --> Pages --> API
    Pages --> BuildSummary --> API
  end
  
  subgraph "Mobile" ["Mobile App (Capacitor)"]
    AppWrapper["Native App Shell"]
    AppWrapper --> Frontend
  end

  subgraph "Backend" ["Backend (Spring Boot)"]
    C["Controllers"]
    FC["ForecastController"]
    S["Services"]
    FS["ForecastService"]
    R["Repositories"]
    Sec["Security: SecurityConfig + JwtAuthenticationFilter + JwtTokenUtil"]
    DTO["DTOs"]
    Model["Models"]
    C --> S --> R
    FC --> FS
    Sec --> C
    Sec --> FC
    DTO --> C
    DTO --> FC
    Model --> R
  end

  AI["AI Model (XGBoost/LightGBM)"]
  DB[(PostgreSQL)]

  Frontend -->|"/api/*"| Backend
  Mobile -->|"/api/*"| Backend
  Backend -->|"JDBC"| DB
  FS -->|"Prediction"| AI
```

## Backend Components
- Controllers: `AuthController`, `ComponentController`, `PcBuildController`, `UserController`.
- Services: `AuthService`, `ComponentService`, `PCBuildService`, `UserService`.
- Repositories: `UserRepository`, `ComponentRepository`, `PcBuildRepository`.
- Security: `SecurityConfig`, `JwtAuthenticationFilter`, `JwtTokenUtil`.
- Config: `WebConfig` (CORS), `DataInitializer` (seed data).

```mermaid
flowchart LR
  AuthC[AuthController] --> AuthS[AuthService]
  CompC[ComponentController] --> CompS[ComponentService]
  BuildC[PcBuildController] --> PBS[PCBuildService]
  UserC[UserController] --> UserS[UserService]

  AuthS --> UserRepo[UserRepository]
  CompS --> CompRepo[ComponentRepository]
  PBS --> BuildRepo[PcBuildRepository]

  Sec[SecurityConfig] --> Filt[JwtAuthenticationFilter]
  Filt --> JwtU[JwtTokenUtil]
```

## Frontend Components
- Routing: `App.js` uses `ProtectedRoute` for authenticated pages.
- Auth: `AuthContext.js` persists token and user, sets axios default header.
- Services: `services/api.js` with axios instance and request interceptor (injects `Authorization: Bearer <token>`).
- UI: `Header`, `Footer`, shared UI (`button.jsx`, `card.jsx`, `input.jsx`).

```mermaid
flowchart LR
  Router[App.js Router] --> PR[ProtectedRoute]
  PR --> Pages[Builder, SavedBuilds, SavedBuildDetail]
  Router --> Auth[AuthContext]
  Pages --> API[services/api.js]
  Auth --> API
```

## UML Diagrams

```mermaid
classDiagram
  direction LR
  class User {
    +id: Long
    +username: String
    +email: String
    +password: String
    +createdAt: LocalDateTime
    +enabled: boolean
    +roles: Set<String>
  }
  class Component {
    +id: Long
    +name: String
    +type: String
    +brand: String
    +price: BigDecimal
    +imageUrl: String
    +wattage: Integer
    +details: Map<String,String>
  }
  class PcBuild {
    +id: Long
    +name: String
    +category: String
    +description: String
    +totalPrice: BigDecimal
    +totalWattage: Integer
    +imageUrl: String
    +createdAt: LocalDateTime
    +isPreBuilt: boolean
    +componentIds: Map<String,Long>
  }
  class AuthController
  class ComponentController
  class PcBuildController
  class UserController
  class AuthService
  class ComponentService
  class PCBuildService
  class UserService
  class UserRepository
  class ComponentRepository
  class PcBuildRepository
  class SecurityConfig
  class JwtAuthenticationFilter
  class JwtTokenUtil

  AuthController --> AuthService
  ComponentController --> ComponentService
  PcBuildController --> PCBuildService
  UserController --> UserService

  AuthService --> UserRepository
  ComponentService --> ComponentRepository
  PCBuildService --> PcBuildRepository
  UserService --> UserRepository

  User "1" --> "*" PcBuild : savedBuilds
  PcBuild "*" o--> "*" Component : selected components

  SecurityConfig --> JwtAuthenticationFilter
  JwtAuthenticationFilter --> JwtTokenUtil
```

## DFD Diagrams

### DFD Level 0 (Context)
```mermaid
flowchart LR
  subgraph "External Entities"
    EU["End User"]
    MU["Mobile User"]
    AD["Admin"]
  end

  subgraph "Process"
    SYS["BuildGenie System"]
  end

  subgraph "Data Stores"
    DSU[(Users)]
    DSC[(Components)]
    DSB[(Builds)]
  end

  EU -->|"Browse & Build"| SYS
  MU -->|"Mobile Build"| SYS
  AD -->|"Manage Components"| SYS

  SYS -->|"Authenticate / JWT"| DSU
  SYS -->|"Query/Update Components"| DSC
  SYS -->|"Save/Load Builds"| DSB
```

### DFD Level 1 (Build & Validation)
```mermaid
flowchart TB
  EU["End User"] --> AUTH["Auth Process"]
  AUTH -->|"JWT"| DSU[(Users)]
  EU --> CATALOG["Component Catalog"]
  CATALOG -->|"list components"| DSC[(Components)]

  EU --> SELECT["Select Components"]
  SELECT --> VALIDATE["Compatibility Validation"]
  VALIDATE -->|"sockets, form factors, memory type"| DSC

  SELECT --> POWER["Power Calculation"]
  POWER -->|"total wattage, headroom"| DSB[(Builds)]

  SELECT --> SAVE["Save Build"]
  SAVE -->|"persist build"| DSB

  SAVE --> FORECAST["AI Forecasting"]
  FORECAST -->|"performance score"| EU
```

## Runtime Flows

### Login Flow
```mermaid
sequenceDiagram
  participant U as User
  participant FE as React (AuthContext)
  participant BE as Spring Boot (AuthController)
  participant Sec as JwtTokenUtil
  U->>FE: Submit username/password
  FE->>BE: POST /api/auth/login {username, password}
  BE->>Sec: Validate and sign JWT
  Sec-->>BE: token
  BE-->>FE: {token, username}
  FE->>LocalStorage: Save token + username
  FE->>Axios: Set Authorization header
  FE-->>U: Logged in, navigate to protected routes
```

### Builder: Load Components & Save Build
```mermaid
sequenceDiagram
  participant FE as React (Builder)
  participant BE as ComponentController
  participant Repo as ComponentRepository
  FE->>BE: GET /api/v1/components (Authorization: Bearer)
  BE->>Repo: findAll()
  Repo-->>BE: components[]
  BE-->>FE: JSON components[]
  Note over FE: User selects components
  FE->>FE: Validate component compatibility (sockets, form factors)
  FE->>FE: Calculate total wattage (exclude PSU capacity)
  FE->>FE: Check PSU sufficiency (required = totalWattage * 1.2)
  FE->>FE: Update UI with validation results & totals
  Note over FE: Display compatibility warnings/confirmations
  FE->>BE: POST /api/builds (Authorization: Bearer, payload)
  BE->>PBS: validate & persist
  PBS->>PcBuildRepo: save(build)
  PcBuildRepo-->>PBS: buildId
  PBS-->>FE: saved build
```

### AI Performance Forecasting Flow
```mermaid
sequenceDiagram
  participant U as User
  participant FE as Frontend (BuildSummary)
  participant FC as ForecastController
  participant FS as ForecastService
  participant AI as XGBoost/LightGBM Model
  U->>FE: Click "Forecast Performance"
  FE->>FC: POST /api/forecast {componentSpecs}
  FC->>FS: forecastPerformance(componentSpecs)
  FS->>AI: predict(preprocessedData)
  AI-->>FS: performanceScore
  FS-->>FC: {fps: 144, score: 9.5}
  FC-->>FE: JSON response
  FE-->>U: Display performance metrics
```

### Saved Builds: List & Detail
```mermaid
sequenceDiagram
  participant FE as React (SavedBuilds)
  participant BE as PcBuildController
  participant Repo as PcBuildRepository
  FE->>BE: GET /api/builds (Authorization: Bearer)
  BE->>Repo: findByUser()
  Repo-->>BE: builds[]
  BE-->>FE: JSON builds[]
  FE->>BE: GET /api/builds/{id}
  BE-->>FE: JSON build
```

### Component Compatibility Checking Flow
```mermaid
sequenceDiagram
  participant U as User
  participant FE as React (Builder/SavedBuildDetail)
  participant Comp as Component State
  U->>FE: Select component (CPU, GPU, RAM, etc.)
  FE->>Comp: Update selectedComponents state
  Note over FE: Trigger compatibility validation
  FE->>FE: Check CPU socket vs Motherboard socket
  FE->>FE: Check RAM type vs Motherboard memory type
  FE->>FE: Check Case compatibility (ATX, Micro-ATX, Mini-ITX)
  FE->>FE: Validate form factor compatibility
  alt Compatibility Issues Found
    FE-->>U: Display warning/error messages
    Note over U: Red border, incompatible indicators
  else All Compatible
    FE-->>U: Display green checkmarks
    Note over U: Components are compatible
  end
```

### Power Supply Validation Flow
```mermaid
sequenceDiagram
  participant U as User
  participant FE as React (Builder/SavedBuildDetail)
  participant Calc as Wattage Calculator
  U->>FE: Select/change components
  FE->>Calc: Calculate total system wattage
  Note over Calc: Sum all component wattages (exclude PSU)
  Calc->>Calc: totalWattage = CPU + GPU + RAM + Storage + Motherboard + Case
  Calc->>Calc: requiredPSU = totalWattage * 1.2 (20% headroom)
  Calc-->>FE: Return calculated values
  FE->>FE: Compare PSU capacity vs required wattage
  alt PSU Insufficient
    FE-->>U: Display red warning "PSU may be insufficient"
    Note over U: Recommend higher wattage PSU
  else PSU Sufficient
    FE-->>U: Display green "PSU is sufficient"
    Note over U: Show available headroom
  end
  FE-->>U: Display: Total Wattage, Required PSU, Current PSU
```
```mermaid
erDiagram
  USER ||--o{ USER_ROLE : has
  USER ||--o{ PC_BUILD : owns
  COMPONENT ||--o{ COMPONENT_DETAIL : has
  PC_BUILD ||--o{ PC_BUILD_COMPONENT : maps
  COMPONENT ||--o{ PC_BUILD_COMPONENT : maps
  PC_BUILD ||--o{ FORECAST : has

  USER {
    bigint id PK
    varchar username UNIQUE
    varchar email UNIQUE
    varchar password
    timestamp createdAt
    boolean accountNonExpired
    boolean accountNonLocked
    boolean credentialsNonExpired
    boolean enabled
  }

  USER_ROLE {
    bigint user_id FK
    varchar role
  }

  COMPONENT {
    bigint id PK
    varchar name
    varchar type
    varchar brand
    numeric price
    varchar imageUrl
    int wattage
  }

  COMPONENT_DETAIL {
    bigint component_id FK
    varchar detail_key
    varchar detail_value
  }

  PC_BUILD {
    bigint id PK
    varchar name
    varchar category
    text description
    numeric totalPrice
    int totalWattage
    varchar imageUrl
    boolean isPreBuilt
    bigint user_id FK
    timestamp createdAt
  }
  
  PC_BUILD_COMPONENT {
    bigint build_id FK
    varchar component_type
    bigint component_id FK
  }
  
  FORECAST {
    bigint id PK
    bigint build_id FK
    int fps_score
    numeric performance_score
    timestamp created_at
  }
```

## Component Validation & Compatibility

BuildGenie includes comprehensive client-side validation for component compatibility and power supply adequacy to ensure users build functional PC configurations.

### Compatibility Rules
The frontend validates the following compatibility constraints:

1. **CPU & Motherboard Socket Compatibility**
   - CPU socket type must match motherboard socket (e.g., LGA1700, AM4, AM5)
   - Validated in real-time when either component is selected

2. **RAM & Motherboard Memory Type**
   - RAM type (DDR4, DDR5) must match motherboard memory support
   - Ensures memory modules are compatible with the motherboard

3. **Case & Motherboard Form Factor**
   - Case must support the motherboard form factor (ATX, Micro-ATX, Mini-ITX)
   - Prevents selection of cases too small for the chosen motherboard

4. **General Form Factor Validation**
   - Components must physically fit within the selected case
   - Validates against component dimensions and case specifications

### Power Supply Validation
The system calculates and validates power requirements:

1. **Wattage Calculation**
   - Sums wattage of all components except PSU (CPU + GPU + RAM + Storage + Motherboard + Case)
   - PSU wattage represents capacity, not consumption

2. **Headroom Calculation**
   - Required PSU capacity = Total system wattage × 1.2 (20% safety margin)
   - Ensures stable operation under peak loads

3. **Validation Logic**
   - Green indicator: PSU capacity ≥ required wattage
   - Red warning: PSU capacity < required wattage
   - Displays actual vs. required wattage for user reference

### Implementation Details
- **Location**: Frontend validation in `Builder.js` and `SavedBuildDetail.js`
- **Trigger**: Real-time validation on component selection/change
- **UI Feedback**: Color-coded indicators, warning messages, compatibility status
- **Data Source**: Component specifications stored in `specs` JSONB field

## Mobile App Wrapper

The BuildGenie application is also available as a mobile app through a web wrapper implementation using Capacitor.

### Mobile Architecture
- The mobile app is not a separate native implementation but a wrapper around the web application
- Capacitor provides native API access and app store distribution capabilities
- The same Angular/React frontend codebase is used for both web and mobile experiences

```mermaid
flowchart TB
  subgraph "Mobile App"
    Native["Native Shell (Capacitor)"]
    WebView["WebView"]
    Native --> WebView
    WebView --> Angular["Angular/React App"]
  end
  
  Angular -->|"HTTP/REST"| API["Backend API"]
```

### Implementation Details
- **Technology**: Capacitor for wrapping the web application
- **Deployment**: Native app packages (.apk for Android, .ipa for iOS) distributed via app stores
- **UI/UX**: Responsive design ensures consistent experience across devices
- **Authentication**: Same JWT-based auth flow as the web application
- **API Access**: Uses the same API endpoints and services as the web application

## Security Architecture
- AuthN: JWT bearer tokens issued at `/api/auth/login`, stored in `localStorage`.
- AuthZ: `SecurityConfig` restricts protected endpoints; `JwtAuthenticationFilter` validates bearer token.
- Passwords: BCrypt hashing via `PasswordEncoder`.
- CORS: Configured in `WebConfig` to allow frontend origin; CSRF disabled for stateless API.
- Protected Endpoints:
  - `/api/v1/components` (GET/POST/PUT/DELETE) – authenticated
  - `/api/builds` (CRUD) – authenticated
  - `/api/forecast` (POST) – authenticated
  - `/api/auth/register`, `/api/auth/login` – public
## Environment & Deployment
- Local Dev:
  - Frontend: CRA dev server on `http://localhost:3000` with proxy to backend (`/api/*`).
  - Backend: Spring Boot on `http://localhost:8080`.
  - DB: PostgreSQL (connection via Spring Data JPA).
  - AI Model: Loaded from file at application startup.
- Configuration:
  - Axios interceptor ensures `Authorization` header on all requests.
  - Default boolean flags on `User` should be non-null and default `true`.
  - Mobile app uses the same backend endpoints.

## Observability & Error Handling
- Logging: Spring logging (controllers/services), browser console for frontend.
- Errors: Backend returns structured JSON errors; frontend displays UI messages on failures.
- Future: Add centralized exception handlers and request IDs for tracing.

## Notes & Next Steps
- Role-based access: Introduce roles (e.g., `ROLE_ADMIN`) to gate `ComponentInsert`.
- Validation: Add DTO validation annotations and frontend form validation.
- Monitoring: Add metrics and health checks (`/actuator`).
- CI/CD: Add pipeline to build frontend & backend, run tests, and deploy.