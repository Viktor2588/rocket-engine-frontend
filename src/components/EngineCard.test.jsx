import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../test/test-utils';
import EngineCard from './EngineCard';
import { mockEngines } from '../test/setup';

describe('EngineCard', () => {
  const mockEngine = mockEngines[0];

  it('should render engine name', () => {
    render(<EngineCard engine={mockEngine} />);

    expect(screen.getByText(mockEngine.name)).toBeInTheDocument();
  });

  it('should render designer name', () => {
    render(<EngineCard engine={mockEngine} />);

    expect(screen.getByText(mockEngine.designer)).toBeInTheDocument();
  });

  it('should display propellant type', () => {
    render(<EngineCard engine={mockEngine} />);

    expect(screen.getByText(mockEngine.propellant)).toBeInTheDocument();
  });

  it('should display engine status', () => {
    render(<EngineCard engine={mockEngine} />);

    expect(screen.getByText(mockEngine.status)).toBeInTheDocument();
  });

  it('should display ISP value', () => {
    render(<EngineCard engine={mockEngine} />);

    // ISP should be displayed somewhere in the card
    const ispText = `${mockEngine.isp}`;
    expect(screen.getByText(ispText, { exact: false })).toBeInTheDocument();
  });

  it('should show reusable badge for reusable engines', () => {
    const reusableEngine = { ...mockEngine, reusable: true };
    render(<EngineCard engine={reusableEngine} />);

    // Card should render with reusable badge (contains emoji + Reusable text)
    expect(screen.getByText(/Reusable/)).toBeInTheDocument();
  });

  it('should handle engine without optional fields', () => {
    const minimalEngine = {
      id: 99,
      name: 'Test Engine',
      designer: 'Test Designer',
      type: 'Test Type',
      isp: 300,
      twr: 100,
      propellant: 'LOX/RP-1',
    };

    render(<EngineCard engine={minimalEngine} />);

    expect(screen.getByText('Test Engine')).toBeInTheDocument();
  });

  it('should render a link to engine details', () => {
    render(<EngineCard engine={mockEngine} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/engines/${mockEngine.id}`);
  });
});
