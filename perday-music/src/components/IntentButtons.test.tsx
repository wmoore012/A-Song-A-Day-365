import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import IntentButtons from './IntentButtons';
import * as demoMode from '../utils/demoMode';

// Mock Supabase
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    auth: {
      signInWithOAuth: vi.fn().mockResolvedValue({
        data: { url: 'https://supabase.com/oauth' },
        error: null
      })
    }
  })
}));

// Mock demo mode utilities
vi.mock('../utils/demoMode', () => ({
  setDemoConfig: vi.fn(),
  IntentType: {
    songs: 'songs',
    produce: 'produce',
    riffs: 'riffs',
    mixes: 'mixes'
  }
}));

// Mock window.location
const mockLocation = {
  href: '',
  origin: 'http://localhost:5173'
};
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('IntentButtons', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocation.href = '';
  });

      it('renders all four intent buttons', () => {
    renderWithRouter(<IntentButtons />);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4);

    // Check that each button contains the expected content
    expect(buttons[0]).toHaveTextContent('🎵 Write 1 Song Per Day ✨');
    expect(buttons[1]).toHaveTextContent('🎧 Produce 1 Song Per Day 🚀');
    expect(buttons[2]).toHaveTextContent('🎸 Make 1 Riff Per Day 🔥');
    expect(buttons[3]).toHaveTextContent('🎚️ Do 1 Mix Per Day ⚡');
  });

  it('displays "1" with Permanent Marker font styling', () => {
    renderWithRouter(<IntentButtons />);

    const ones = screen.getAllByText('1');
    expect(ones).toHaveLength(4);

    ones.forEach(one => {
      expect(one).toHaveClass('font-permanent-marker', 'text-3xl', 'italic');
    });
  });

  it('calls setDemoConfig with intent when button is clicked', async () => {
    renderWithRouter(<IntentButtons />);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4);

    fireEvent.click(buttons[0]); // Click first button (Write)

    await waitFor(() => {
      expect(demoMode.setDemoConfig).toHaveBeenCalledWith({ intent: 'songs' });
    });
  });

  it('handles OAuth flow for each intent type', async () => {
    renderWithRouter(<IntentButtons />);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4);

    // Test each button
    const intents = ['songs', 'produce', 'riffs', 'mixes'];

    for (let i = 0; i < buttons.length; i++) {
      vi.clearAllMocks();
      fireEvent.click(buttons[i]);

      await waitFor(() => {
        expect(demoMode.setDemoConfig).toHaveBeenCalledWith({ intent: intents[i] });
      });
    }
  });

  it('applies correct gradient classes to each button', () => {
    renderWithRouter(<IntentButtons />);

    // Check that gradient divs are present with correct classes
    const gradientDivs = screen.getAllByRole('button').map(button =>
      button.querySelector('div[class*="bg-gradient-to-r"]')
    );

    expect(gradientDivs[0]).toHaveClass('from-cyan-500', 'to-purple-600');
    expect(gradientDivs[1]).toHaveClass('from-purple-500', 'to-pink-600');
    expect(gradientDivs[2]).toHaveClass('from-pink-500', 'to-red-600');
    expect(gradientDivs[3]).toHaveClass('from-red-500', 'to-orange-600');
  });

  it('has proper spacing between buttons', () => {
    renderWithRouter(<IntentButtons />);

    const container = screen.getAllByRole('button')[0].parentElement;
    expect(container).toHaveClass('gap-6');
  });
});
