# Rocket Engine Frontend Architecture

A modern React 19 application for exploring and comparing rocket engines, launch vehicles, space missions, and national space programs.

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19.2 + TypeScript 5.3 (strict mode) |
| Routing | React Router 7.9 |
| Styling | Tailwind CSS 3.4 + Material-UI 7.3 + Emotion |
| HTTP | Axios 1.12 (30s timeout, 3 retries) |
| Charts | Chart.js 4.5 + react-chartjs-2 |
| Maps | react-simple-maps 3.0 |
| Build | Create React App + GitHub Pages |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         App.js (Router)                         │
├─────────────────────────────────────────────────────────────────┤
│  ThemeProvider → ToastProvider → DataProvider → Navigation      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐ │
│  │    Pages    │───▶│   Hooks     │───▶│     Services        │ │
│  │ (Container) │    │ (Data/Logic)│    │ (API + Transform)   │ │
│  └─────────────┘    └─────────────┘    └─────────────────────┘ │
│         │                                        │              │
│         ▼                                        ▼              │
│  ┌─────────────┐                      ┌─────────────────────┐  │
│  │ Components  │                      │   Backend API       │  │
│  │ (Presentat.)│                      │ (Spring Boot)       │  │
│  └─────────────┘                      └─────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
src/
├── components/          # Reusable UI components (24 files)
│   ├── Navigation.jsx        # Main navigation with search
│   ├── EngineCard.jsx        # Engine display card
│   ├── CountryCard.jsx       # Country display card
│   ├── MissionCard.jsx       # Mission display card
│   ├── LaunchVehicleCard.jsx # Vehicle display card
│   ├── Pagination.jsx        # Pagination controls
│   ├── GlobalSearch.jsx      # Cross-domain search
│   ├── ExportButton.jsx      # CSV export
│   ├── ShareButton.jsx       # URL sharing
│   ├── ThemeToggle.jsx       # Dark/light mode
│   ├── Footer.jsx            # App footer
│   ├── SkipLinks.jsx         # Accessibility skip links
│   ├── ErrorBoundary.tsx     # Error boundary
│   ├── charts/               # Chart components
│   │   ├── CapabilityRadarChart.jsx
│   │   ├── EngineBubbleChart.jsx
│   │   ├── LaunchFrequencyChart.jsx
│   │   └── BudgetTrendChart.jsx
│   ├── comparison/           # Comparison tables
│   ├── icons/                # Custom icons
│   └── maps/                 # Geographic visualizations
│
├── pages/               # Container components (20 files)
│   ├── EngineListPage.jsx        # Engines with filters/sorting
│   ├── EngineDetailPage.jsx      # Engine details
│   ├── CountryListPage.jsx       # Countries dashboard
│   ├── CountryDetailPage.jsx     # Country with stats
│   ├── CountryTimelinePage.jsx   # Historical milestones
│   ├── CountryComparisonPage.jsx # Multi-country comparison
│   ├── ComparisonPage.jsx        # Engine/vehicle comparison
│   ├── LaunchVehicleListPage.jsx
│   ├── LaunchVehicleDetailPage.jsx
│   ├── MissionListPage.jsx
│   ├── MissionDetailPage.jsx
│   ├── SatelliteListPage.jsx
│   ├── SatelliteDetailPage.jsx
│   ├── LaunchSiteListPage.jsx
│   ├── LaunchSiteDetailPage.jsx
│   ├── RankingsPage.jsx          # Space Capability Index
│   ├── AnalyticsPage.jsx         # Analytics dashboard
│   └── AdminPage.jsx             # Admin panel
│
├── services/            # API layer (12 TypeScript files)
│   ├── engineService.ts
│   ├── countryService.ts
│   ├── launchVehicleService.ts
│   ├── missionService.ts
│   ├── satelliteService.ts
│   ├── launchSiteService.ts
│   ├── milestoneService.ts
│   ├── capabilityScoreService.ts
│   ├── comparisonService.ts
│   ├── statisticsService.ts
│   └── visualizationService.ts
│
├── hooks/               # Custom hooks (17 files)
│   ├── useEngines.js         # Engine data fetching
│   ├── useCountries.js       # Country data
│   ├── useLaunchVehicles.js  # Vehicle data
│   ├── useMissions.js        # Mission data
│   ├── useSatellites.js      # Satellite data
│   ├── useLaunchSites.js     # Launch site data
│   ├── useMilestones.js      # Milestone data
│   ├── useComparison.js      # Comparison logic
│   ├── useCapabilityScores.js
│   ├── useStatistics.js
│   ├── useAnalytics.js
│   ├── useExport.js          # CSV export
│   ├── useFavorites.js       # User favorites
│   ├── useGlobalSearch.js    # Search
│   ├── useShareableUrl.js    # URL sharing
│   ├── useAccessibility.js   # A11y features
│   └── useVisualization.js   # Chart helpers
│
├── contexts/            # React Context (older folder)
│   └── ThemeContext.jsx      # Light/Dark/System theme
│
├── context/             # React Context (newer)
│   ├── DataContext.jsx       # Centralized data + 5-min cache
│   └── ToastContext.jsx      # Toast notifications
│
├── types/               # TypeScript definitions
│   └── index.ts              # ~890 lines of types
│
├── constants/           # Global constants
│   └── index.ts              # Config, labels, routes
│
├── App.js               # Root with routing
├── App.css              # Global styles
├── index.js             # Entry point
└── index.css            # Base styles
```

---

## State Management

**Three-tier approach using React Context API:**

### 1. Global Context
| Context | Purpose |
|---------|---------|
| `ThemeContext` | Theme (light/dark/system) with localStorage |
| `DataContext` | Centralized API cache with 5-minute TTL |
| `ToastContext` | Notifications with RFC 7807 error parsing |

### 2. Custom Hooks
```
useEngines() → engineService.getAll() → Axios → API
      ↓
