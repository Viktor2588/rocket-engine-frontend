import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MILESTONE_TYPE_INFO } from '../types';
import SpaceIcon from './icons/SpaceIcons';
import { EmojiEvents, CalendarToday } from '@mui/icons-material';

/**
 * Timeline visualization components for space milestones
 */

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

const getCountryFlag = (countryId) => COUNTRY_FLAGS[countryId] || '🏳️';

const COUNTRY_NAMES = {
  USA: 'United States',
  RUS: 'Russia',
  CHN: 'China',
  EUR: 'European Space Agency',
  JPN: 'Japan',
  IND: 'India',
  ISR: 'Israel'
};

/**
 * Milestone Card - Individual milestone display
 */
export function MilestoneCard({ milestone, compact = false, showCountry = true }) {
  const typeInfo = MILESTONE_TYPE_INFO[milestone.milestoneType];

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition">
        <SpaceIcon name={typeInfo?.icon || 'trophy'} size="xl" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {showCountry && (
              <span className="text-lg">{getCountryFlag(milestone.countryId)}</span>
            )}
            <h4 className="font-semibold text-gray-800 truncate">{milestone.title}</h4>
          </div>
          <p className="text-sm text-gray-500">{milestone.year}</p>
        </div>
        {milestone.isFirst && (
          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
            1st
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
      <div
        className="h-2"
        style={{ backgroundColor: typeInfo?.color || '#6B7280' }}
      />
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <SpaceIcon name={typeInfo?.icon || 'trophy'} size="2xl" />
            <div>
              {showCountry && (
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <span className="text-lg">{getCountryFlag(milestone.countryId)}</span>
                  <span>{COUNTRY_NAMES[milestone.countryId] || milestone.countryId}</span>
                </div>
              )}
              <h3 className="font-bold text-gray-800">{milestone.title}</h3>
            </div>
          </div>
          {milestone.isFirst && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full font-bold flex items-center gap-1">
              <EmojiEvents style={{ fontSize: '1rem' }} /> First
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-3">{milestone.description}</p>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="px-2 py-1 bg-gray-100 rounded text-gray-700 flex items-center gap-1">
            <CalendarToday style={{ fontSize: '1rem' }} /> {new Date(milestone.dateAchieved).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
          {milestone.achievedBy && (
            <span className="px-2 py-1 bg-blue-50 rounded text-blue-700">
              {milestone.achievedBy}
            </span>
          )}
          {!milestone.isFirst && milestone.globalRank && (
            <span className="px-2 py-1 bg-gray-100 rounded text-gray-600">
              #{milestone.globalRank} to achieve
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Horizontal Timeline - Scrollable horizontal timeline
 */
export function HorizontalTimeline({ milestones, onMilestoneClick }) {
  const [hoveredId, setHoveredId] = useState(null);

  const timelineData = useMemo(() => {
    if (!milestones || milestones.length === 0) return null;

    const sorted = [...milestones].sort(
      (a, b) => new Date(a.dateAchieved).getTime() - new Date(b.dateAchieved).getTime()
    );

    const years = sorted.map(m => m.year);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    const range = maxYear - minYear || 1;

    return {
      milestones: sorted.map(m => ({
        ...m,
        position: ((m.year - minYear) / range) * 100
      })),
      minYear,
      maxYear,
      decades: Array.from(
        { length: Math.ceil((maxYear - Math.floor(minYear / 10) * 10) / 10) + 1 },
        (_, i) => Math.floor(minYear / 10) * 10 + i * 10
      )
    };
  }, [milestones]);

  if (!timelineData) {
    return (
      <div className="text-center py-8 text-gray-500">
        No milestones to display
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Decade markers */}
      <div className="relative h-8 mb-2">
        {timelineData.decades.map(decade => {
          const position = ((decade - timelineData.minYear) / (timelineData.maxYear - timelineData.minYear || 1)) * 100;
          return (
            <div
              key={decade}
              className="absolute transform -translate-x-1/2 text-sm font-semibold text-gray-500"
              style={{ left: `${Math.max(0, Math.min(100, position))}%` }}
            >
              {decade}
            </div>
          );
        })}
      </div>

      {/* Timeline track */}
      <div className="relative h-4 bg-gray-200 rounded-full overflow-visible">
        {/* Progress line */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full" />

        {/* Milestone markers */}
        {timelineData.milestones.map(m => {
          const typeInfo = MILESTONE_TYPE_INFO[m.milestoneType];
          return (
            <div
              key={m.id}
              className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
              style={{ left: `${m.position}%` }}
              onMouseEnter={() => setHoveredId(m.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onMilestoneClick?.(m)}
            >
              <div
                className={`
                  w-6 h-6 rounded-full border-2 border-white shadow-md cursor-pointer
                  flex items-center justify-center text-xs
                  transition-transform hover:scale-125
                  ${m.isFirst ? 'ring-2 ring-yellow-400' : ''}
                `}
                style={{ backgroundColor: typeInfo?.color || '#6B7280' }}
              >
                {m.isFirst ? '★' : ''}
              </div>

              {/* Tooltip */}
              {hoveredId === m.id && (
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="bg-gray-900 text-white text-xs rounded-lg p-3 min-w-[200px] shadow-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <SpaceIcon name={typeInfo?.icon} size="sm" />
                      <span className="font-semibold">{m.title}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <span>{getCountryFlag(m.countryId)}</span>
                      <span>{m.year}</span>
                      {m.isFirst && <span className="text-yellow-400">★ First</span>}
                    </div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-yellow-400 ring-2 ring-yellow-400"></span>
          First Achievement
        </span>
        <span className="flex items-center gap-1 text-gray-500">
          Click markers for details
        </span>
      </div>
    </div>
  );
}

/**
 * Vertical Timeline - Classic vertical timeline layout
 */
export function VerticalTimeline({ milestones, showCountry = true }) {
  const sorted = useMemo(() =>
    [...milestones].sort(
      (a, b) => new Date(a.dateAchieved).getTime() - new Date(b.dateAchieved).getTime()
    ),
    [milestones]
  );

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-400 to-purple-500" />

      {/* Timeline items */}
      <div className="space-y-6">
        {sorted.map((m, index) => {
          const typeInfo = MILESTONE_TYPE_INFO[m.milestoneType];
          const isLeft = index % 2 === 0;

          return (
            <div key={m.id} className="relative flex items-start">
              {/* Marker */}
              <div
                className={`
                  absolute left-4 transform -translate-x-1/2 z-10
                  w-8 h-8 rounded-full border-3 border-white shadow-lg
                  flex items-center justify-center text-sm
                  ${m.isFirst ? 'ring-2 ring-yellow-400' : ''}
                `}
                style={{ backgroundColor: typeInfo?.color || '#6B7280' }}
              >
                <SpaceIcon name={typeInfo?.icon || 'trophy'} size="sm" className="text-white" />
              </div>

              {/* Content */}
              <div className="ml-12 flex-1">
                <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
                  {/* Date */}
                  <div className="text-sm text-gray-500 mb-1">
                    {new Date(m.dateAchieved).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>

                  {/* Title with flag */}
                  <div className="flex items-center gap-2 mb-2">
                    {showCountry && (
                      <span className="text-xl">{getCountryFlag(m.countryId)}</span>
                    )}
                    <h3 className="font-bold text-gray-800">{m.title}</h3>
                    {m.isFirst && (
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full font-bold flex items-center gap-1">
                        <EmojiEvents style={{ fontSize: '0.875rem' }} /> First
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-2">{m.description}</p>

                  {/* Achieved by */}
                  {m.achievedBy && (
                    <div className="text-sm text-blue-600 font-medium">
                      {m.achievedBy}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Race View - Side-by-side comparison of two countries
 */
export function SpaceRaceView({ country1Timeline, country2Timeline }) {
  const allMilestones = useMemo(() => {
    const combined = [
      ...(country1Timeline?.milestones || []).map(m => ({ ...m, side: 'left' })),
      ...(country2Timeline?.milestones || []).map(m => ({ ...m, side: 'right' }))
    ];
    return combined.sort(
      (a, b) => new Date(a.dateAchieved).getTime() - new Date(b.dateAchieved).getTime()
    );
  }, [country1Timeline, country2Timeline]);

  if (!country1Timeline || !country2Timeline) {
    return <div className="text-center py-8 text-gray-500">Select two countries to compare</div>;
  }

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 px-4">
        <div className="text-center">
          <span className="text-4xl">{getCountryFlag(country1Timeline.countryId)}</span>
          <h3 className="font-bold text-lg">{country1Timeline.countryName}</h3>
          <p className="text-sm text-gray-500">
            {country1Timeline.totalFirsts} firsts
          </p>
        </div>
        <div className="text-2xl font-bold text-gray-400">VS</div>
        <div className="text-center">
          <span className="text-4xl">{getCountryFlag(country2Timeline.countryId)}</span>
          <h3 className="font-bold text-lg">{country2Timeline.countryName}</h3>
          <p className="text-sm text-gray-500">
            {country2Timeline.totalFirsts} firsts
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Center line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-300 transform -translate-x-1/2" />

        {/* Milestones */}
        <div className="space-y-4">
          {allMilestones.map(m => {
            const typeInfo = MILESTONE_TYPE_INFO[m.milestoneType];
            const isLeft = m.side === 'left';

            return (
              <div
                key={m.id}
                className={`flex items-center ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
              >
                {/* Content */}
                <div className={`w-5/12 ${isLeft ? 'pr-4 text-right' : 'pl-4 text-left'}`}>
                  <div className={`
                    bg-white rounded-lg shadow-sm p-3 inline-block max-w-full
                    ${m.isFirst ? 'ring-2 ring-yellow-400' : ''}
                  `}>
                    <div className="text-xs text-gray-500 mb-1">
                      {m.year}
                    </div>
                    <div className="font-semibold text-sm text-gray-800 flex items-center gap-1">
                      <SpaceIcon name={typeInfo?.icon} size="sm" /> {m.title}
                    </div>
                    {m.isFirst && (
                      <span className="text-xs text-yellow-600 font-bold flex items-center gap-1"><EmojiEvents style={{ fontSize: '0.75rem' }} /> FIRST</span>
                    )}
                  </div>
                </div>

                {/* Center marker */}
                <div className="w-2/12 flex justify-center">
                  <div
                    className={`
                      w-4 h-4 rounded-full border-2 border-white shadow-md
                      ${m.isFirst ? 'ring-2 ring-yellow-400' : ''}
                    `}
                    style={{ backgroundColor: typeInfo?.color || '#6B7280' }}
                  />
                </div>

                {/* Empty space */}
                <div className="w-5/12" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Category filter buttons
 */
export function CategoryFilter({ selectedCategory, onSelect }) {
  const categories = [
    { key: null, label: 'All', icon: 'star' },
    { key: 'orbital', label: 'Orbital', icon: 'satellite' },
    { key: 'lunar', label: 'Lunar', icon: 'moon' },
    { key: 'planetary', label: 'Planetary', icon: 'globe' },
    { key: 'human', label: 'Human', icon: 'astronaut' },
    { key: 'technology', label: 'Technology', icon: 'bolt' },
    { key: 'other', label: 'Other', icon: 'rocket' }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(cat => (
        <button
          key={cat.key || 'all'}
          onClick={() => onSelect(cat.key)}
          className={`
            px-3 py-2 rounded-lg text-sm font-medium transition
            flex items-center gap-2
            ${selectedCategory === cat.key
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          <SpaceIcon name={cat.icon} size="sm" />
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  );
}

/**
 * Milestone statistics card
 */
export function MilestoneStatsCard({ stats }) {
  if (!stats) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Space Exploration Statistics</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-indigo-50 rounded-lg">
          <div className="text-3xl font-bold text-indigo-600">{stats.totalMilestones}</div>
          <div className="text-sm text-gray-600">Total Milestones</div>
        </div>
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <div className="text-3xl font-bold text-yellow-600">{stats.achievedMilestoneTypes}</div>
          <div className="text-sm text-gray-600">Types Achieved</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-3xl font-bold text-green-600">
            {stats.milestonesByCountry?.length || 0}
          </div>
          <div className="text-sm text-gray-600">Countries</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-3xl font-bold text-purple-600">
            {stats.milestonesByDecade?.length || 0}
          </div>
          <div className="text-sm text-gray-600">Decades of Exploration</div>
        </div>
      </div>

      {/* Firsts by Country */}
      <div className="mb-4">
        <h4 className="font-semibold text-gray-700 mb-2">First Achievements by Country</h4>
        <div className="space-y-2">
          {stats.milestonesByCountry?.slice(0, 5).map(country => (
            <div key={country.countryId} className="flex items-center gap-2">
              <span className="text-xl">{getCountryFlag(country.countryId)}</span>
              <span className="flex-1 text-sm">{country.countryName}</span>
              <span className="font-bold text-yellow-600">{country.firstsCount} firsts</span>
              <span className="text-sm text-gray-500">({country.count} total)</span>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones by Decade */}
      <div>
        <h4 className="font-semibold text-gray-700 mb-2">Milestones by Decade</h4>
        <div className="flex flex-wrap gap-2">
          {stats.milestonesByDecade?.map(d => (
            <div
              key={d.decade}
              className="px-3 py-1 bg-gray-100 rounded-full text-sm"
            >
              <span className="font-semibold">{d.decade}:</span> {d.count}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default {
  MilestoneCard,
  HorizontalTimeline,
  VerticalTimeline,
  SpaceRaceView,
  CategoryFilter,
  MilestoneStatsCard
};
