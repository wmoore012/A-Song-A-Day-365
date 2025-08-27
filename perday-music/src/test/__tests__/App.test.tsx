import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../../App';

// Mock the store to force hydrated state
vi.mock('../../store/store', () => ({
  useAppStore: () => ({
          session: { state: "DASHBOARD", readyPressed: false },
    settings: {
      defaultDuration: 25,
      defaultMultiplier: 1.5,
      autoStartTimer: true,
      soundEnabled: false,
      volume: 0.7,
      notifications: true,
      accountabilityEmail: '',
      userName: '',
      collaborators: ''
    },
    _hydrated: true, // Force hydrated to true
    dispatch: vi.fn(),
    setSettings: vi.fn(),
  })
}));

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('app-main')).toBeInTheDocument();
  });

  it('shows LandingPage for new users', () => {
    render(<App />);
    expect(screen.getByText(/Perday: Music/)).toBeInTheDocument();
    expect(screen.getByText(/Stop procrastinating/)).toBeInTheDocument();
  });
});
