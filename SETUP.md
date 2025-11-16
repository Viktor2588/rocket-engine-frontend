# 🚀 Rocket Engine Frontend — Setup & Getting Started

Complete setup guide for the Rocket Engine Comparison React Application.

---

## 📋 Project Overview

This is a React frontend for the **Rocket Engine Comparison Application**. It provides:

- ✅ List and browse all rocket engines
- ✅ View detailed specifications for each engine
- ✅ Compare two engines side-by-side
- ✅ Visualize data with charts and tables
- ✅ Responsive design with Tailwind CSS

---

## 🛠️ Technology Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI framework | 18.2.0 |
| **React Router** | Client-side routing | 6.18.0 |
| **Axios** | HTTP client | Latest |
| **Chart.js** | Data visualization | 4.4.0 |
| **Tailwind CSS** | Utility-first CSS framework | 3.3.0 |
| **Vite** | Build tool | (via create-react-app) |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ and **npm** or **yarn**
- **Backend API** running on `http://localhost:8080`

### Installation Steps

1. **Navigate to the project directory:**
   ```bash
   cd rocket-engine-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```
   Update `.env` if your backend is on a different URL.

4. **Start the development server:**
   ```bash
   npm start
   ```

5. **Open in browser:**
   ```
   http://localhost:3000
   ```

---

## 📁 Project Structure

```
rocket-engine-frontend/
├── public/
│   ├── index.html          # HTML template
│   └── favicon.ico
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Navigation.jsx      # Header navigation
│   │   ├── EngineCard.jsx      # Engine card component
│   │   ├── EngineChart.jsx     # Chart visualization
│   │   └── ComparisonTable.jsx # Comparison table
│   ├── pages/              # Page-level components
│   │   ├── EngineListPage.jsx        # Engine listing page
│   │   ├── EngineDetailPage.jsx      # Engine details page
│   │   └── ComparisonPage.jsx        # Engine comparison page
│   ├── services/           # API services
│   │   └── engineService.js    # Engine API calls
│   ├── hooks/              # Custom React hooks
│   │   └── useEngines.js       # Engine data hooks
│   ├── App.js              # Root component with routing
│   ├── App.css             # App styles
│   ├── index.js            # React entry point
│   └── index.css           # Global styles
├── ARCHITECTURE.md         # Architecture documentation
├── SETUP.md               # This file
├── .env.example           # Environment variables template
├── package.json           # Project dependencies
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
└── README.md              # Default create-react-app README
```

---

## 🔧 Available Scripts

### Development

```bash
# Start development server (port 3000)
npm start

# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

### Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

### Maintenance

```bash
# Eject create-react-app (⚠️ irreversible)
npm run eject
```

---

## 🌐 API Integration

### Backend Connection

The frontend expects the backend API at:
```
http://localhost:8080/api
```

**Configure via environment variable:**
```bash
# .env file
REACT_APP_API_URL=http://localhost:8080/api
```

### Available API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/engines` | GET | Fetch all engines |
| `/engines/{id}` | GET | Fetch engine by ID |
| `/engines` | POST | Create new engine |
| `/engines/{id}` | PUT | Update engine |
| `/engines/{id}` | DELETE | Delete engine |
| `/compare?engine1=X&engine2=Y` | GET | Compare two engines |

### Service Layer

All API calls are centralized in `src/services/engineService.js`:

```javascript
import engineService from '../services/engineService';

// Fetch all engines
const engines = await engineService.getAll();

// Get single engine
const engine = await engineService.getById(1);

// Compare engines
const comparison = await engineService.compare(1, 2);
```

---

## 🎨 Components & Pages

### Pages

#### 1. **EngineListPage** (`/`)
- Displays all rocket engines in a grid or chart view
- Sorting options (name, thrust, ISP)
- Toggle between grid and chart visualization
- Filter and search capabilities

#### 2. **EngineDetailPage** (`/engines/:id`)
- Detailed specifications for a single engine
- Key metrics display (thrust, ISP, mass, propellant)
- Links to comparison page
- Back navigation

#### 3. **ComparisonPage** (`/compare`)
- Select two engines for comparison
- Side-by-side comparison table
- Visual charts (thrust and ISP)
- Comparison summary with key differences

### Components

#### **Navigation** (`Navigation.jsx`)
- Top navigation bar
- Links to main pages
- Logo and branding

#### **EngineCard** (`EngineCard.jsx`)
- Displays engine info in card format
- Quick stats (thrust, ISP)
- Click to view details
- Used in engine list

#### **EngineChart** (`EngineChart.jsx`)
- Bar chart visualization
- Thrust or ISP comparison
- Multiple engines support
- Responsive design

