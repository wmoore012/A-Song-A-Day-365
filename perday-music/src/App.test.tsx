import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

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
