# Space Capabilities Dashboard - Unified Plan

## Vision

Transform the Rocket Engine Comparison app into a comprehensive **Global Space Capabilities Dashboard** that visualizes and compares space development progress across nations, featuring a quantified **Space Capability Index (SCI)** and historical milestone tracking.

### Current State
- Single entity: `Engine` with 14 technical fields
- 34 engines from 9 countries
- Basic CRUD + filtering + comparison

### Target State
A full-stack platform with:
- **Backend**: Comprehensive API with countries, vehicles, missions, satellites, scoring
- **Frontend**: Interactive dashboard with maps, timelines, comparisons, analytics

---

## Milestone 1: Core Domain Foundation
**Priority: P0 (Critical)**

### 1.1 Country / Space Program Entity

**Backend: `Country` Entity**
```java
@Entity
@Table(name = "countries")
public class Country {
    // Identity
    private Long id;
    private String name;                    // "United States"
    private String isoCode;                 // "USA"
    private String flagUrl;

    // Space Agency Info
    private String spaceAgencyName;         // "NASA"
    private String spaceAgencyAcronym;
    private Integer spaceAgencyFounded;     // 1958

    // Budget & Resources
    private BigDecimal annualBudgetUsd;
    private Double budgetAsPercentOfGdp;

    // Launch Statistics
    private Integer totalLaunches;
    private Integer successfulLaunches;
    private Double launchSuccessRate;

    // Workforce
    private Integer activeAstronauts;
    private Integer totalSpaceAgencyEmployees;

    // Capability Flags
    private Boolean humanSpaceflightCapable;
    private Boolean independentLaunchCapable;
    private Boolean reusableRocketCapable;
    private Boolean deepSpaceCapable;
    private Boolean spaceStationCapable;
    private Boolean lunarLandingCapable;
    private Boolean marsLandingCapable;

    // Calculated Score
    private Double overallCapabilityScore;  // 0-100

    // Relationships
    @OneToMany(mappedBy = "country")
    private List<Engine> engines;

    @OneToMany(mappedBy = "country")
    private List<LaunchVehicle> launchVehicles;

    @OneToMany(mappedBy = "country")
    private List<SpaceMission> missions;
}
```

**Frontend: TypeScript Interface**
```typescript
interface Country {
  id: string
  name: string
  code: string                    // ISO 3166-1 alpha-2 (US, CN, RU)
  flag: string                    // URL or emoji
  spaceAgencies: SpaceAgency[]
  spaceCapabilityScore: number    // Computed composite score (0-100)
  region: string                  // Europe, Asia, North America

  // Capability flags
  humanSpaceflightCapable: boolean
  independentLaunchCapable: boolean
  reusableRocketCapable: boolean
  deepSpaceCapable: boolean
}

interface SpaceAgency {
  id: string
  name: string                    // NASA, ESA, CNSA, Roscosmos
  countryId: string
  founded: number
  budget: Budget
  headquarters: string
  website: string
  logo: string
  employees: number
  isGovernment: boolean
  description: string
}
```

**API Endpoints:**
```
GET    /api/countries                    - List all countries with space programs
GET    /api/countries/{id}               - Get country details
GET    /api/countries/by-code/{isoCode}  - Get by ISO code (USA, CHN, RUS)
POST   /api/countries                    - Create new country
PUT    /api/countries/{id}               - Update country
DELETE /api/countries/{id}               - Delete country
GET    /api/countries/rankings           - Global rankings by SCI
```

**Frontend Pages:**
```
/countries                  - Country list with capability rankings
/countries/:code            - Country detail page
/countries/:code/timeline   - Country space timeline
/compare/countries          - Country comparison tool
```

---

### 1.2 Launch Vehicle Entity

