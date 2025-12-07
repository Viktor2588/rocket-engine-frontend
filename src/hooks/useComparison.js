import { useMemo } from 'react';

/**
 * Capability categories with weights and labels
 */
const CAPABILITY_CATEGORIES = [
  { key: 'launchCapability', label: 'Launch Capability', weight: 0.20, maxScore: 100 },
  { key: 'propulsionTechnology', label: 'Propulsion Technology', weight: 0.15, maxScore: 100 },
  { key: 'humanSpaceflight', label: 'Human Spaceflight', weight: 0.20, maxScore: 100 },
  { key: 'deepSpaceExploration', label: 'Deep Space', weight: 0.15, maxScore: 100 },
  { key: 'satelliteInfrastructure', label: 'Satellite Infrastructure', weight: 0.15, maxScore: 100 },
  { key: 'groundInfrastructure', label: 'Ground Infrastructure', weight: 0.10, maxScore: 100 },
  { key: 'technologicalIndependence', label: 'Tech Independence', weight: 0.05, maxScore: 100 },
];

/**
 * Calculate category scores from country data
 */
function calculateCategoryScores(country) {
  if (!country) return {};

  // These are estimated scores based on available data
  // In a real backend, these would be properly calculated
  const score = country.overallCapabilityScore || 0;
  const hasHuman = country.humanSpaceflightCapable;
  const hasLaunch = country.independentLaunchCapable;
  const hasReusable = country.reusableRocketCapable;
  const hasDeepSpace = country.deepSpaceCapable;
  const hasStation = country.spaceStationCapable;

  return {
    launchCapability: hasLaunch
      ? Math.min(100, (score * 1.1) + (country.totalLaunches || 0) * 0.05 + (country.launchSuccessRate || 0) * 0.3)
      : Math.min(30, score * 0.5),
    propulsionTechnology: Math.min(100, score * 0.9 + (hasReusable ? 25 : 0)),
    humanSpaceflight: hasHuman
      ? Math.min(100, 50 + (hasStation ? 30 : 0) + (country.activeAstronauts || 0) * 0.5)
      : 0,
    deepSpaceExploration: hasDeepSpace
      ? Math.min(100, 60 + (country.lunarLandingCapable ? 20 : 0) + (country.marsLandingCapable ? 20 : 0))
      : Math.min(20, score * 0.3),
    satelliteInfrastructure: Math.min(100, score * 0.85 + (hasStation ? 15 : 0)),
    groundInfrastructure: Math.min(100, score * 0.8 + (hasLaunch ? 20 : 0)),
    technologicalIndependence: hasLaunch
      ? Math.min(100, score * 0.9 + (hasReusable ? 10 : 0))
      : Math.min(40, score * 0.6),
  };
}

/**
 * Hook for detailed gap analysis between two countries
 */
export function useGapAnalysis(country1, country2) {
  const analysis = useMemo(() => {
    if (!country1 || !country2) return null;

    const scores1 = calculateCategoryScores(country1);
    const scores2 = calculateCategoryScores(country2);

    // Calculate gaps for each category
    const categoryGaps = CAPABILITY_CATEGORIES.map(category => {
      const score1 = scores1[category.key] || 0;
      const score2 = scores2[category.key] || 0;
      const gap = score1 - score2;
      const absGap = Math.abs(gap);
      const percentageGap = score2 > 0 ? ((score1 - score2) / score2 * 100) : (score1 > 0 ? 100 : 0);

      return {
        category: category.label,
        key: category.key,
        weight: category.weight,
        country1Score: score1,
        country2Score: score2,
        gap,
        absGap,
        percentageGap,
        leader: gap > 0 ? country1.name : gap < 0 ? country2.name : 'Tied',
        significance: absGap > 30 ? 'critical' : absGap > 15 ? 'significant' : absGap > 5 ? 'moderate' : 'minimal',
      };
    });

    // Overall gap
    const overallScore1 = country1.overallCapabilityScore || 0;
    const overallScore2 = country2.overallCapabilityScore || 0;
    const overallGap = overallScore1 - overallScore2;

    // Identify key differentiators
    const keyDifferentiators = categoryGaps
      .filter(g => g.absGap > 10)
      .sort((a, b) => b.absGap - a.absGap)
      .slice(0, 3);

    // Capability comparison
    const capabilityComparison = [
      {
        capability: 'Independent Launch',
        country1: country1.independentLaunchCapable,
        country2: country2.independentLaunchCapable
      },
      {
        capability: 'Human Spaceflight',
        country1: country1.humanSpaceflightCapable,
        country2: country2.humanSpaceflightCapable
      },
      {
        capability: 'Reusable Rockets',
        country1: country1.reusableRocketCapable,
        country2: country2.reusableRocketCapable
      },
      {
        capability: 'Deep Space',
        country1: country1.deepSpaceCapable,
        country2: country2.deepSpaceCapable
      },
      {
        capability: 'Space Station',
        country1: country1.spaceStationCapable,
        country2: country2.spaceStationCapable
      },
      {
        capability: 'Lunar Landing',
        country1: country1.lunarLandingCapable,
        country2: country2.lunarLandingCapable
      },
      {
        capability: 'Mars Landing',
        country1: country1.marsLandingCapable,
        country2: country2.marsLandingCapable
      },
    ];

    // Calculate capability advantage
    const country1Capabilities = capabilityComparison.filter(c => c.country1 && !c.country2).length;
    const country2Capabilities = capabilityComparison.filter(c => c.country2 && !c.country1).length;
    const sharedCapabilities = capabilityComparison.filter(c => c.country1 && c.country2).length;

    return {
      country1,
      country2,
      categoryGaps,
      overallGap,
      overallScore1,
      overallScore2,
      leader: overallGap > 0 ? country1.name : overallGap < 0 ? country2.name : 'Tied',
      keyDifferentiators,
      capabilityComparison,
      country1Capabilities,
      country2Capabilities,
      sharedCapabilities,
      gapSummary: getGapSummary(overallGap),
    };
  }, [country1, country2]);

  return { analysis };
}

