import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCountries } from '../hooks/useCountries';
import CapabilityRadarChart, { CapabilityComparisonTable } from '../components/charts/CapabilityRadarChart';
import GapAnalysis from '../components/comparison/GapAnalysis';
import StrengthsWeaknesses from '../components/comparison/StrengthsWeaknesses';

const MAX_COMPARE_COUNTRIES = 4;

// Tab definitions
const TABS = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'gap-analysis', label: 'Gap Analysis', icon: '📈' },
  { id: 'swot', label: 'SWOT Analysis', icon: '🎯' },
];

/**
 * CountrySelector - Dropdown to select countries for comparison
 */
function CountrySelector({ countries, selectedIds, onToggle, maxSelections }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = useMemo(() => {
    if (!searchQuery) return countries;
    const query = searchQuery.toLowerCase();
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.isoCode.toLowerCase().includes(query) ||
        (c.spaceAgencyAcronym && c.spaceAgencyAcronym.toLowerCase().includes(query))
    );
  }, [countries, searchQuery]);

  const isSelected = (id) => selectedIds.includes(id);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Select Countries</h3>
        <span className="text-sm text-gray-500">
          {selectedIds.length} / {maxSelections} selected
        </span>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search countries or agencies..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />

      {/* Country grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
        {filteredCountries.map((country) => {
          const selected = isSelected(country.id);
          const disabled = !selected && selectedIds.length >= maxSelections;

          return (
            <button
              key={country.id}
              onClick={() => !disabled && onToggle(country.id)}
              disabled={disabled}
              className={`flex items-center gap-2 p-2 rounded-lg transition-all text-left ${
                selected
                  ? 'bg-indigo-100 ring-2 ring-indigo-500'
                  : disabled
                  ? 'bg-gray-100 opacity-50 cursor-not-allowed'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              {country.flagUrl ? (
                <img
                  src={country.flagUrl}
                  alt=""
                  className="w-6 h-4 object-cover rounded flex-shrink-0"
                />
              ) : (
                <span className="text-lg">🏳️</span>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800 truncate">
                  {country.name}
                </div>
                <div className="text-xs text-gray-500">
                  {country.spaceAgencyAcronym || country.isoCode}
                </div>
              </div>
              {selected && (
                <span className="text-indigo-600 font-bold text-lg">✓</span>
              )}
            </button>
          );
        })}
      </div>

      {filteredCountries.length === 0 && (
        <div className="text-center text-gray-500 py-4">
          No countries match your search
        </div>
      )}
    </div>
  );
}

/**
 * ComparisonCard - Side-by-side country comparison card
 */
function ComparisonCard({ country, rank }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header with flag and name */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 text-white">
        <div className="flex items-center gap-3">
          {country.flagUrl ? (
            <img
              src={country.flagUrl}
              alt=""
              className="w-12 h-8 object-cover rounded shadow"
            />
          ) : (
            <span className="text-3xl">🏳️</span>
          )}
          <div>
            <h3 className="font-bold text-lg">{country.name}</h3>
            <p className="text-indigo-100 text-sm">{country.spaceAgencyName}</p>
          </div>
        </div>
      </div>

      {/* Score */}
      <div className="p-4 text-center border-b">
        <div className="text-4xl font-bold text-indigo-600">
          {(country.overallCapabilityScore || 0).toFixed(0)}
        </div>
        <div className="text-sm text-gray-500">Space Capability Index</div>
        {rank && (
          <div className="mt-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
              rank === 1 ? 'bg-yellow-100 text-yellow-800' :
              rank === 2 ? 'bg-gray-100 text-gray-800' :
              rank === 3 ? 'bg-orange-100 text-orange-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              #{rank} in selection
            </span>
          </div>
        )}
      </div>

      {/* Key Stats */}
      <div className="p-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-gray-500">Founded</div>
          <div className="font-semibold">{country.spaceAgencyFounded || '—'}</div>
        </div>
        <div>
          <div className="text-gray-500">Launches</div>
          <div className="font-semibold">{country.totalLaunches ?? '—'}</div>
        </div>
        <div>
          <div className="text-gray-500">Success Rate</div>
          <div className="font-semibold">
            {country.launchSuccessRate ? `${country.launchSuccessRate.toFixed(1)}%` : '—'}
          </div>
        </div>
        <div>
          <div className="text-gray-500">Astronauts</div>
          <div className="font-semibold">{country.activeAstronauts ?? '—'}</div>
        </div>
      </div>

      {/* Capabilities */}
      <div className="px-4 pb-4">
        <div className="text-sm text-gray-500 mb-2">Capabilities</div>
        <div className="flex flex-wrap gap-2">
          {country.humanSpaceflightCapable && (
            <span className="inline-flex items-center px-2 py-1 rounded bg-green-100 text-green-800 text-xs">
              Human Spaceflight
            </span>
          )}
          {country.independentLaunchCapable && (
            <span className="inline-flex items-center px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs">
              Independent Launch
            </span>
          )}
          {country.reusableRocketCapable && (
            <span className="inline-flex items-center px-2 py-1 rounded bg-purple-100 text-purple-800 text-xs">
              Reusable Rockets
            </span>
          )}
          {country.deepSpaceCapable && (
            <span className="inline-flex items-center px-2 py-1 rounded bg-indigo-100 text-indigo-800 text-xs">
              Deep Space
            </span>
          )}
          {country.spaceStationCapable && (
            <span className="inline-flex items-center px-2 py-1 rounded bg-orange-100 text-orange-800 text-xs">
              Space Station
            </span>
          )}
          {!country.humanSpaceflightCapable && !country.independentLaunchCapable && (
            <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-600 text-xs">
              Developing Program
            </span>
          )}
        </div>
      </div>

      {/* View Details Link */}
      <div className="border-t p-4">
        <Link
          to={`/countries/${country.isoCode}`}
          className="block text-center text-indigo-600 hover:text-indigo-800 font-medium text-sm"
        >
          View Full Profile
        </Link>
      </div>
    </div>
  );
}

