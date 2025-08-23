import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import VillainDisplay from './VillainDisplay';
import { _fxEmit } from '../features/fx/useVillainAnnounce';

describe('VillainDisplay', () => {
  beforeEach(() => {
    // Clear any existing messages
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<VillainDisplay />);
    expect(document.body).toBeInTheDocument();
  });

  it('displays villain nudge messages', async () => {
    render(<VillainDisplay />);
    
    // Trigger a villain nudge
    await act(async () => {
      _fxEmit('villain-nudge', { msg: 'Test villain message!' });
    });
    
    // Check if message appears
    expect(screen.getByText('Test villain message!')).toBeInTheDocument();
  });

  it('displays different message types with correct styling', async () => {
    render(<VillainDisplay />);

    // Test different message types using toast events
    await act(async () => {
      _fxEmit('toast', { msg: 'Success message', type: 'success' });
      _fxEmit('toast', { msg: 'Error message', type: 'error' });
      _fxEmit('toast', { msg: 'Info message', type: 'info' });
    });

    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.getByText('Info message')).toBeInTheDocument();
  });

  it('spawns devil heads for villain-nudge messages', async () => {
    render(<VillainDisplay />);
    
    // Trigger villain nudge
    await act(async () => {
      _fxEmit('villain-nudge', { msg: 'Devil heads should spawn!' });
    });
    
    // Check if devil heads are created (they should be in the DOM)
    const devilHeads = document.querySelectorAll('.text-4xl');
    expect(devilHeads.length).toBeGreaterThan(0);
  });

  it('auto-removes messages after 5 seconds', async () => {
    vi.useFakeTimers();
    
    render(<VillainDisplay />);
    
    // Trigger a message
    await act(async () => {
      _fxEmit('villain-nudge', { msg: 'Temporary message' });
    });
    
    // Message should be visible
    expect(screen.getByText('Temporary message')).toBeInTheDocument();
    
    // Fast forward 5 seconds
    await act(async () => {
      vi.advanceTimersByTime(5000);
    });
    
    // Message should be removed
    expect(screen.queryByText('Temporary message')).not.toBeInTheDocument();
    
    vi.useRealTimers();
  });
});
