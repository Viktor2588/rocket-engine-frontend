import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import EngineListPage from './pages/EngineListPage';
import EngineDetailPage from './pages/EngineDetailPage';
import ComparisonPage from './pages/ComparisonPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<EngineListPage />} />
          <Route path="/engines/:id" element={<EngineDetailPage />} />
          <Route path="/compare" element={<ComparisonPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