/**
 * Get a textual summary of the gap
 */
function getGapSummary(gap) {
  const absGap = Math.abs(gap);
  if (absGap < 5) return 'Near Parity';
  if (absGap < 15) return 'Minor Gap';
  if (absGap < 30) return 'Moderate Gap';
  if (absGap < 50) return 'Significant Gap';
  return 'Major Gap';
}

/**
 * Hook for SWOT-style strengths and weaknesses analysis
 */
export function useStrengthsWeaknesses(country, allCountries) {
  const analysis = useMemo(() => {
    if (!country || !allCountries || allCountries.length === 0) return null;

    const scores = calculateCategoryScores(country);

    // Calculate global averages
    const globalAverages = {};
    CAPABILITY_CATEGORIES.forEach(category => {
      const total = allCountries.reduce((sum, c) => {
        const cScores = calculateCategoryScores(c);
        return sum + (cScores[category.key] || 0);
      }, 0);
      globalAverages[category.key] = total / allCountries.length;
    });

    // Calculate percentile ranks for each category
    const percentileRanks = {};
    CAPABILITY_CATEGORIES.forEach(category => {
      const allScores = allCountries.map(c => {
        const cScores = calculateCategoryScores(c);
        return cScores[category.key] || 0;
      }).sort((a, b) => a - b);

      const countryScore = scores[category.key] || 0;
      const rank = allScores.filter(s => s < countryScore).length;
      percentileRanks[category.key] = (rank / allScores.length) * 100;
    });

    // Categorize into strengths, weaknesses, opportunities, threats
    const strengths = [];
    const weaknesses = [];
    const opportunities = [];
    const threats = [];

    CAPABILITY_CATEGORIES.forEach(category => {
      const score = scores[category.key] || 0;
      const globalAvg = globalAverages[category.key];
      const percentile = percentileRanks[category.key];
      const diff = score - globalAvg;
      const diffPercent = globalAvg > 0 ? (diff / globalAvg) * 100 : 0;

      const item = {
        category: category.label,
        key: category.key,
        score,
        globalAverage: globalAvg,
        percentile,
        difference: diff,
        differencePercent: diffPercent,
      };

      // Strength: Above average with good percentile
      if (diff > 10 && percentile > 60) {
        strengths.push({
          ...item,
          type: 'strength',
          level: percentile > 80 ? 'major' : 'minor',
          description: getStrengthDescription(category.label, percentile, diffPercent),
        });
      }
      // Weakness: Below average
      else if (diff < -10 && percentile < 40) {
        weaknesses.push({
          ...item,
          type: 'weakness',
          level: percentile < 20 ? 'major' : 'minor',
          description: getWeaknessDescription(category.label, percentile, diffPercent),
        });
      }
      // Opportunity: Improving area or underperforming relative to potential
      else if (diff < 5 && score > 30 && percentile > 30 && percentile < 70) {
        opportunities.push({
          ...item,
          type: 'opportunity',
          description: getOpportunityDescription(category.label, score, globalAvg),
        });
      }
    });

    // Add capability-based insights
    if (!country.humanSpaceflightCapable && country.overallCapabilityScore > 40) {
      opportunities.push({
        category: 'Human Spaceflight',
        type: 'opportunity',
        description: 'Strong foundation exists for developing crewed space capability',
      });
    }

    if (!country.reusableRocketCapable && country.independentLaunchCapable) {
      opportunities.push({
        category: 'Reusability',
        type: 'opportunity',
        description: 'Launch capability provides foundation for reusable rocket development',
      });
    }

    // Threats based on competitive landscape
    const topCountries = [...allCountries]
      .sort((a, b) => (b.overallCapabilityScore || 0) - (a.overallCapabilityScore || 0))
      .slice(0, 5);

    const countryRank = allCountries
      .sort((a, b) => (b.overallCapabilityScore || 0) - (a.overallCapabilityScore || 0))
      .findIndex(c => c.id === country.id) + 1;

    if (countryRank > 1 && countryRank <= 5) {
      const leader = topCountries[0];
      if (leader && (leader.overallCapabilityScore - country.overallCapabilityScore) > 20) {
        threats.push({
          category: 'Competitive Position',
          type: 'threat',
          description: `${leader.name} maintains a ${Math.round(leader.overallCapabilityScore - country.overallCapabilityScore)} point lead in overall capability`,
        });
      }
    }

    // Calculate overall rating
    const overallRating = calculateOverallRating(strengths, weaknesses, country);

    return {
      country,
      scores,
      globalAverages,
      percentileRanks,
      strengths: strengths.sort((a, b) => b.percentile - a.percentile),
      weaknesses: weaknesses.sort((a, b) => a.percentile - b.percentile),
      opportunities,
      threats,
      overallRating,
      globalRank: countryRank,
      totalCountries: allCountries.length,
    };
  }, [country, allCountries]);

  return { analysis };
}