DataContext cache fallback (if available)
```

### 3. Local State
- UI concerns: filters, sorting, pagination, form state

---

## Service Layer

Each service encapsulates API communication:

```typescript
class EngineService {
  private api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
    timeout: 30000
  });

  getAll(): Promise<Engine[]>
  getById(id: number): Promise<Engine>
  getByCountry(code: string): Promise<Engine[]>
  compareEngines(id1: number, id2: number): Promise<EngineComparison>
}
```

**Available Services:**
- `engineService` - Rocket engines
- `countryService` - Countries + capability scores
- `launchVehicleService` - Launch vehicles
- `missionService` - Space missions
- `satelliteService` - Satellites
- `launchSiteService` - Launch facilities
- `milestoneService` - Historical achievements
- `capabilityScoreService` - SCI calculations
- `comparisonService` - Generic comparison
- `statisticsService` - Aggregated stats
- `visualizationService` - Chart data

---

## Routing

**React Router v7** with 20+ routes:

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | CountryListPage | Dashboard |
| `/engines` | EngineListPage | Engine list |
| `/engines/:id` | EngineDetailPage | Engine details |
| `/vehicles` | LaunchVehicleListPage | Vehicles |
| `/vehicles/:id` | LaunchVehicleDetailPage | Vehicle details |
| `/missions` | MissionListPage | Missions |
| `/missions/:id` | MissionDetailPage | Mission details |
| `/satellites` | SatelliteListPage | Satellites |
| `/satellites/:id` | SatelliteDetailPage | Satellite details |
| `/launch-sites` | LaunchSiteListPage | Launch sites |
| `/launch-sites/:id` | LaunchSiteDetailPage | Site details |
| `/countries/:code` | CountryDetailPage | Country detail |
| `/countries/:code/timeline` | CountryTimelinePage | Milestones |
| `/compare` | ComparisonPage | Engine comparison |
| `/compare/vehicles` | ComparisonPage | Vehicle comparison |
| `/compare/countries` | CountryComparisonPage | Country comparison |
| `/rankings` | RankingsPage | SCI rankings |
| `/analytics` | AnalyticsPage | Analytics |
| `/admin` | AdminPage | Data management |

---

## Type System

**Strict TypeScript** with comprehensive definitions (~890 lines):

```typescript
// Core entities
Country, Engine, LaunchVehicle, SpaceMission, Satellite, LaunchSite

// Feature types
CapabilityScores, SCIBreakdown, CountryComparison, EngineComparison

// Utility types
AsyncState<T>, ListAsyncState<T>, ProblemDetail, ToastMessage
```

**Path aliases:**
```typescript
@components/* → src/components/*
@pages/*      → src/pages/*
@services/*   → src/services/*
@hooks/*      → src/hooks/*
@types/*      → src/types/*
```

---

## Styling

| Tool | Usage |
|------|-------|
| Tailwind CSS | Layout, spacing, responsive |
| Material-UI | Icons, pre-built components |
| Emotion | Dynamic/theme-aware styles |

**Dark mode** (default):
```jsx
<div className="bg-gray-900 dark:bg-gray-800 text-white p-4 rounded-lg">
```

**Responsive** - Mobile-first with `sm:`, `md:`, `lg:`, `xl:` breakpoints

---

## Error Handling

- **RFC 7807 ProblemDetail** format from backend
- **Axios interceptors** parse and format errors
- **ToastContext** displays with copy-to-clipboard
- **ErrorBoundary** catches component errors

---

## Performance

| Technique | Benefit |
|-----------|---------|
| DataContext cache (5-min TTL) | Reduces API calls |
| `useMemo` for filtered lists | Prevents re-computation |
| Pagination | Limits DOM nodes |
| Code splitting (CRA) | Smaller initial bundle |

---

## Key Features

| Feature | Description |
|---------|-------------|
| Global Search | Cross-domain unified search |
| Comparison | Multi-entity side-by-side analysis |
| Rankings | Space Capability Index (7 categories) |
| Analytics | Charts, trends, statistics dashboard |
| Data Export | CSV export functionality |
| Admin Panel | Data management interface |
| Accessibility | WCAG compliance, skip links, ARIA |

---

## Environment

```bash
# Development
REACT_APP_API_URL=http://localhost:8080/api

# Production (GitHub Pages)
# Basename: /rocket-engine-frontend
```

---

## Deployment

```bash
npm run build    # Production build
npm run deploy   # Push to gh-pages branch
# Deployed to: https://Viktor2588.github.io/rocket-engine-frontend
```

---

## Key Patterns

### Data Fetching
```jsx
const { engines, loading, error } = useEngines();
if (loading) return <Spinner />;
if (error) return <Error message={error} />;
return <EngineList data={engines} />;
```

### Component Composition
```
Page (state orchestration)
├── Filter/Sort controls
├── Pagination
└── Card components (grid)
    └── Links to detail pages
```

### Naming Conventions
- Components: `PascalCase.jsx`
- Hooks: `useCamelCase.js`
- Services: `camelCaseService.ts`
- Types: `PascalCase`

---

## Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| Context API over Redux | Simpler for app scale |
| Tailwind + MUI | Flexibility + pre-built components |
| TypeScript strict mode | Catches errors early |
| Service classes | Encapsulation + testability |
| Custom hooks | Logic reuse without HOCs |
| RFC 7807 errors | Standard format for backend interop |
| Dark mode default | Modern UX preference |
