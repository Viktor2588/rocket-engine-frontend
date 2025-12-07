import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCountries, useCountryRankings } from '../hooks/useCountries';
import CountryCard from '../components/CountryCard';
import { CapabilityScoreBadge } from '../components/CapabilityScoreCard';
import WorldMapView from '../components/maps/WorldMapView';
import { REGIONS } from '../constants';
import {
  Public,
  PersonOutline,
  Rocket,
  Recycling,
  NightlightRound,
  SatelliteAlt,
  Flag,
} from '@mui/icons-material';

export default function CountryListPage() {
  const { countries, loading, error } = useCountries();
  const { rankings } = useCountryRankings();
  const [viewMode, setViewMode] = useState('map');
  const [sortBy, setSortBy] = useState('score');
  const [filterRegion, setFilterRegion] = useState('all');
  const [filterCapability, setFilterCapability] = useState('all');

  // Create a map of country rankings
  const rankingMap = useMemo(() => {
    const map = {};
    // Safety check: ensure rankings is an array
    const safeRankings = Array.isArray(rankings) ? rankings : [];
    safeRankings.forEach((r) => {
      map[r.id] = r.rank;
    });
    return map;
  }, [rankings]);

  // Filter and sort countries
  const filteredAndSortedCountries = useMemo(() => {
    // Safety check: ensure countries is an array before spreading
    let result = Array.isArray(countries) ? [...countries] : [];

    // Filter by region
    if (filterRegion !== 'all') {
      result = result.filter(c => c.region === filterRegion);
    }

    // Filter by capability
    if (filterCapability !== 'all') {
      result = result.filter(c => c[filterCapability] === true);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return (b.overallCapabilityScore || 0) - (a.overallCapabilityScore || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'launches':
          return (b.totalLaunches || 0) - (a.totalLaunches || 0);
        case 'budget':
          return (b.annualBudgetUsd || 0) - (a.annualBudgetUsd || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [countries, sortBy, filterRegion, filterCapability]);

  // Calculate stats
  const stats = useMemo(() => {
    // Safety check: ensure countries is an array
    const safeCountries = Array.isArray(countries) ? countries : [];
    return {
      totalCountries: safeCountries.length,
      humanSpaceflight: safeCountries.filter(c => c.humanSpaceflightCapable).length,
      independentLaunch: safeCountries.filter(c => c.independentLaunchCapable).length,
      reusableRockets: safeCountries.filter(c => c.reusableRocketCapable).length,
      averageScore: safeCountries.length > 0
        ? safeCountries.reduce((sum, c) => sum + (c.overallCapabilityScore || 0), 0) / safeCountries.length
        : 0,
    };
  }, [countries]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading space programs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">Error Loading Countries</h2>
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <p className="text-sm text-red-500 dark:text-red-500 mt-2">
            API URL: {apiUrl}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <Public style={{ fontSize: '2.5rem' }} className="text-indigo-600 dark:text-indigo-400" /> Global Space Programs
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore and compare space capabilities across {stats.totalCountries} nations
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stats.totalCountries}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Space Programs</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.humanSpaceflight}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Human Spaceflight</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.independentLaunch}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Independent Launch</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.reusableRockets}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Reusable Rockets</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.averageScore.toFixed(0)}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Score</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            <div className="flex flex-wrap gap-4">
              {/* Sort */}
              <label className="flex items-center gap-2">
                <span className="text-gray-700 dark:text-gray-300 font-semibold text-sm">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="score">Capability Score</option>
                  <option value="name">Name</option>
                  <option value="launches">Total Launches</option>
                  <option value="budget">Budget</option>
                </select>
              </label>

              {/* Filter by Region */}
              <label className="flex items-center gap-2">
                <span className="text-gray-700 dark:text-gray-300 font-semibold text-sm">Region:</span>
                <select
                  value={filterRegion}
                  onChange={(e) => setFilterRegion(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Regions</option>
                  {Object.values(REGIONS).map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </label>

              {/* Filter by Capability */}
              <label className="flex items-center gap-2">
                <span className="text-gray-700 dark:text-gray-300 font-semibold text-sm">Capability:</span>
                <select
                  value={filterCapability}
                  onChange={(e) => setFilterCapability(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Capabilities</option>
                  <option value="humanSpaceflightCapable">Human Spaceflight</option>
                  <option value="independentLaunchCapable">Independent Launch</option>
                  <option value="reusableRocketCapable">Reusable Rockets</option>
                  <option value="deepSpaceCapable">Deep Space</option>
                  <option value="spaceStationCapable">Space Station</option>
                </select>
              </label>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('map')}
                className={`px-4 py-2 rounded-md font-semibold transition text-sm ${
                  viewMode === 'map'
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Map
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-md font-semibold transition text-sm ${
                  viewMode === 'grid'
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-md font-semibold transition text-sm ${
                  viewMode === 'table'
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Table
              </button>
              <Link
                to="/compare/countries"
                className="px-4 py-2 rounded-md font-semibold bg-green-500 text-white hover:bg-green-600 transition text-sm"
              >
                Compare
              </Link>
            </div>
          </div>
        </div>

        {/* Results */}
        {viewMode === 'map' ? (
          <WorldMapView
            countries={filteredAndSortedCountries}
            showLabels={true}
          />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedCountries.map((country) => (
              <CountryCard
                key={country.id}
                country={country}
                rank={sortBy === 'score' ? rankingMap[country.id] : null}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Agency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Launches
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Capabilities
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAndSortedCountries.map((country, index) => (
                  <tr key={country.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {sortBy === 'score' ? rankingMap[country.id] || index + 1 : index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">
                          {country.flagUrl ? (
                            <img src={country.flagUrl} alt="" className="w-6 h-4 object-cover rounded" />
                          ) : <Flag className="text-gray-400" style={{ fontSize: '1.25rem' }} />}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">{country.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {country.spaceAgencyAcronym || country.spaceAgencyName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <CapabilityScoreBadge score={country.overallCapabilityScore || 0} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {country.totalLaunches ?? '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-1">
                        {country.humanSpaceflightCapable && <PersonOutline titleAccess="Human Spaceflight" className="text-green-600" style={{ fontSize: '1.25rem' }} />}
                        {country.independentLaunchCapable && <Rocket titleAccess="Independent Launch" className="text-blue-600" style={{ fontSize: '1.25rem' }} />}
                        {country.reusableRocketCapable && <Recycling titleAccess="Reusable Rockets" className="text-purple-600" style={{ fontSize: '1.25rem' }} />}
                        {country.deepSpaceCapable && <NightlightRound titleAccess="Deep Space" className="text-indigo-600" style={{ fontSize: '1.25rem' }} />}
                        {country.spaceStationCapable && <SatelliteAlt titleAccess="Space Station" className="text-orange-600" style={{ fontSize: '1.25rem' }} />}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        to={`/countries/${country.isoCode}`}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* No results */}
        {filteredAndSortedCountries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No countries match your filters</p>
            <button
              onClick={() => {
                setFilterRegion('all');
                setFilterCapability('all');
              }}
              className="mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Footer note */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Data sources: Wikipedia, space agency official statistics.
            Scores are calculated based on the Space Capability Index (SCI) methodology.
          </p>
        </div>
      </div>
    </div>
  );
}
