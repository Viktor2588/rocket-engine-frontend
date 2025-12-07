/**
 * SpaceIcons - Material UI icon wrapper components for space-related icons
 * Replaces emoji usage throughout the application with Material Icons
 */
import React from 'react';
import {
  Rocket,
  Public,
  Satellite,
  SatelliteAlt,
  FlightTakeoff,
  Science,
  Engineering,
  EmojiEvents,
  TrendingUp,
  TrendingDown,
  Assessment,
  Analytics,
  Speed,
  LocalFireDepartment,
  Bolt,
  NightlightRound,
  WbSunny,
  Star,
  StarBorder,
  CheckCircle,
  Cancel,
  Warning,
  Info,
  Settings,
  Build,
  Factory,
  LocationOn,
  Map,
  CalendarToday,
  Group,
  Person,
  PersonOutline,
  AttachMoney,
  Description,
  MilitaryTech,
  Shield,
  Explore,
  Timeline,
  Radar,
  Visibility,
  GpsFixed,
  AdsClick,
  DarkMode,
  LightMode,
  BarChart,
  PieChart,
  Hub,
  Memory,
  Recycling,
  Flag,
  Construction,
  History,
  Leaderboard,
  RocketLaunch,
} from '@mui/icons-material';

// Icon size presets
const SIZES = {
  xs: { fontSize: '0.875rem' },
  sm: { fontSize: '1rem' },
  md: { fontSize: '1.25rem' },
  lg: { fontSize: '1.5rem' },
  xl: { fontSize: '2rem' },
  '2xl': { fontSize: '2.5rem' },
  '3xl': { fontSize: '3rem' },
  '4xl': { fontSize: '4rem' },
  inherit: { fontSize: 'inherit' },
};

// Wrapper component for consistent styling
const IconWrapper = ({ icon: IconComponent, size = 'md', className = '', style = {}, title, ...props }) => {
  const sizeStyle = typeof size === 'string' ? SIZES[size] || SIZES.md : { fontSize: size };
  return (
    <IconComponent
      className={className}
      style={{ ...sizeStyle, verticalAlign: 'middle', ...style }}
      titleAccess={title}
      {...props}
    />
  );
};

// Space-related icons
export const RocketIcon = (props) => <IconWrapper icon={Rocket} {...props} />;
export const SatelliteIcon = (props) => <IconWrapper icon={SatelliteAlt} {...props} />;
export const SatelliteOrbitalIcon = (props) => <IconWrapper icon={Satellite} {...props} />;
export const GlobeIcon = (props) => <IconWrapper icon={Public} {...props} />;
export const LaunchIcon = (props) => <IconWrapper icon={FlightTakeoff} {...props} />;
export const MoonIcon = (props) => <IconWrapper icon={NightlightRound} {...props} />;
export const SunIcon = (props) => <IconWrapper icon={WbSunny} {...props} />;
export const StarIcon = (props) => <IconWrapper icon={Star} {...props} />;
export const StarOutlineIcon = (props) => <IconWrapper icon={StarBorder} {...props} />;
export const ExploreIcon = (props) => <IconWrapper icon={Explore} {...props} />;
export const RadarIcon = (props) => <IconWrapper icon={Radar} {...props} />;

// Science & Technology icons
export const ScienceIcon = (props) => <IconWrapper icon={Science} {...props} />;
export const EngineeringIcon = (props) => <IconWrapper icon={Engineering} {...props} />;
export const EngineIcon = (props) => <IconWrapper icon={LocalFireDepartment} {...props} />;
export const BoltIcon = (props) => <IconWrapper icon={Bolt} {...props} />;
export const SpeedIcon = (props) => <IconWrapper icon={Speed} {...props} />;
export const SettingsIcon = (props) => <IconWrapper icon={Settings} {...props} />;
export const BuildIcon = (props) => <IconWrapper icon={Build} {...props} />;
export const FactoryIcon = (props) => <IconWrapper icon={Factory} {...props} />;
export const MemoryIcon = (props) => <IconWrapper icon={Memory} {...props} />;
export const RecyclingIcon = (props) => <IconWrapper icon={Recycling} {...props} />;

// Status & Analytics icons
export const TrophyIcon = (props) => <IconWrapper icon={EmojiEvents} {...props} />;
export const TrendUpIcon = (props) => <IconWrapper icon={TrendingUp} {...props} />;
export const TrendDownIcon = (props) => <IconWrapper icon={TrendingDown} {...props} />;
export const ChartIcon = (props) => <IconWrapper icon={Assessment} {...props} />;
export const AnalyticsIcon = (props) => <IconWrapper icon={Analytics} {...props} />;
export const BarChartIcon = (props) => <IconWrapper icon={BarChart} {...props} />;
export const PieChartIcon = (props) => <IconWrapper icon={PieChart} {...props} />;
export const TargetIcon = (props) => <IconWrapper icon={GpsFixed} {...props} />;
export const AimIcon = (props) => <IconWrapper icon={AdsClick} {...props} />;

// Feedback icons
export const CheckIcon = (props) => <IconWrapper icon={CheckCircle} {...props} />;
export const ErrorIcon = (props) => <IconWrapper icon={Cancel} {...props} />;
export const WarningIcon = (props) => <IconWrapper icon={Warning} {...props} />;
export const InfoIcon = (props) => <IconWrapper icon={Info} {...props} />;