**Backend:**
```java
@Entity
@Table(name = "launch_vehicles")
public class LaunchVehicle {
    private Long id;
    private String name;                    // "Falcon 9"
    private String variant;                 // "Block 5"

    @ManyToOne
    private Country country;
    private String manufacturer;            // "SpaceX"

    // Status & Timeline
    private String status;                  // Active, Retired, Development
    private LocalDate firstFlight;

    // Launch Statistics
    private Integer totalLaunches;
    private Integer successfulLaunches;
    private Double successRate;

    // Payload Capabilities (kg)
    private Integer payloadToLeoKg;
    private Integer payloadToGtoKg;
    private Integer payloadToTliKg;

    // Physical Specifications
    private Double heightMeters;
    private Double diameterMeters;
    private Integer liftoffMassKg;
    private Integer stages;

    // Economics
    private BigDecimal costPerLaunchUsd;
    private Double costPerKgToLeoUsd;

    // Capabilities
    private Boolean reusable;
    private Boolean humanRated;

    // Engine Configuration
    @ManyToMany
    private List<Engine> engines;
}
```

**API Endpoints:**
```
GET    /api/launch-vehicles                          - List all vehicles
GET    /api/launch-vehicles/{id}                     - Get vehicle details
GET    /api/launch-vehicles/by-country/{countryId}   - Vehicles by country
GET    /api/launch-vehicles/by-status/{status}       - Filter by status
GET    /api/launch-vehicles/reusable                 - Reusable vehicles only
GET    /api/launch-vehicles/compare?ids=1,2,3        - Compare vehicles
```

---

### 1.3 Engine Entity Enhancement

**Additional Fields for Existing Engine:**
```java
// Add to existing Engine entity
@ManyToOne
private Country country;                    // Replace origin string

private Integer firstFlightYear;
private Boolean reusable;
private Integer reusabilityFlights;

// Throttle & Control
private Double throttleMinPercent;
private Double throttleMaxPercent;
private Double gimbalRangeDegrees;

// Reliability
private Integer totalFlights;
private Integer successfulFlights;
private Double reliabilityRate;

// Evolution
@ManyToOne
private Engine predecessorEngine;

@ManyToOne
private Engine successorEngine;
```

**Enhanced Endpoints:**
```
GET /api/engines/by-country/{countryId}                - Engines by country
GET /api/engines/by-country/{countryId}/statistics     - Aggregated country engine stats
GET /api/engines/technology-leaders                    - Top engines by sophistication
GET /api/engines/evolution/{engineId}                  - Engine family tree
```

---

## Milestone 2: Space Capability Index (SCI)
**Priority: P0 (Critical)**

### 2.1 Capability Categories

```java
public enum CapabilityCategory {
    LAUNCH_CAPABILITY,          // Ability to reach space independently
    PROPULSION_TECHNOLOGY,      // Engine sophistication
    HUMAN_SPACEFLIGHT,          // Crewed mission capability
    DEEP_SPACE_EXPLORATION,     // Beyond Earth orbit capability
    SATELLITE_INFRASTRUCTURE,   // Space asset portfolio
    SPACE_INFRASTRUCTURE,       // Ground infrastructure
    TECHNOLOGICAL_INDEPENDENCE  // Self-reliance in space tech
}
```

### 2.2 Scoring Algorithms (Backend Service)

