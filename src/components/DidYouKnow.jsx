import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCountries } from '../hooks/useCountries';
import { useEngines } from '../hooks/useEngines';
import { useLaunchVehicles } from '../hooks/useLaunchVehicles';
import { useLaunchSites } from '../hooks/useLaunchSites';
import SpaceIcon from './icons/SpaceIcons';

/**
 * Space facts generator based on actual data
 */
function useSpaceFacts() {
  const { countries } = useCountries();
  const { engines } = useEngines();
  const { vehicles } = useLaunchVehicles();
  const { launchSites } = useLaunchSites();

  return useMemo(() => {
    const facts = [];

    // Country facts
    if (countries.length > 0) {
      // Most launches
      const topLauncher = [...countries].sort((a, b) => (b.totalLaunches || 0) - (a.totalLaunches || 0))[0];
      if (topLauncher?.totalLaunches) {
        facts.push({
          text: `${topLauncher.name} has conducted ${topLauncher.totalLaunches.toLocaleString()} orbital launches, more than any other nation.`,
          link: `/countries/${topLauncher.isoCode}`,
          category: 'country',
        });
      }

      // Human spaceflight capable
      const humanCapable = countries.filter(c => c.humanSpaceflightCapable);
      if (humanCapable.length > 0) {
        facts.push({
          text: `Only ${humanCapable.length} countries have achieved independent human spaceflight capability.`,
          link: '/rankings',
          category: 'country',
        });
      }

      // Reusable rocket capable
      const reusableCapable = countries.filter(c => c.reusableRocketCapable);
      if (reusableCapable.length > 0) {
        facts.push({
          text: `${reusableCapable.length} nation${reusableCapable.length === 1 ? '' : 's'} ha${reusableCapable.length === 1 ? 's' : 've'} demonstrated reusable rocket technology.`,
          link: '/rankings',
          category: 'country',
        });
      }

      // Highest success rate
      const highSuccessRate = [...countries]
        .filter(c => (c.totalLaunches || 0) >= 50)
        .sort((a, b) => (b.launchSuccessRate || 0) - (a.launchSuccessRate || 0))[0];
      if (highSuccessRate?.launchSuccessRate) {
        facts.push({
          text: `${highSuccessRate.name} maintains a ${highSuccessRate.launchSuccessRate.toFixed(1)}% launch success rate.`,
          link: `/countries/${highSuccessRate.isoCode}`,
          category: 'country',
        });
      }
    }

    // Engine facts
    if (engines.length > 0) {
      // Most powerful engine
      const mostPowerful = [...engines].sort((a, b) => (b.thrustKn || 0) - (a.thrustKn || 0))[0];
      if (mostPowerful?.thrustKn) {
        facts.push({
          text: `The ${mostPowerful.name} engine produces ${mostPowerful.thrustKn.toLocaleString()} kN of thrust, making it one of the most powerful rocket engines.`,
          link: `/engines/${mostPowerful.id}`,
          category: 'engine',
        });
      }

      // Most efficient engine
      const mostEfficient = [...engines].sort((a, b) => (b.specificImpulseS || 0) - (a.specificImpulseS || 0))[0];
      if (mostEfficient?.specificImpulseS) {
        facts.push({
          text: `The ${mostEfficient.name} achieves a specific impulse of ${mostEfficient.specificImpulseS.toFixed(0)} seconds, making it highly fuel-efficient.`,
          link: `/engines/${mostEfficient.id}`,
          category: 'engine',
        });
      }

      // Engine propellant diversity
      const propellants = [...new Set(engines.map(e => e.propellant).filter(Boolean))];
      facts.push({
        text: `Rocket engines use ${propellants.length} different propellant combinations, from cryogenic hydrogen to hypergolic fuels.`,
        link: '/engines',
        category: 'engine',
      });

      // Reusable engines
      const reusableEngines = engines.filter(e => e.reusable);
      if (reusableEngines.length > 0) {
        facts.push({
          text: `${reusableEngines.length} rocket engine${reusableEngines.length === 1 ? ' is' : 's are'} designed for reusability, a key advancement in reducing launch costs.`,
          link: '/engines',
          category: 'engine',
        });
      }
    }

    // Vehicle facts
    if (vehicles.length > 0) {
      // Largest payload capacity
      const heavyLifter = [...vehicles].sort((a, b) => (b.payloadToLeoKg || 0) - (a.payloadToLeoKg || 0))[0];
      if (heavyLifter?.payloadToLeoKg) {
        facts.push({
          text: `${heavyLifter.name} can lift ${(heavyLifter.payloadToLeoKg / 1000).toFixed(0)} metric tons to low Earth orbit.`,
          link: `/vehicles/${heavyLifter.id}`,
          category: 'vehicle',
        });
      }

      // Active vehicles count
      const activeVehicles = vehicles.filter(v => v.status === 'Active');
      facts.push({
        text: `There are currently ${activeVehicles.length} active launch vehicles operating worldwide.`,
        link: '/vehicles',
        category: 'vehicle',
      });

      // Human-rated vehicles
      const humanRated = vehicles.filter(v => v.humanRated);
      if (humanRated.length > 0) {
        facts.push({
          text: `${humanRated.length} launch vehicle${humanRated.length === 1 ? ' is' : 's are'} certified to carry humans to space.`,
          link: '/vehicles',
          category: 'vehicle',
        });
      }
    }

    // Launch site facts
    if (launchSites.length > 0) {
      // Busiest launch site
      const busiestSite = [...launchSites].sort((a, b) => (b.totalLaunches || 0) - (a.totalLaunches || 0))[0];
      if (busiestSite?.totalLaunches) {
        facts.push({
          text: `${busiestSite.name} has hosted ${busiestSite.totalLaunches.toLocaleString()} launches, making it one of the world's busiest spaceports.`,
          link: `/launch-sites/${busiestSite.id}`,
          category: 'launchSite',
        });
      }

      // Oldest active site
      const oldestSite = [...launchSites]
        .filter(s => s.status === 'Active' && s.established)
        .sort((a, b) => (a.established || 9999) - (b.established || 9999))[0];
      if (oldestSite?.established) {
        const age = new Date().getFullYear() - oldestSite.established;
        facts.push({
          text: `${oldestSite.name}, established in ${oldestSite.established}, has been operational for ${age} years.`,
          link: `/launch-sites/${oldestSite.id}`,
          category: 'launchSite',
        });
      }

      // Human-rated sites
      const humanRatedSites = launchSites.filter(s => s.humanRated);
      if (humanRatedSites.length > 0) {
        facts.push({
          text: `${humanRatedSites.length} launch site${humanRatedSites.length === 1 ? ' is' : 's are'} capable of supporting crewed spaceflight missions.`,
          link: '/launch-sites',
          category: 'launchSite',
        });
      }
    }

    // Add some static interesting facts
    facts.push(
      {
        text: 'The Space Race between the USA and USSR drove rapid advances in rocket technology during the 1960s.',
        link: '/analytics',
        category: 'history',
      },
      {
        text: 'Methane-fueled rockets are becoming popular because the fuel can be manufactured on Mars.',
        link: '/engines',
        category: 'technology',
      },
      {
        text: 'Rocket engines can be throttled to control thrust, crucial for landing maneuvers.',
        link: '/engines',
        category: 'technology',
      },
      {
        text: 'Staged combustion engines are more efficient but more complex than gas generator engines.',
        link: '/engines',
        category: 'technology',
      },
    );

    return facts;
  }, [countries, engines, vehicles, launchSites]);
}

