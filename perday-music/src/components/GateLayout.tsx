import { ReactNode } from 'react';
import { useSessionStore } from '../state/store';
import { FlowState } from '../state/types';
import StartHero from './StartHero';
import LockInMenu from './LockInMenu';
import FocusSetup from './FocusSetup';
import FocusRunning from './FocusRunning';
import DashboardLayout from './DashboardLayout';
import VillainDisplay from './VillainDisplay';

interface GateLayoutProps {
  children: ReactNode;
}

export default function GateLayout({ children }: GateLayoutProps) {
  const state = useSessionStore(s => s.session.state);

  // Only allow dashboard AFTER POST_ACTIONS
  const canSeeDashboard = state === FlowState.POST_ACTIONS;

  const renderFlowComponent = () => {
    switch (state) {
      case FlowState.PRE_START:
        return <StartHero />;
      case FlowState.LOCK_IN:
        return <LockInMenu />;
      case FlowState.FOCUS_SETUP:
        return <FocusSetup />;
      case FlowState.FOCUS_RUNNING:
        return <FocusRunning />;
      case FlowState.CHECKPOINT:
      case FlowState.SELF_RATE:
      case FlowState.RECAP:
      case FlowState.REWARD_GATE:
        return <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-synth-white text-2xl">Coming Soon: {state}</div>
        </div>;
      default:
        return <StartHero />;
    }
  };

  return (
    <>
      {/* Villain Display - always visible */}
      <VillainDisplay />
      
      {!canSeeDashboard ? (
        renderFlowComponent()
      ) : (
        <DashboardLayout>{children}</DashboardLayout>
      )}
    </>
  );
}
