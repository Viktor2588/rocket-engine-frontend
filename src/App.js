import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider } from './context/DataContext';
import { ToastProvider } from './context/ToastContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import SkipLinks from './components/SkipLinks';
import EngineListPage from './pages/EngineListPage';
import EngineDetailPage from './pages/EngineDetailPage';
import ComparisonPage from './pages/ComparisonPage';
import CountryListPage from './pages/CountryListPage';
import CountryDetailPage from './pages/CountryDetailPage';
import CountryTimelinePage from './pages/CountryTimelinePage';
import CountryComparisonPage from './pages/CountryComparisonPage';
import LaunchVehicleListPage from './pages/LaunchVehicleListPage';
import LaunchVehicleDetailPage from './pages/LaunchVehicleDetailPage';
import MissionListPage from './pages/MissionListPage';
import MissionDetailPage from './pages/MissionDetailPage';
import SatelliteListPage from './pages/SatelliteListPage';
import SatelliteDetailPage from './pages/SatelliteDetailPage';
import LaunchSiteListPage from './pages/LaunchSiteListPage';
import LaunchSiteDetailPage from './pages/LaunchSiteDetailPage';
import RankingsPage from './pages/RankingsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AdminPage from './pages/AdminPage';
import './App.css';

function App() {
  // Use basename only in production (GitHub Pages)
  const basename = process.env.NODE_ENV === 'production' ? '/rocket-engine-frontend' : '';

  return (
    <ThemeProvider>
      <ToastProvider>
        <DataProvider>
          <Router basename={basename}>
            <div className="App min-h-screen flex flex-col">
          <SkipLinks />
          <Navigation />
          <main id="main-content" tabIndex="-1" className="focus:outline-none flex-1">
        <Routes>
          {/* Main Dashboard - Countries Overview */}
          <Route path="/" element={<CountryListPage />} />

          {/* Country Routes */}
          <Route path="/countries" element={<CountryListPage />} />
          <Route path="/countries/:code" element={<CountryDetailPage />} />
          <Route path="/countries/:code/timeline" element={<CountryTimelinePage />} />

          {/* Engine Routes */}
          <Route path="/engines" element={<EngineListPage />} />
          <Route path="/engines/:id" element={<EngineDetailPage />} />

          {/* Launch Vehicle Routes */}
          <Route path="/vehicles" element={<LaunchVehicleListPage />} />
          <Route path="/vehicles/:id" element={<LaunchVehicleDetailPage />} />

          {/* Mission Routes */}
          <Route path="/missions" element={<MissionListPage />} />
          <Route path="/missions/:id" element={<MissionDetailPage />} />

          {/* Satellite Routes */}
          <Route path="/satellites" element={<SatelliteListPage />} />
          <Route path="/satellites/:id" element={<SatelliteDetailPage />} />

          {/* Launch Site Routes */}
          <Route path="/launch-sites" element={<LaunchSiteListPage />} />
          <Route path="/launch-sites/:id" element={<LaunchSiteDetailPage />} />

          {/* Comparison Routes */}
          <Route path="/compare" element={<ComparisonPage />} />
          <Route path="/compare/engines" element={<ComparisonPage />} />
          <Route path="/compare/vehicles" element={<ComparisonPage />} />
          <Route path="/compare/countries" element={<CountryComparisonPage />} />

          {/* Rankings Route */}
          <Route path="/rankings" element={<RankingsPage />} />

          {/* Analytics Route */}
          <Route path="/analytics" element={<AnalyticsPage />} />

          {/* Admin Route */}
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
          </main>
            <Footer />
            </div>
          </Router>
        </DataProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
