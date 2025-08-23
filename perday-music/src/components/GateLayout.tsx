import { ReactNode } from 'react';
import { useSessionStore } from '../state/store';
import { FlowState } from '../state/types';
import StartHero from './StartHero';
import DashboardLayout from './DashboardLayout';

interface GateLayoutProps {
  children: ReactNode;
}

export default function GateLayout({ children }: GateLayoutProps) {
  const state = useSessionStore(s => s.session.state);

  // Only allow dashboard AFTER POST_ACTIONS
  const canSeeDashboard = state === FlowState.POST_ACTIONS;

  if (!canSeeDashboard) {
    return <StartHero />; // full-screen wizard
  }
  
  return <DashboardLayout>{children}</DashboardLayout>;
}
