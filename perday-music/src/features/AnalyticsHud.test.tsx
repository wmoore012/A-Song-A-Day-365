import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AnalyticsHud } from './AnalyticsHud';

describe('AnalyticsHud', () => {
  it('shows Day 0 state when no data', () => {
    render(<AnalyticsHud grades={[]} latencies={[]} />);
    expect(screen.getByText('📊 Your Legacy Starts Tomorrow')).toBeInTheDocument();
    expect(screen.getByText('Lock in to start building your stats')).toBeInTheDocument();
  });

  it('shows Day 1 celebration when first data point', () => {
    render(<AnalyticsHud grades={[85]} latencies={[1200]} />);
    expect(screen.getByText('🎉 The First One\'s On The Board!')).toBeInTheDocument();
    expect(screen.getByText('Now do it again')).toBeInTheDocument();
    expect(screen.getByText('First Grade: 85%')).toBeInTheDocument();
    expect(screen.getByText('First Latency: 1200ms')).toBeInTheDocument();
  });

  it('shows regular charts for multiple data points', () => {
    render(<AnalyticsHud grades={[85, 92, 78]} latencies={[1200, 800, 1500]} />);
    expect(screen.getByText('Grades & latency (last 14 sessions)')).toBeInTheDocument();
  });
});
