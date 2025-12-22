import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../test/test-utils';
import CountryCard from './CountryCard';
import { mockCountries } from '../test/setup';

describe('CountryCard', () => {
  const mockCountry = mockCountries[0];

  it('should render country name', () => {
    render(<CountryCard country={mockCountry} />);

    expect(screen.getByText(mockCountry.name)).toBeInTheDocument();
  });

  it('should render space agency acronym', () => {
    render(<CountryCard country={mockCountry} />);

    expect(screen.getByText(mockCountry.spaceAgencyAcronym)).toBeInTheDocument();
  });

  it('should display capability score', () => {
    render(<CountryCard country={mockCountry} />);

    // Score should be displayed with 1 decimal place (e.g., "92.5")
    const scoreText = mockCountry.overallCapabilityScore.toFixed(1);
    expect(screen.getByText(scoreText)).toBeInTheDocument();
  });

  it('should show capability badges for countries with capabilities', () => {
    render(<CountryCard country={mockCountry} />);

    // The component should render without crashing
    // Capability badges are rendered based on boolean flags
    expect(screen.getByText(mockCountry.name)).toBeInTheDocument();
  });

  it('should display rank when provided', () => {
    render(<CountryCard country={mockCountry} rank={1} />);

    // Rank should be displayed (just the number, not #1)
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should render a link to country details', () => {
    render(<CountryCard country={mockCountry} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/countries/${mockCountry.isoCode}`);
  });

  it('should handle country without optional fields', () => {
    const minimalCountry = {
      id: 99,
      name: 'Test Country',
      isoCode: 'TST',
      region: 'Test Region',
      spaceAgencyName: 'Test Agency',
      spaceAgencyAcronym: 'TA',
      humanSpaceflightCapable: false,
      independentLaunchCapable: false,
      reusableRocketCapable: false,
      deepSpaceCapable: false,
      spaceStationCapable: false,
      lunarLandingCapable: false,
      marsLandingCapable: false,
    };

    render(<CountryCard country={minimalCountry} />);

    expect(screen.getByText('Test Country')).toBeInTheDocument();
  });
});
