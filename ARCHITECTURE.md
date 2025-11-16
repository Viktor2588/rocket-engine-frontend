# 🚀 Rocket Engine Frontend — Architecture

High-level architecture documentation for the React frontend of the Rocket Engine Comparison Application.

---

## 📐 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── EngineCard.jsx
│   ├── ComparisonTable.jsx
│   ├── EngineChart.jsx
│   └── Navigation.jsx
├── pages/               # Page-level components
│   ├── EngineListPage.jsx
│   ├── EngineDetailPage.jsx
│   └── ComparisonPage.jsx
├── services/            # API communication
│   └── engineService.js
├── hooks/               # Custom React hooks
│   └── useEngines.js
├── App.js              # Root app component with routing
├── index.js            # Entry point
└── index.css           # Global styles
```

---

## 🏗️ Architecture Layers

### 1. **Presentation Layer** (`components/`)
- Reusable UI components with single responsibility
- Handles rendering and user interactions
- Props-based communication
- Examples: `EngineCard`, `ComparisonTable`, `EngineChart`

### 2. **Page Layer** (`pages/`)
- Container components for full page views
- Connects components and manages page-level state
- Handles routing and navigation
- Examples: `EngineListPage`, `EngineDetailPage`, `ComparisonPage`

### 3. **Service Layer** (`services/`)
- Encapsulates API communication logic
- Single source of truth for backend calls
- Methods for CRUD operations
- Example: `engineService.js` with methods like:
  - `getAll()` — fetch all engines
  - `getById(id)` — fetch single engine
  - `compare(engine1Id, engine2Id)` — fetch comparison

### 4. **State & Hooks** (`hooks/`)
- Custom hooks for reusable state logic
- Example: `useEngines()` hook for fetching and caching engine data

---

## 🔄 Data Flow

```
User Action (UI)
    ↓
Page Component (state management)
    ↓
Service Layer (API call to backend @ http://localhost:8080)
    ↓
Backend API response (JSON)
    ↓
Update state
    ↓
Render components
```

---

## 🛣️ Routing

**React Router v6** manages navigation:

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `EngineListPage` | Display all engines |
| `/engines/:id` | `EngineDetailPage` | Show engine details |
| `/compare` | `ComparisonPage` | Compare engines |

---

## 🌐 API Integration

- **Base URL**: `http://localhost:8080/api`
- **Format**: JSON
- **Client Library**: Axios (or Fetch API)
- **Service Layer**: Centralized in `services/engineService.js`

### Key Endpoints

```
GET    /api/engines              → Fetch all engines
GET    /api/engines/{id}         → Fetch engine by ID
POST   /api/engines              → Add new engine
GET    /api/compare?e1=X&e2=Y   → Compare two engines
```

---

## 🎨 Styling

- **CSS Framework**: (To be added - Tailwind CSS or CSS Modules)
- **Global Styles**: `index.css`
- **Component Styles**: Co-located or separate CSS files
- **Responsive**: Mobile-first approach

---

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| `react` | UI library |
| `react-dom` | React rendering |
| `react-router-dom` | Client-side routing |
| `axios` | HTTP client |
| `chart.js` + `react-chartjs-2` | Data visualization |

---

## ⚡ Performance Considerations

- **Code Splitting**: Route-based lazy loading (to be implemented)
- **Caching**: Service layer caches API responses
- **Memoization**: React.memo for expensive components
- **State Management**: Local state + custom hooks (no Redux for now)

---

## 🔐 Security

- **CORS**: Backend configured to accept frontend requests
- **API Keys**: (Optional - add if backend requires authentication)
- **Input Validation**: Form validation before API calls
- **JWT**: (Future - add if authentication required)

---

## 🚀 Deployment

- **Build**: `npm run build` → Creates optimized static files
- **Serve**: Nginx or similar web server
- **Environment Variables**: `.env` file for API base URL
- **Docker**: (Optional - containerize with Docker)

---

## 📝 Next Steps

1. Install additional dependencies
2. Implement components and pages
3. Create API service layer
4. Add routing configuration
5. Integrate with backend
6. Add styling (Tailwind CSS)
7. Implement charts and comparisons
8. Add error handling and loading states

---