/**
 * Category icons and colors
 */
const CATEGORY_STYLES = {
  country: { icon: 'globe', color: 'indigo' },
  engine: { icon: 'rocket', color: 'blue' },
  vehicle: { icon: 'satellite', color: 'purple' },
  launchSite: { icon: 'launchpad', color: 'orange' },
  history: { icon: 'history', color: 'amber' },
  technology: { icon: 'bolt', color: 'cyan' },
};

/**
 * Did You Know Component
 */
export default function DidYouKnow({ autoRotate = true, interval = 8000 }) {
  const facts = useSpaceFacts();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Shuffle facts on mount
  const shuffledFacts = useMemo(() => {
    return [...facts].sort(() => Math.random() - 0.5);
  }, [facts]);

  // Auto-rotate facts
  useEffect(() => {
    if (!autoRotate || isHovered || shuffledFacts.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % shuffledFacts.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoRotate, interval, isHovered, shuffledFacts.length]);

  if (shuffledFacts.length === 0) return null;

  const currentFact = shuffledFacts[currentIndex];
  const style = CATEGORY_STYLES[currentFact.category] || CATEGORY_STYLES.technology;

  return (
    <div
      className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-4 shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-${style.color}-500/20 flex items-center justify-center`}>
          <SpaceIcon name={style.icon} size="lg" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              Did you know?
            </span>
            <span className="text-xs text-gray-500">
              {currentIndex + 1} / {shuffledFacts.length}
            </span>
          </div>
          <p className="text-white text-sm leading-relaxed">
            {currentFact.text}
          </p>
          {currentFact.link && (
            <Link
              to={currentFact.link}
              className="inline-flex items-center gap-1 mt-2 text-xs text-indigo-400 hover:text-indigo-300 transition"
            >
              Learn more
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-shrink-0 flex flex-col gap-1">
          <button
            onClick={() => setCurrentIndex(prev => (prev - 1 + shuffledFacts.length) % shuffledFacts.length)}
            className="p-1 text-gray-400 hover:text-white transition"
            aria-label="Previous fact"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentIndex(prev => (prev + 1) % shuffledFacts.length)}
            className="p-1 text-gray-400 hover:text-white transition"
            aria-label="Next fact"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Progress indicator */}
      {autoRotate && !isHovered && (
        <div className="mt-3 h-1 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / shuffledFacts.length) * 100}%`,
            }}
          ></div>
        </div>
      )}
    </div>
  );
}