/**
 * Tab navigation component
 */
function TabNavigation({ activeTab, onTabChange, selectedCount }) {
  return (
    <div className="flex border-b border-gray-200 mb-6">
      {TABS.map(tab => {
        // Disable certain tabs based on selection count
        const isDisabled =
          (tab.id === 'gap-analysis' && selectedCount !== 2) ||
          (tab.id === 'swot' && selectedCount !== 1);

        return (
          <button
            key={tab.id}
            onClick={() => !isDisabled && onTabChange(tab.id)}
            disabled={isDisabled}
            className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition ${
              activeTab === tab.id
                ? 'border-indigo-500 text-indigo-600'
                : isDisabled
                ? 'border-transparent text-gray-300 cursor-not-allowed'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {isDisabled && (
              <span className="text-xs text-gray-400">
                ({tab.id === 'gap-analysis' ? 'needs 2' : 'needs 1'})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Overview Tab Content
 */
function OverviewTab({ selectedCountries }) {
  if (selectedCountries.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <div className="text-6xl mb-4">🛰️</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Select Countries to Compare
        </h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Choose up to {MAX_COMPARE_COUNTRIES} countries from the selector above to see a
          detailed comparison of their space capabilities.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Radar Chart */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Capability Comparison
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CapabilityRadarChart
            countries={selectedCountries}
            size="large"
            showLegend={true}
          />
          <CapabilityComparisonTable countries={selectedCountries} />
        </div>
      </div>

      {/* Side-by-side Cards */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Country Profiles
        </h2>
        <div className={`grid gap-4 ${
          selectedCountries.length === 1 ? 'grid-cols-1 max-w-md' :
          selectedCountries.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
          selectedCountries.length === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
          'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
        }`}>
          {selectedCountries.map((country, idx) => (
            <ComparisonCard key={country.id} country={country} rank={idx + 1} />
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Comparison Summary
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-indigo-50 rounded-lg">
            <div className="text-2xl font-bold text-indigo-600">
              {selectedCountries[0]?.name || '—'}
            </div>
            <div className="text-sm text-gray-500">Highest Score</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {selectedCountries.filter(c => c.humanSpaceflightCapable).length}
            </div>
            <div className="text-sm text-gray-500">Human Spaceflight</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {selectedCountries.filter(c => c.independentLaunchCapable).length}
            </div>
            <div className="text-sm text-gray-500">Independent Launch</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {selectedCountries.filter(c => c.reusableRocketCapable).length}
            </div>
            <div className="text-sm text-gray-500">Reusable Rockets</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * CountryComparisonPage - Compare multiple countries side-by-side
 */
export default function CountryComparisonPage() {
  const { countries, loading, error } = useCountries();
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  // Toggle country selection
  const handleToggleCountry = (countryId) => {
    setSelectedIds((prev) => {
      if (prev.includes(countryId)) {
        return prev.filter((id) => id !== countryId);
      }
      if (prev.length >= MAX_COMPARE_COUNTRIES) {
        return prev;
      }
      return [...prev, countryId];
    });
  };

  // Get selected country objects
  const selectedCountries = useMemo(() => {
    return selectedIds
      .map((id) => countries.find((c) => c.id === id))
      .filter(Boolean)
      .sort((a, b) => (b.overallCapabilityScore || 0) - (a.overallCapabilityScore || 0));
  }, [selectedIds, countries]);

  // Pre-select top countries if none selected
  const handleQuickSelect = (type) => {
    let selection = [];
    switch (type) {
      case 'top4':
        selection = [...countries]
          .sort((a, b) => (b.overallCapabilityScore || 0) - (a.overallCapabilityScore || 0))
          .slice(0, 4)
          .map((c) => c.id);
        break;
      case 'superpowers':
        selection = countries
          .filter((c) => ['USA', 'CHN', 'RUS'].includes(c.isoCode))
          .map((c) => c.id);
        break;
      case 'asia':
        selection = countries
          .filter((c) => ['CHN', 'JPN', 'IND', 'KOR'].includes(c.isoCode))
          .map((c) => c.id);
        break;
      case 'europe':
        selection = countries
          .filter((c) => ['FRA', 'DEU', 'GBR', 'ITA'].includes(c.isoCode))
          .slice(0, 4)
          .map((c) => c.id);
        break;
      case 'usa-china':
        selection = countries
          .filter((c) => ['USA', 'CHN'].includes(c.isoCode))
          .map((c) => c.id);
        setActiveTab('gap-analysis');
        break;
      case 'usa-russia':
        selection = countries
          .filter((c) => ['USA', 'RUS'].includes(c.isoCode))
          .map((c) => c.id);
        setActiveTab('gap-analysis');
        break;
      default:
        break;
    }
    setSelectedIds(selection);
  };

  // Auto-switch tabs based on selection count
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading countries...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Data</h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Country Comparison Tool
          </h1>
          <p className="text-gray-600">
            Compare space capabilities across nations with detailed gap analysis and SWOT assessments
          </p>
        </div>

        {/* Quick Select Buttons */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-500 mr-2">Quick Select:</span>
            <button
              onClick={() => handleQuickSelect('top4')}
              className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm hover:bg-indigo-200 transition"
            >
              Top 4
            </button>
            <button
              onClick={() => handleQuickSelect('superpowers')}
              className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm hover:bg-purple-200 transition"
            >
              Space Superpowers
            </button>
            <button
              onClick={() => handleQuickSelect('asia')}
              className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm hover:bg-green-200 transition"
            >
              Asia Leaders
            </button>
            <button
              onClick={() => handleQuickSelect('europe')}
              className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm hover:bg-blue-200 transition"
            >
              European Programs
            </button>
            <span className="text-gray-300 mx-2">|</span>
            <span className="text-sm text-gray-500">Gap Analysis:</span>
            <button
              onClick={() => handleQuickSelect('usa-china')}
              className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm hover:bg-red-200 transition"
            >
              USA vs China
            </button>
            <button
              onClick={() => handleQuickSelect('usa-russia')}
              className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm hover:bg-orange-200 transition"
            >
              USA vs Russia
            </button>
            {selectedIds.length > 0 && (
              <button
                onClick={() => setSelectedIds([])}
                className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition ml-2"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Country Selector */}
        <CountrySelector
          countries={countries}
          selectedIds={selectedIds}
          onToggle={handleToggleCountry}
          maxSelections={MAX_COMPARE_COUNTRIES}
        />

        {/* Tab Navigation */}
        {selectedCountries.length > 0 && (
          <div className="mt-8">
            <TabNavigation
              activeTab={activeTab}
              onTabChange={handleTabChange}
              selectedCount={selectedCountries.length}
            />

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <OverviewTab selectedCountries={selectedCountries} />
            )}

            {activeTab === 'gap-analysis' && selectedCountries.length === 2 && (
              <GapAnalysis
                country1={selectedCountries[0]}
                country2={selectedCountries[1]}
              />
            )}

            {activeTab === 'gap-analysis' && selectedCountries.length !== 2 && (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-6xl mb-4">📊</div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Select Exactly Two Countries
                </h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Gap Analysis compares two countries head-to-head. Please select exactly 2 countries
                  to see a detailed gap analysis.
                </p>
              </div>
            )}

            {activeTab === 'swot' && selectedCountries.length === 1 && (
              <StrengthsWeaknesses
                country={selectedCountries[0]}
                allCountries={countries}
              />
            )}

            {activeTab === 'swot' && selectedCountries.length !== 1 && (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-6xl mb-4">🎯</div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Select One Country
                </h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  SWOT Analysis provides an in-depth look at a single country's strengths,
                  weaknesses, opportunities, and threats. Please select exactly 1 country.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {selectedCountries.length === 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🛰️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Select Countries to Compare
            </h2>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              Choose up to {MAX_COMPARE_COUNTRIES} countries from the selector above to see a
              detailed comparison of their space capabilities.
            </p>
            <div className="text-sm text-gray-500">
              <p className="mb-2"><strong>Tip:</strong> Use the quick select buttons above for common comparisons</p>
              <ul className="space-y-1">
                <li>Select 1 country for SWOT Analysis</li>
                <li>Select 2 countries for Gap Analysis</li>
                <li>Select 2-4 countries for Overview comparison</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