```java
@Service
public class CapabilityScoreService {

    /**
     * LAUNCH_CAPABILITY (0-100)
     * - Active launch vehicles: 0-25 points
     * - Payload capacity (max): 0-25 points
     * - Launch frequency (per year): 0-25 points
     * - Success rate: 0-25 points
     */
    public Double calculateLaunchCapability(Country country) {
        double vehicleScore = Math.min(25, country.getActiveLaunchVehicles().size() * 5);
        double payloadScore = calculatePayloadScore(country.getMaxPayloadToLeo());
        double frequencyScore = calculateFrequencyScore(country.getLaunchesLastYear());
        double successScore = country.getLaunchSuccessRate() * 0.25;
        return vehicleScore + payloadScore + frequencyScore + successScore;
    }

    /**
     * PROPULSION_TECHNOLOGY (0-100)
     * - Engine count: 0-15 points
     * - Propellant diversity: 0-20 points
     * - Max specific impulse: 0-20 points
     * - Max chamber pressure: 0-15 points
     * - Advanced cycles (staged combustion, full-flow): 0-15 points
     * - Reusable engine capability: 0-15 points
     */
    public Double calculatePropulsionTechnology(Country country) {
        List<Engine> engines = country.getEngines();
        double engineCount = Math.min(15, engines.size() * 1.5);
        double propellantDiversity = calculatePropellantDiversity(engines) * 20;
        double maxIsp = calculateIspScore(getMaxIsp(engines)) * 20;
        double maxPressure = calculatePressureScore(getMaxPressure(engines)) * 15;
        double advancedCycles = countAdvancedCycles(engines) * 5;  // max 15
        double reusability = hasReusableEngine(engines) ? 15 : 0;
        return engineCount + propellantDiversity + maxIsp + maxPressure + advancedCycles + reusability;
    }

    /**
     * HUMAN_SPACEFLIGHT (0-100)
     * - Has capability: 0 or 30 points
     * - Total crewed missions: 0-20 points
     * - Active astronaut corps: 0-15 points
     * - Space station capability: 0-20 points
     * - Long-duration mission experience: 0-15 points
     */
    public Double calculateHumanSpaceflight(Country country) {
        if (!country.getHumanSpaceflightCapable()) return 0.0;
        double base = 30.0;
        double missions = Math.min(20, country.getCrewedMissionCount() * 0.5);
        double astronauts = Math.min(15, country.getActiveAstronauts() * 0.5);
        double station = country.getSpaceStationCapable() ? 20 : 0;
        double duration = calculateDurationScore(country.getLongestMissionDays()) * 15;
        return base + missions + astronauts + station + duration;
    }

    /**
     * DEEP_SPACE_EXPLORATION (0-100)
     * - Lunar missions: 0-25 points
     * - Mars missions: 0-25 points
     * - Other planetary missions: 0-20 points
     * - Sample return capability: 0-15 points
     * - Max probe distance: 0-15 points
     */
    public Double calculateDeepSpaceExploration(Country country) {
        double lunar = Math.min(25, country.getLunarMissionCount() * 5);
        double mars = Math.min(25, country.getMarsMissionCount() * 8);
        double planetary = Math.min(20, country.getPlanetaryMissionCount() * 4);
        double sampleReturn = country.hasSampleReturnCapability() ? 15 : 0;
        double distance = calculateDistanceScore(country.getMaxProbeDistanceAU()) * 15;
        return lunar + mars + planetary + sampleReturn + distance;
    }

    /**
     * SATELLITE_INFRASTRUCTURE (0-100)
     * - Active satellites count: 0-25 points
     * - Satellite type diversity: 0-20 points
     * - Indigenous GNSS system: 0-20 points
     * - Mega-constellation capability: 0-20 points
     * - Space station: 0-15 points
     */
    public Double calculateSatelliteInfrastructure(Country country) {
        double count = Math.min(25, Math.log10(country.getActiveSatellites() + 1) * 10);
        double diversity = calculateSatelliteDiversity(country) * 20;
        double gnss = country.hasIndigenousGNSS() ? 20 : 0;
        double megaConstellation = country.hasMegaConstellation() ? 20 : 0;
        double station = country.getSpaceStationCapable() ? 15 : 0;
        return count + diversity + gnss + megaConstellation + station;
    }

    /**
     * OVERALL CAPABILITY SCORE (Weighted Average)
     */
    public Double calculateOverallScore(Country country) {
        return (
            calculateLaunchCapability(country) * 0.20 +
            calculatePropulsionTechnology(country) * 0.15 +
            calculateHumanSpaceflight(country) * 0.20 +
            calculateDeepSpaceExploration(country) * 0.15 +
            calculateSatelliteInfrastructure(country) * 0.15 +
            calculateSpaceInfrastructure(country) * 0.10 +
            calculateTechnologicalIndependence(country) * 0.05
        );
    }
}
```

