import { ReactNode } from 'react';
import { useSessionStore } from '../state/store';
import { FlowState } from '../state/types';
import StartHero from './StartHero';
import DashboardLayout from './DashboardLayout';
import VillainDisplay from './VillainDisplay';

interface GateLayoutProps {
  children: ReactNode;
}

export default function GateLayout({ children }: GateLayoutProps) {
  const state = useSessionStore(s => s.session.state);

  // Only allow dashboard AFTER POST_ACTIONS
  const canSeeDashboard = state === FlowState.POST_ACTIONS;

  return (
    <>
      {/* Villain Display - always visible */}
      <VillainDisplay />
      
      {!canSeeDashboard ? (
        <StartHero /> // full-screen wizard
      ) : (
        <DashboardLayout>{children}</DashboardLayout>
      )}
    </>
  );
}