#### **ComparisonTable** (`ComparisonTable.jsx`)
- Side-by-side engine specifications
- Formatted numerical values
- Clean, scannable layout

---

## 🪝 Custom Hooks

### useEngines()
Fetches all engines on component mount:

```javascript
const { engines, loading, error } = useEngines();
```

**Returns:**
- `engines` — Array of engine objects
- `loading` — Loading state
- `error` — Error message (if any)

### useEngine(id)
Fetches a single engine by ID:

```javascript
const { engine, loading, error } = useEngine(engineId);
```

**Returns:**
- `engine` — Single engine object
- `loading` — Loading state
- `error` — Error message (if any)

---

## 🎯 Routing

Routes are configured in `App.js` using React Router v6:

```
/                    → EngineListPage (list all engines)
/engines/:id         → EngineDetailPage (engine details)
/compare             → ComparisonPage (compare engines)
```

---

## 🎨 Styling

### Tailwind CSS

- **Configuration:** `tailwind.config.js`
- **Global styles:** `src/index.css` (includes Tailwind directives)
- **Component styles:** Inline Tailwind classes
- **No CSS files needed** — All styling via Tailwind utilities

### Color Scheme

- **Primary:** Blue (#3B82F6)
- **Success:** Green (#22C55E)
- **Warning:** Orange (#F97316)
- **Error:** Red (#EF4444)
- **Neutral:** Gray (various shades)

---

## 🚀 Building for Production

### Build Process

```bash
npm run build
```

**Outputs to:**
```
rocket-engine-frontend/build/
```

**Optimization includes:**
- Code minification
- Bundle splitting
- CSS optimization
- Asset optimization

### Deployment

#### Docker

```dockerfile
# Build stage
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:latest
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Static Hosting

Deploy the `build/` folder to:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting service

---

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Test Coverage

```bash
npm test -- --coverage
```

### Writing Tests

Tests should be placed next to components:
```
src/components/EngineCard.jsx
src/components/EngineCard.test.js
```

---

## 🐛 Troubleshooting

### Issue: "Cannot reach backend API"

**Solution:**
1. Ensure backend is running on `http://localhost:8080`
2. Check CORS configuration on backend
3. Verify `.env` has correct `REACT_APP_API_URL`
4. Check browser DevTools → Network tab for failed requests

### Issue: "Modules not found"

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Tailwind classes not working"

**Solution:**
1. Ensure `tailwind.config.js` content paths include all `.jsx` files
2. Check that `@tailwind` directives are in `index.css`
3. Restart development server after config changes

### Issue: "Port 3000 already in use"

**Solution:**
```bash
# Use different port
PORT=3001 npm start
```

---

## 🔍 Environment Variables

Create a `.env` file in the root directory:

```bash
# API Configuration
REACT_APP_API_URL=http://localhost:8080/api

# React environment
REACT_APP_ENV=development
```

**Important:** Variables must start with `REACT_APP_` to be accessible in React.

---

## 📚 Useful Resources

- **React Docs:** https://react.dev
- **React Router:** https://reactrouter.com
- **Tailwind CSS:** https://tailwindcss.com
- **Axios:** https://axios-http.com
- **Chart.js:** https://www.chartjs.org

---

## 🎓 Next Steps

1. **Backend Integration**
   - Ensure Spring Boot backend is running
   - Verify all API endpoints are working
   - Test CORS configuration

2. **Additional Features**
   - Add authentication (login/logout)
   - Implement filtering and search
   - Add export functionality (CSV, JSON)
   - Create admin panel for adding engines

3. **Optimization**
   - Implement code splitting with lazy loading
   - Add service worker for offline support
   - Optimize images and assets
   - Monitor performance with Lighthouse

4. **Deployment**
   - Set up CI/CD pipeline
   - Configure environment-specific builds
   - Deploy to production hosting
   - Monitor and maintain

---

## 📝 Notes

- **CORS:** Ensure backend allows requests from `http://localhost:3000`
- **Local Storage:** Session data is not persisted (no authentication yet)
- **Real-time:** No WebSocket integration (use polling if needed)
- **SSR:** Server-side rendering not implemented (client-side only)

---

## 🤝 Contributing

When adding new features:

1. Follow the existing component structure
2. Use Tailwind CSS for styling (no CSS files)
3. Centralize API calls in `services/`
4. Use custom hooks for reusable logic
5. Add error handling and loading states
6. Keep components focused and reusable

---

## 📄 License

This project is part of the Rocket Engine Comparison Application.

---

**Last Updated:** 2025-10-27