### 2.3 Scoring Weights Summary

| Category | Weight | Max Points | Metrics |
|----------|--------|------------|---------|
| Launch Capability | 20% | 100 | Active rockets, launch frequency, payload capacity, success rate |
| Propulsion Technology | 15% | 100 | Engine count, ISP averages, propellant diversity, advanced cycles |
| Human Spaceflight | 20% | 100 | Crewed missions, space stations, astronaut count, duration |
| Deep Space | 15% | 100 | Moon/Mars missions, probes, sample return capability |
| Satellite Infrastructure | 15% | 100 | Active satellites, satellite types, GNSS, constellations |
| Ground Infrastructure | 10% | 100 | Launch sites, tracking stations, manufacturing |
| Technological Independence | 5% | 100 | Self-reliance, indigenous technology |

### 2.4 Scoring API Endpoints

```
GET /api/scores/country/{countryId}                    - All scores for a country
GET /api/scores/country/{countryId}/category/{cat}     - Specific category score
GET /api/scores/rankings                               - Global rankings (overall)
GET /api/scores/rankings/by-category/{category}        - Rankings by category
GET /api/scores/recalculate/{countryId}                - Trigger recalculation
GET /api/scores/compare?countries=1,2,3                - Compare country scores
GET /api/scores/breakdown/{countryId}                  - Detailed score breakdown
```

### 2.5 Frontend: CapabilityScoreCard Component

```typescript
interface CapabilityScoreCardProps {
  country: Country
  scores: CategoryScore[]
  globalRank: number
  globalAverage: number
}

// Features:
// - Circular progress indicator for overall score (0-100)
// - Breakdown by category with bar charts
// - Historical trend sparkline
// - Comparison to global average
// - Radar chart for category visualization
```

---

## Milestone 3: Historical Timeline & Milestones
**Priority: P1 (High)**

### 3.1 SpaceMilestone Entity

**Backend:**
```java
@Entity
@Table(name = "space_milestones")
public class SpaceMilestone {
    private Long id;

    @ManyToOne
    private Country country;

    @ManyToOne
    private SpaceMission mission;           // Optional link

    @Enumerated(EnumType.STRING)
    private MilestoneType milestoneType;

    private LocalDate dateAchieved;
    private Integer globalRank;             // 1st, 2nd, 3rd to achieve

    private String title;                   // "First Human in Space"
    private String description;
    private String achievedBy;              // Person or spacecraft name
}
```

### 3.2 MilestoneType Enumeration

```java
public enum MilestoneType {
    // Orbital Firsts
    FIRST_SATELLITE,
    FIRST_ANIMAL_IN_SPACE,
    FIRST_HUMAN_IN_SPACE,
    FIRST_WOMAN_IN_SPACE,
    FIRST_SPACEWALK,
    FIRST_SPACE_STATION,
    FIRST_COMMERCIAL_CREW,

    // Lunar Firsts
    FIRST_LUNAR_FLYBY,
    FIRST_LUNAR_IMPACT,
    FIRST_LUNAR_ORBIT,
    FIRST_LUNAR_LANDING_ROBOTIC,
    FIRST_HUMAN_LUNAR_ORBIT,
    FIRST_HUMAN_LUNAR_LANDING,
    FIRST_LUNAR_ROVER,
    FIRST_LUNAR_SAMPLE_RETURN,
    FIRST_LUNAR_FAR_SIDE_LANDING,

    // Planetary Firsts
    FIRST_MARS_FLYBY,
    FIRST_MARS_ORBIT,
    FIRST_MARS_LANDING,
    FIRST_MARS_ROVER,
    FIRST_MARS_HELICOPTER,
    FIRST_VENUS_FLYBY,
    FIRST_VENUS_LANDING,
    FIRST_MERCURY_ORBIT,
    FIRST_JUPITER_FLYBY,
    FIRST_SATURN_ORBIT,
    FIRST_OUTER_PLANET_PROBE,

    // Technology Firsts
    FIRST_REUSABLE_ROCKET,
    FIRST_PROPULSIVE_LANDING,
    FIRST_ROCKET_CATCH,
    FIRST_COMMERCIAL_SPACE_STATION,
    FIRST_SPACE_TOURISM,

    // Other
    FIRST_ASTEROID_LANDING,
    FIRST_COMET_LANDING,
    FIRST_SAMPLE_RETURN_ASTEROID,
    FIRST_INTERSTELLAR_PROBE
}
```