function getStrengthDescription(category, percentile, diffPercent) {
  if (percentile > 90) return `World-leading in ${category.toLowerCase()} (top 10%)`;
  if (percentile > 75) return `Excellent ${category.toLowerCase()} capabilities (top 25%)`;
  return `Above-average ${category.toLowerCase()} (${Math.round(diffPercent)}% above global average)`;
}

function getWeaknessDescription(category, percentile, diffPercent) {
  if (percentile < 10) return `Critical gap in ${category.toLowerCase()} (bottom 10%)`;
  if (percentile < 25) return `Significant weakness in ${category.toLowerCase()} (bottom 25%)`;
  return `Below-average ${category.toLowerCase()} (${Math.round(Math.abs(diffPercent))}% below global average)`;
}

function getOpportunityDescription(category, score, globalAvg) {
  return `${category} performance is near global average - focused investment could yield significant improvement`;
}

function calculateOverallRating(strengths, weaknesses, country) {
  const score = country.overallCapabilityScore || 0;
  const majorStrengths = strengths.filter(s => s.level === 'major').length;
  const majorWeaknesses = weaknesses.filter(w => w.level === 'major').length;

  if (score >= 80 && majorStrengths >= 2) return { rating: 'Excellent', color: 'green' };
  if (score >= 60 && majorStrengths >= 1) return { rating: 'Strong', color: 'blue' };
  if (score >= 40) return { rating: 'Developing', color: 'yellow' };
  if (score >= 20) return { rating: 'Emerging', color: 'orange' };
  return { rating: 'Early Stage', color: 'gray' };
}

/**
 * Hook for multi-country comparison matrix
 */
export function useComparisonMatrix(countries) {
  const matrix = useMemo(() => {
    if (!countries || countries.length < 2) return null;

    // Build comparison matrix
    const comparisons = [];

    for (let i = 0; i < countries.length; i++) {
      for (let j = i + 1; j < countries.length; j++) {
        const c1 = countries[i];
        const c2 = countries[j];
        const scores1 = calculateCategoryScores(c1);
        const scores2 = calculateCategoryScores(c2);

        const gap = (c1.overallCapabilityScore || 0) - (c2.overallCapabilityScore || 0);

        // Count category leads
        let c1Leads = 0;
        let c2Leads = 0;
        CAPABILITY_CATEGORIES.forEach(cat => {
          if ((scores1[cat.key] || 0) > (scores2[cat.key] || 0)) c1Leads++;
          else if ((scores2[cat.key] || 0) > (scores1[cat.key] || 0)) c2Leads++;
        });

        comparisons.push({
          country1: c1,
          country2: c2,
          gap,
          leader: gap > 0 ? c1.name : gap < 0 ? c2.name : 'Tied',
          country1CategoryLeads: c1Leads,
          country2CategoryLeads: c2Leads,
        });
      }
    }

    // Find the dominant country (most category leads overall)
    const leadCounts = {};
    comparisons.forEach(comp => {
      if (comp.gap !== 0) {
        const leader = comp.gap > 0 ? comp.country1.id : comp.country2.id;
        leadCounts[leader] = (leadCounts[leader] || 0) + 1;
      }
    });

    const dominantCountryId = Object.entries(leadCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0];
    const dominantCountry = countries.find(c => c.id === dominantCountryId);

    // Summary statistics
    const avgScore = countries.reduce((sum, c) => sum + (c.overallCapabilityScore || 0), 0) / countries.length;
    const maxScore = Math.max(...countries.map(c => c.overallCapabilityScore || 0));
    const minScore = Math.min(...countries.map(c => c.overallCapabilityScore || 0));
    const scoreRange = maxScore - minScore;

    return {
      countries,
      comparisons,
      dominantCountry,
      statistics: {
        avgScore,
        maxScore,
        minScore,
        scoreRange,
        competitiveness: scoreRange < 20 ? 'High' : scoreRange < 40 ? 'Moderate' : 'Low',
      },
    };
  }, [countries]);

  return { matrix };
}

export default {
  useGapAnalysis,
  useStrengthsWeaknesses,
  useComparisonMatrix,
};
