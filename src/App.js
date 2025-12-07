import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import EngineListPage from './pages/EngineListPage';
import EngineDetailPage from './pages/EngineDetailPage';
import ComparisonPage from './pages/ComparisonPage';
import CountryListPage from './pages/CountryListPage';
import CountryDetailPage from './pages/CountryDetailPage';
import './App.css';

function App() {
  // Use basename only in production (GitHub Pages)
  const basename = process.env.NODE_ENV === 'production' ? '/rocket-engine-frontend' : '';

  return (
    <Router basename={basename}>
      <div className="App">
        <Navigation />
        <Routes>
          {/* Main Dashboard - Countries Overview */}
          <Route path="/" element={<CountryListPage />} />

          {/* Country Routes */}
          <Route path="/countries" element={<CountryListPage />} />
          <Route path="/countries/:code" element={<CountryDetailPage />} />

          {/* Engine Routes */}
          <Route path="/engines" element={<EngineListPage />} />
          <Route path="/engines/:id" element={<EngineDetailPage />} />

          {/* Comparison Routes */}
          <Route path="/compare" element={<ComparisonPage />} />
          <Route path="/compare/engines" element={<ComparisonPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