### 3.3 Milestone API Endpoints

```
GET /api/milestones                                    - All milestones
GET /api/milestones/{id}                               - Milestone details
GET /api/milestones/by-country/{countryId}             - Country's milestones
GET /api/milestones/by-type/{type}                     - Milestones by type
GET /api/milestones/first-achievers                    - Only rank=1 achievements
GET /api/milestones/by-year/{year}                     - Milestones in a year
GET /api/milestones/timeline?start=1957&end=2024       - Timeline range

GET /api/countries/{id}/timeline                       - Country's achievement timeline
GET /api/countries/compare-timelines?ids=1,2,3         - Compare country timelines
GET /api/countries/{id}/firsts                         - Country's "first" achievements
```

### 3.4 Frontend: Timeline Visualization

**Library Options:** `react-chrono` or custom D3.js

**Features:**
- Horizontal scrollable timeline
- Filter by country or event type
- Events: First satellite, First human, Moon landing, Mars mission, etc.
- Milestone markers with expandable details
- "Race" view showing parallel country progress
- Cold War era: US vs USSR milestones
- Modern era: US vs China vs Private sector

---

## Milestone 4: Space Mission Tracking
**Priority: P1 (High)**

### 4.1 SpaceMission Entity

**Backend:**
```java
@Entity
@Table(name = "space_missions")
public class SpaceMission {
    private Long id;
    private String name;                    // "Apollo 11"
    private String missionDesignation;      // "AS-506"

    @ManyToOne
    private Country country;

    @ManyToOne
    private LaunchVehicle launchVehicle;

    // Timeline
    private LocalDate launchDate;
    private LocalDate endDate;
    private Integer durationDays;

    // Classification
    @Enumerated(EnumType.STRING)
    private MissionStatus status;           // PLANNED, ACTIVE, COMPLETED, FAILED

    @Enumerated(EnumType.STRING)
    private MissionType missionType;

    @Enumerated(EnumType.STRING)
    private Destination destination;

    // Crew Information
    private Boolean crewed;
    private Integer crewSize;
    private String crewNames;

    // Mission Details
    private Boolean isHistoricFirst;
    private String historicFirstType;
    private String description;
    private String outcomes;

    private String launchSite;
    private Double missionMassKg;
}

public enum MissionType {
    CREWED_ORBITAL, CREWED_LUNAR, CREWED_PLANETARY,
    CARGO_RESUPPLY, SATELLITE_DEPLOYMENT, SPACE_STATION,
    LUNAR_ORBITER, LUNAR_LANDER, LUNAR_SAMPLE_RETURN,
    MARS_ORBITER, MARS_LANDER, MARS_ROVER,
    PLANETARY_PROBE, DEEP_SPACE_PROBE, ASTEROID_MISSION,
    SAMPLE_RETURN, TECHNOLOGY_DEMO, EARTH_OBSERVATION,
    COMMUNICATIONS, NAVIGATION, SCIENTIFIC, MILITARY
}

public enum Destination {
    LEO, MEO, GEO, HEO, SSO,
    LUNAR_ORBIT, LUNAR_SURFACE, EARTH_MOON_L1, EARTH_MOON_L2,
    MARS_ORBIT, MARS_SURFACE,
    VENUS, MERCURY, JUPITER, SATURN, OUTER_PLANETS,
    ASTEROID, COMET, SUN, INTERSTELLAR
}
```

