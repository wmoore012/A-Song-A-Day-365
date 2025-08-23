import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('app-main')).toBeInTheDocument();
  });

  it('shows page visibility badge when page is hidden', () => {
    // Mock document.hidden to true to test the badge
    Object.defineProperty(document, 'hidden', {
      writable: true,
      value: true,
    });
    render(<App />);
    expect(screen.getByTestId('page-visibility-badge')).toBeInTheDocument();
  });

  it('shows prestart panel', () => {
    render(<App />);
    expect(screen.getByTestId('prestart-panel')).toBeInTheDocument();
  });

  it('shows audio hud', () => {
    render(<App />);
    expect(screen.getByText('Music & Room Tone')).toBeInTheDocument();
  });
});
