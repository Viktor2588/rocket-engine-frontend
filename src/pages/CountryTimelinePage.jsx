import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCountryByCode } from '../hooks/useCountries';
import {
  useCountryTimeline,
  useFilteredMilestones,
  useGlobalMilestoneStats,
  useSpaceRaceComparison
} from '../hooks/useMilestones';
import {
  MilestoneCard,
  HorizontalTimeline,
  VerticalTimeline,
  SpaceRaceView,
  CategoryFilter,
  MilestoneStatsCard
} from '../components/Timeline';

// Country flag helper
const COUNTRY_FLAGS = {
  USA: '🇺🇸',
  RUS: '🇷🇺',
  CHN: '🇨🇳',
  EUR: '🇪🇺',
  JPN: '🇯🇵',
  IND: '🇮🇳',
  ISR: '🇮🇱',
  DEU: '🇩🇪',
  FRA: '🇫🇷',
  GBR: '🇬🇧',
  KOR: '🇰🇷',
  IRN: '🇮🇷'
};

export default function CountryTimelinePage() {
  const { code } = useParams();
  const { country, loading: countryLoading } = useCountryByCode(code);
  const { timeline, loading: timelineLoading, error } = useCountryTimeline(code);
  const { stats } = useGlobalMilestoneStats();

  const [viewMode, setViewMode] = useState('vertical'); // vertical, horizontal, cards
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  // Filtering
  const {
    milestones: filteredMilestones,
    filters,
    updateFilter,
    resetFilters,
    sortBy,
    setSortBy
  } = useFilteredMilestones(timeline?.milestones || []);

  const loading = countryLoading || timelineLoading;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading timeline...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Timeline</h2>
          <p className="text-red-600">{error}</p>
          <Link
            to={`/countries/${code}`}
            className="mt-4 inline-block text-indigo-500 hover:text-indigo-700 font-semibold"
          >
            ← Back to Country
          </Link>
        </div>
      </div>
    );
  }

  if (!timeline || !timeline.milestones || timeline.milestones.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">{COUNTRY_FLAGS[code] || '🏳️'}</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {country?.name || code} Space Timeline
          </h1>
          <p className="text-gray-500 text-lg mb-6">No milestones recorded yet</p>
          <Link
            to={`/countries/${code}`}
            className="text-indigo-500 hover:text-indigo-700 font-semibold"
          >
            ← Back to Country Details
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb & Back */}
        <div className="mb-6">
          <Link
            to={`/countries/${code}`}
            className="text-indigo-500 hover:text-indigo-700 font-semibold"
          >
            ← Back to {country?.name || code}
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-5xl">{COUNTRY_FLAGS[code] || '🏳️'}</span>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {country?.name || timeline.countryName} Space Timeline
                </h1>
                <p className="text-gray-600">
                  Historical milestones and achievements in space exploration
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-4">
              <div className="text-center px-4 py-2 bg-indigo-50 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">{timeline.totalMilestones}</div>
                <div className="text-xs text-gray-500">Milestones</div>
              </div>
              <div className="text-center px-4 py-2 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{timeline.totalFirsts}</div>
                <div className="text-xs text-gray-500">World Firsts</div>
              </div>
              {timeline.earliestMilestone && (
                <div className="text-center px-4 py-2 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {timeline.earliestMilestone.year}
                  </div>
                  <div className="text-xs text-gray-500">First Achievement</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Category Filter */}
            <CategoryFilter
              selectedCategory={filters.category}
              onSelect={(cat) => updateFilter('category', cat)}
            />

            {/* View Mode & Sort */}
            <div className="flex items-center gap-4">
              {/* Firsts Only Toggle */}
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters.firstsOnly}
                  onChange={(e) => updateFilter('firstsOnly', e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>World Firsts Only</span>
              </label>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
              >
                <option value="date">Sort by Date</option>
                <option value="significance">Sort by Significance</option>
                <option value="title">Sort by Title</option>
              </select>

              {/* View Mode */}
              <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                <button
                  onClick={() => setViewMode('vertical')}
                  className={`px-3 py-2 text-sm ${viewMode === 'vertical' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  📋 Vertical
                </button>
                <button
                  onClick={() => setViewMode('horizontal')}
                  className={`px-3 py-2 text-sm border-l border-r ${viewMode === 'horizontal' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  📊 Horizontal
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-2 text-sm ${viewMode === 'cards' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  🃏 Cards
                </button>
              </div>
            </div>
          </div>

          {/* Active filters indicator */}
          {(filters.category || filters.firstsOnly) && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm text-gray-500">Active filters:</span>
              {filters.category && (
                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                  {filters.category}
                </span>
              )}
              {filters.firstsOnly && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                  World Firsts
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-xs text-red-600 hover:text-red-800"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Timeline Content */}
        <div className="mb-8">
          {filteredMilestones.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
              No milestones match the current filters
            </div>
          ) : viewMode === 'horizontal' ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <HorizontalTimeline
                milestones={filteredMilestones}
                onMilestoneClick={setSelectedMilestone}
              />

              {/* Selected milestone detail */}
              {selectedMilestone && (
                <div className="mt-6 pt-6 border-t">
                  <MilestoneCard milestone={selectedMilestone} showCountry={false} />
                </div>
              )}
            </div>
          ) : viewMode === 'vertical' ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <VerticalTimeline milestones={filteredMilestones} showCountry={false} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMilestones.map(m => (
                <MilestoneCard key={m.id} milestone={m} showCountry={false} />
              ))}
            </div>
          )}
        </div>

        {/* First Achievements Highlight */}
        {timeline.firstAchievements && timeline.firstAchievements.length > 0 && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🥇</span>
              World First Achievements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {timeline.firstAchievements.map(m => (
                <MilestoneCard key={m.id} milestone={m} compact showCountry={false} />
              ))}
            </div>
          </div>
        )}

        {/* Global Context */}
        {stats && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Global Context</h2>
            <MilestoneStatsCard stats={stats} />
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex justify-between items-center">
          <Link
            to={`/countries/${code}`}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            ← Country Details
          </Link>
          <Link
            to="/countries"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            All Countries →
          </Link>
        </div>
      </div>
    </div>
  );
}