**API Endpoints:**
```
GET    /api/missions                              - List all missions
GET    /api/missions/{id}                         - Get mission details
GET    /api/missions/by-country/{countryId}       - Missions by country
GET    /api/missions/by-type/{type}               - Filter by mission type
GET    /api/missions/by-destination/{destination} - Filter by destination
GET    /api/missions/crewed                       - Crewed missions only
GET    /api/missions/historic-firsts              - Historic first achievements
GET    /api/missions/active                       - Currently active missions
GET    /api/missions/upcoming                     - Planned future missions
```

---

## Milestone 5: Interactive Visualizations
**Priority: P1 (High)**

### 5.1 World Map View

**Library Options:**
- `react-simple-maps` - SVG-based, lightweight
- `react-globe.gl` - 3D WebGL globe
- `leaflet` / `react-leaflet` - Full mapping

**Features:**
- Color-coded countries by SCI score
- Click country for quick stats popup
- Filter by capability type
- Launch site markers
- Satellite ground station markers
- Real-time ISS position overlay

### 5.2 Enhanced Charts

**New Chart Types (Chart.js / D3.js):**
- **Radar Chart**: Multi-axis capability comparison
- **Stacked Bar**: Launch frequency by country over years
- **Line Chart**: Budget trends over decades
- **Treemap**: Satellite distribution by type
- **Sankey Diagram**: Budget allocation flow
- **Bubble Chart**: Engines by thrust vs. ISP vs. country

### 5.3 Country Comparison Tool

**Features:**
- Multi-country selection (2-4 countries)
- Side-by-side capability scores
- Radar chart for category comparison
- Timeline overlay showing milestones
- Engine technology comparison
- Budget comparison over time
- Export comparison as PDF/image

---

## Milestone 6: Satellites & Infrastructure
**Priority: P2 (Medium)**

### 6.1 Satellite Entity

```java
@Entity
@Table(name = "satellites")
public class Satellite {
    private Long id;
    private String name;
    private String noradId;
    private String cosparId;

    @ManyToOne
    private Country country;
    private String operator;

    @Enumerated(EnumType.STRING)
    private SatelliteType type;

    @Enumerated(EnumType.STRING)
    private OrbitType orbitType;

    private LocalDate launchDate;
    private LocalDate decommissionDate;
    private Integer expectedLifespanYears;

    @Enumerated(EnumType.STRING)
    private SatelliteStatus status;

    private Double massKg;
    private Double powerWatts;
    private Double altitudeKm;
    private Double inclinationDeg;
    private Double periodMinutes;

    private String constellation;           // "Starlink", "GPS", "Galileo"
    private Boolean isPartOfConstellation;
}

public enum SatelliteType {
    COMMUNICATION, NAVIGATION, EARTH_OBSERVATION, WEATHER,
    SCIENTIFIC, MILITARY_RECONNAISSANCE, MILITARY_COMMUNICATION,
    TECHNOLOGY_DEMO, SPACE_STATION, CREWED_SPACECRAFT,
    CARGO_SPACECRAFT, ASTRONOMICAL
}
```

### 6.2 LaunchSite Entity

