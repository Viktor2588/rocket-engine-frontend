import { useState, useEffect, useCallback } from 'react';
import {
  Refresh,
  CheckCircle,
  Error,
  Warning,
  Storage,
  CloudSync,
  Speed,
  Settings,
} from '@mui/icons-material';
import { useToast } from '../context/ToastContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export default function AdminPage() {
  const [healthStatus, setHealthStatus] = useState(null);
  const [entityCounts, setEntityCounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);
  const { showSuccess, showError } = useToast();

  const fetchStatus = useCallback(async () => {
    try {
      // Fetch health status
      const healthResponse = await fetch(`${API_URL.replace('/api', '')}/actuator/health`);
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        setHealthStatus(healthData);
      } else {
        setHealthStatus({ status: 'DOWN', error: 'Health endpoint not available' });
      }
    } catch (error) {
      setHealthStatus({ status: 'DOWN', error: error.message });
    }

    try {
      // Fetch entity counts from statistics
      const statsPromises = [
        fetch(`${API_URL}/countries?size=1`).then(r => r.json()),
        fetch(`${API_URL}/engines?size=1`).then(r => r.json()),
        fetch(`${API_URL}/launch-vehicles?size=1`).then(r => r.json()),
        fetch(`${API_URL}/missions?size=1`).then(r => r.json()),
        fetch(`${API_URL}/satellites?size=1`).then(r => r.json()),
        fetch(`${API_URL}/launch-sites?size=1`).then(r => r.json()),
        fetch(`${API_URL}/milestones?size=1`).then(r => r.json()),
      ];

      const results = await Promise.allSettled(statsPromises);

      setEntityCounts({
        countries: results[0].status === 'fulfilled' ? (results[0].value.totalElements || results[0].value.length || 0) : 'N/A',
        engines: results[1].status === 'fulfilled' ? (results[1].value.totalElements || results[1].value.length || 0) : 'N/A',
        vehicles: results[2].status === 'fulfilled' ? (results[2].value.totalElements || results[2].value.length || 0) : 'N/A',
        missions: results[3].status === 'fulfilled' ? (results[3].value.totalElements || results[3].value.length || 0) : 'N/A',
        satellites: results[4].status === 'fulfilled' ? (results[4].value.totalElements || results[4].value.length || 0) : 'N/A',
        launchSites: results[5].status === 'fulfilled' ? (results[5].value.totalElements || results[5].value.length || 0) : 'N/A',
        milestones: results[6].status === 'fulfilled' ? (results[6].value.totalElements || results[6].value.length || 0) : 'N/A',
      });
    } catch (error) {
      console.error('Error fetching entity counts:', error);
    }

    setLastRefresh(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStatus();
    setRefreshing(false);
    showSuccess('Status refreshed');
  };

  const handleClearCache = () => {
    // Clear localStorage cache
    const cacheKeys = Object.keys(localStorage).filter(key =>
      key.startsWith('cache_') || key.startsWith('rocket_')
    );
    cacheKeys.forEach(key => localStorage.removeItem(key));

    // Clear sessionStorage
    sessionStorage.clear();

    showSuccess(`Cleared ${cacheKeys.length} cached items`);
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case 'UP':
        return <CheckCircle className="text-green-500" />;
      case 'DOWN':
        return <Error className="text-red-500" />;
      default:
        return <Warning className="text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'UP':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'DOWN':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading system status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Settings className="text-gray-700 dark:text-gray-300" /> System Status
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Monitor API health and data synchronization status
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleClearCache}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center gap-2"
            >
              <Storage style={{ fontSize: '1.25rem' }} />
              Clear Cache
            </button>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 disabled:opacity-50"
            >
              <Refresh className={refreshing ? 'animate-spin' : ''} style={{ fontSize: '1.25rem' }} />
              Refresh
            </button>
          </div>
        </div>

        {/* API Health Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Speed className="text-indigo-500" /> API Health
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border dark:border-gray-700 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Overall Status</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(healthStatus?.status)}`}>
                  {healthStatus?.status || 'UNKNOWN'}
                </span>
              </div>
            </div>

            <div className="p-4 border dark:border-gray-700 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">API Endpoint</span>
                <span className="text-sm font-mono text-gray-800 dark:text-gray-200 truncate max-w-[200px]">
                  {API_URL}
                </span>
              </div>
            </div>

            <div className="p-4 border dark:border-gray-700 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Last Checked</span>
                <span className="text-sm text-gray-800 dark:text-gray-200">
                  {lastRefresh?.toLocaleTimeString() || 'Never'}
                </span>
              </div>
            </div>
          </div>

          {healthStatus?.components && (
            <div className="mt-4 pt-4 border-t dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Components</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(healthStatus.components).map(([name, component]) => (
                  <div key={name} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    {getStatusIcon(component.status)}
                    <span className="text-sm capitalize">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Entity Counts */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <CloudSync className="text-indigo-500" /> Data Counts
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {entityCounts && Object.entries(entityCounts).map(([entity, count]) => (
              <div key={entity} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {typeof count === 'number' ? count.toLocaleString() : count}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                  {entity.replace(/([A-Z])/g, ' $1').trim()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Environment Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Settings className="text-indigo-500" /> Environment
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border dark:border-gray-700 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">Environment</div>
              <div className="text-lg font-medium text-gray-900 dark:text-white">
                {process.env.NODE_ENV}
              </div>
            </div>

            <div className="p-4 border dark:border-gray-700 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">React Version</div>
              <div className="text-lg font-medium text-gray-900 dark:text-white">
                {require('react').version}
              </div>
            </div>

            <div className="p-4 border dark:border-gray-700 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">Build Time</div>
              <div className="text-lg font-medium text-gray-900 dark:text-white">
                {new Date().toLocaleDateString()}
              </div>
            </div>

            <div className="p-4 border dark:border-gray-700 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">Browser</div>
              <div className="text-lg font-medium text-gray-900 dark:text-white truncate">
                {navigator.userAgent.split(' ').slice(-2).join(' ')}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>System status is refreshed automatically on page load.</p>
          <p className="mt-1">For backend sync operations, use the backend admin API directly.</p>
        </div>
      </div>
    </div>
  );
}