// Location & Navigation icons
export const LocationIcon = (props) => <IconWrapper icon={LocationOn} {...props} />;
export const MapIcon = (props) => <IconWrapper icon={Map} {...props} />;
export const CalendarIcon = (props) => <IconWrapper icon={CalendarToday} {...props} />;
export const TimelineIcon = (props) => <IconWrapper icon={Timeline} {...props} />;
export const HubIcon = (props) => <IconWrapper icon={Hub} {...props} />;

// People & Organizations icons
export const GroupIcon = (props) => <IconWrapper icon={Group} {...props} />;
export const PersonIcon = (props) => <IconWrapper icon={Person} {...props} />;
export const AstronautIcon = (props) => <IconWrapper icon={PersonOutline} {...props} />;

// Military & Money icons
export const MilitaryIcon = (props) => <IconWrapper icon={MilitaryTech} {...props} />;
export const ShieldIcon = (props) => <IconWrapper icon={Shield} {...props} />;
export const MoneyIcon = (props) => <IconWrapper icon={AttachMoney} {...props} />;
export const DocumentIcon = (props) => <IconWrapper icon={Description} {...props} />;

// Theme icons
export const DarkModeIcon = (props) => <IconWrapper icon={DarkMode} {...props} />;
export const LightModeIcon = (props) => <IconWrapper icon={LightMode} {...props} />;

// Observation icons
export const VisibilityIcon = (props) => <IconWrapper icon={Visibility} {...props} />;

// Location & Navigation icons - additional exports
export const FlagIcon = (props) => <IconWrapper icon={Flag} {...props} />;
export const ConstructionIcon = (props) => <IconWrapper icon={Construction} {...props} />;
export const HistoryIcon = (props) => <IconWrapper icon={History} {...props} />;
export const StatsIcon = (props) => <IconWrapper icon={Leaderboard} {...props} />;
export const LaunchpadIcon = (props) => <IconWrapper icon={RocketLaunch} {...props} />;

// Icon name to component mapping for dynamic rendering
export const ICON_MAP = {
  // Emoji to Icon mappings
  'rocket': RocketIcon,
  'satellite': SatelliteIcon,
  'satellite-orbital': SatelliteOrbitalIcon,
  'globe': GlobeIcon,
  'earth': GlobeIcon,
  'launch': LaunchIcon,
  'moon': MoonIcon,
  'sun': SunIcon,
  'star': StarIcon,
  'explore': ExploreIcon,
  'radar': RadarIcon,
  'science': ScienceIcon,
  'engineering': EngineeringIcon,
  'engine': EngineIcon,
  'fire': EngineIcon,
  'bolt': BoltIcon,
  'lightning': BoltIcon,
  'speed': SpeedIcon,
  'settings': SettingsIcon,
  'build': BuildIcon,
  'wrench': BuildIcon,
  'factory': FactoryIcon,
  'memory': MemoryIcon,
  'recycling': RecyclingIcon,
  'trophy': TrophyIcon,
  'medal': TrophyIcon,
  'trend-up': TrendUpIcon,
  'trend-down': TrendDownIcon,
  'chart': ChartIcon,
  'bar-chart': BarChartIcon,
  'analytics': AnalyticsIcon,
  'target': TargetIcon,
  'aim': AimIcon,
  'check': CheckIcon,
  'success': CheckIcon,
  'error': ErrorIcon,
  'cancel': ErrorIcon,
  'warning': WarningIcon,
  'info': InfoIcon,
  'location': LocationIcon,
  'map': MapIcon,
  'calendar': CalendarIcon,
  'timeline': TimelineIcon,
  'hub': HubIcon,
  'group': GroupIcon,
  'team': GroupIcon,
  'person': PersonIcon,
  'astronaut': AstronautIcon,
  'crew': AstronautIcon,
  'military': MilitaryIcon,
  'shield': ShieldIcon,
  'money': MoneyIcon,
  'budget': MoneyIcon,
  'document': DocumentIcon,
  'dark-mode': DarkModeIcon,
  'light-mode': LightModeIcon,
  'visibility': VisibilityIcon,
  'flag': FlagIcon,
  'construction': ConstructionIcon,
  'history': HistoryIcon,
  'stats': StatsIcon,
  'leaderboard': StatsIcon,
  'launchpad': LaunchpadIcon,
  'launch-site': LaunchpadIcon,
};

/**
 * Dynamic icon component that renders based on icon name
 * @param {string} name - Icon name from ICON_MAP
 * @param {object} props - Props passed to icon component
 */
export const SpaceIcon = ({ name, ...props }) => {
  const IconComponent = ICON_MAP[name?.toLowerCase()];
  if (!IconComponent) {
    console.warn(`SpaceIcon: Unknown icon name "${name}"`);
    return <RocketIcon {...props} />;
  }
  return <IconComponent {...props} />;
};

/**
 * Utility function to get icon component by name
 * @param {string} name - Icon name
 * @returns {React.Component} Icon component
 */
export const getIconComponent = (name) => {
  return ICON_MAP[name?.toLowerCase()] || RocketIcon;
};

export default SpaceIcon;