```java
@Entity
@Table(name = "launch_sites")
public class LaunchSite {
    private Long id;
    private String name;                    // "Kennedy Space Center"
    private String shortName;               // "KSC"

    @ManyToOne
    private Country country;

    private Double latitude;
    private Double longitude;
    private String region;

    @Enumerated(EnumType.STRING)
    private LaunchSiteStatus status;

    private Integer establishedYear;
    private Integer totalLaunches;
    private Boolean humanRatedCapable;
    private Integer maxPayloadCapacityKg;

    private Boolean supportsLeo;
    private Boolean supportsGeo;
    private Boolean supportsPolar;
    private Boolean supportsSso;
    private Boolean supportsInterplanetary;

    private Integer numberOfLaunchPads;
    private String operator;
}
```

---

## Milestone 7: Analytics & Statistics
**Priority: P2 (Medium)**

### 7.1 Global Statistics

```java
public class GlobalStatistics {
    private Integer totalCountriesWithSpacePrograms;
    private Integer countriesWithLaunchCapability;
    private Integer countriesWithHumanSpaceflight;

    private Integer totalActiveLaunchVehicles;
    private Integer totalEnginesInDatabase;

    private Integer totalMissionsTracked;
    private Integer crewedMissions;
    private Integer lunarMissions;
    private Integer marsMissions;

    private Integer totalActiveSatellites;
    private Map<SatelliteType, Integer> satellitesByType;

    private Integer uniqueMilestonesAchieved;
    private Map<String, Integer> firstsByCountry;

    // Records
    private LaunchVehicle mostPowerfulRocket;
    private Engine highestIspEngine;
    private Country mostLaunches;
    private Country highestSuccessRate;
}
```

### 7.2 Analytics Endpoints

```
GET /api/statistics/global                             - Global overview stats
GET /api/statistics/by-country/{countryId}             - Country-specific stats

GET /api/analytics/launches-per-year                   - Global launches by year
GET /api/analytics/launches-per-year/by-country        - Per-country breakdown
GET /api/analytics/capability-growth/{countryId}       - Capability score over time
GET /api/analytics/emerging-nations                    - Rising space powers
GET /api/analytics/technology-trends                   - Propellant, reusability trends
GET /api/analytics/records                             - Current world records
```

---

## Milestone 8: Advanced Comparison
**Priority: P2 (Medium)**

### 8.1 Comparison Service

```java
@Service
public class CountryComparisonService {

    public CountryComparisonResponse compare(List<Long> countryIds) {
        // Side-by-side comparison of all metrics
    }

    public GapAnalysisResponse analyzeGap(Long country1Id, Long country2Id) {
        // Detailed gap analysis between two countries
    }

    public StrengthsWeaknessesResponse analyzeStrengthsWeaknesses(Long countryId) {
        // Identify strongest and weakest capability areas
    }
}
```

### 8.2 Comparison Endpoints

```
GET /api/compare/countries?ids=1,2,3                   - Multi-country comparison
GET /api/compare/countries/{id1}/vs/{id2}              - Two-country comparison
GET /api/compare/gap-analysis?country1=1&country2=2    - Detailed gap analysis
GET /api/compare/strengths-weaknesses/{countryId}      - SWOT-style analysis

GET /api/rankings                                       - Overall country rankings
GET /api/rankings/by-category/{category}               - Rankings by category
GET /api/rankings/emerging                              - Fastest improving countries
```

---

## Milestone 9: User Experience
**Priority: P3 (Future)**

### 9.1 Dashboard Customization
- Drag-and-drop widget arrangement
- Favorite countries/agencies
- Custom comparison presets
- Dark/light theme toggle

### 9.2 Search & Discovery
- Global search (countries, engines, missions, astronauts)
- Advanced filters
- Saved searches
- "Did you know?" facts

### 9.3 Data Export & Sharing
- Export comparisons as PNG/PDF
- CSV data downloads
- Shareable comparison URLs
- Embed widgets for external sites

### 9.4 Accessibility
- ARIA accessibility compliance
- Keyboard navigation
- Screen reader support
- Reduced motion option

---

## Technical Infrastructure

### Frontend Architecture

