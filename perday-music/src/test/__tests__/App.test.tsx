import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../../App';

// Mock the store to force hydrated state
vi.mock('../../store/store', () => ({
  useAppStore: () => ({
    session: { state: "PRE_START", readyPressed: false },
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

  it('shows page visibility badge when page is hidden', () => {
    Object.defineProperty(document, 'hidden', {
      writable: true,
      value: true,
    });

    render(<App />);
    expect(screen.getByTestId('page-visibility-badge')).toBeInTheDocument();
  });

  it('shows StartHero initially', () => {
    render(<App />);
    expect(screen.getByText('7-minute Pre-Start to get your mind right.')).toBeInTheDocument();
  });
});