**New Dependencies:**
```json
{
  "react-simple-maps": "^3.0.0",
  "react-chrono": "^2.6.0",
  "d3": "^7.8.0",
  "react-query": "^5.0.0",
  "zustand": "^4.4.0",
  "date-fns": "^3.0.0",
  "react-countup": "^6.5.0",
  "framer-motion": "^11.0.0"
}
```

**Folder Structure:**
```
src/
├── components/
│   ├── common/           # Shared UI components
│   ├── charts/           # All chart components
│   ├── maps/             # Map components
│   ├── timelines/        # Timeline components
│   ├── cards/            # Various card types
│   └── widgets/          # Dashboard widgets
├── pages/
│   ├── dashboard/
│   ├── countries/
│   ├── engines/
│   ├── launches/
│   ├── missions/
│   └── compare/
├── features/
│   ├── capability-score/
│   ├── space-race/
│   └── analytics/
├── services/api/
├── stores/               # Zustand stores
├── hooks/
├── types/
└── utils/
```

### Backend Infrastructure

**Database Migrations (Flyway):**
```
src/main/resources/db/migration/
├── V1__initial_schema.sql
├── V2__add_countries_table.sql
├── V3__add_launch_vehicles_table.sql
├── V4__add_missions_table.sql
├── V5__add_satellites_table.sql
├── V6__add_milestones_table.sql
├── V7__add_capability_scores_table.sql
├── V8__enhance_engines_table.sql
└── V9__seed_initial_data.sql
```

**Caching Strategy:**
- Country rankings (hourly refresh)
- Capability scores (on-demand recalculation)
- Static data (daily refresh)

---

## Implementation Priority Matrix

| Priority | Milestone | Feature | Effort | Impact | Dependencies |
|----------|-----------|---------|--------|--------|--------------|
| P0 | 1.1 | Country Entity | Medium | Critical | None |
| P0 | 1.2 | LaunchVehicle Entity | Medium | Critical | Country |
| P0 | 1.3 | Engine Enhancement | Low | Critical | Country |
| P0 | 2 | Capability Scoring System | High | Critical | Country, Engine |
| P1 | 3 | Milestones & Timeline | Medium | High | Country |
| P1 | 4 | Mission Tracking | Medium | High | Country, LaunchVehicle |
| P1 | 5 | Interactive Visualizations | High | High | Scoring, Countries |
| P2 | 6 | Satellites & Infrastructure | Medium | Medium | Country |
| P2 | 7 | Analytics & Statistics | Medium | Medium | All Entities |
| P2 | 8 | Advanced Comparison | Medium | Medium | Scoring |
| P3 | 9 | UX Enhancements | High | Low | All |

---

## Success Metrics

### Quantitative
| Metric | Target |
|--------|--------|
| Countries tracked | 25+ |
| Engines with country data | 50+ |
| Historical milestones | 100+ |
| Page load time | < 2 seconds |
| Mobile usability score | 90+ |
| Accessibility score | AA compliance |

### Qualitative
The platform should answer:
1. "Which country has the most advanced space program?"
2. "How does China compare to the USA in space capabilities?"
3. "What are India's strengths and weaknesses in space?"
4. "Who achieved the first lunar landing?"
5. "How has Russia's space capability changed over time?"
6. "Which countries have human spaceflight capability?"
7. "What is the most powerful rocket currently in operation?"
8. "Which countries are emerging space powers?"

---

## Next Steps

1. **Review this unified plan** and confirm priorities
2. **Start Milestone 1.1**: Create Country entity (backend + frontend types)
3. **Migrate Engine**: Link to Country instead of origin string
4. **Implement Milestone 2**: Capability scoring algorithms
5. **Seed initial data**: Countries, engines linkage, milestones
6. **Build comparison UI**: Enable country comparisons
7. **Add visualizations**: World map, timeline, radar charts

---

*Document Version: 1.0*
*Created: December 2025*
*Project: Rocket Engine Comparison → Space Capabilities Dashboard*
