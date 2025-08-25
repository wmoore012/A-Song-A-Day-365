import { useState, useCallback } from 'react';

export type Phase = 'HOOK' | 'SETUP' | 'EXECUTION' | 'WRAP_UP';

interface PhaseState {
  showAtomOrbit: boolean;
  showAudioVisualizer: boolean;
  showAudioControls: boolean;
  showEnhancedBarChart: boolean;
  showVillainNudges: boolean;
}

const PHASE_CONFIG: Record<Phase, PhaseState> = {
  HOOK: {
    showAtomOrbit: true,
    showAudioVisualizer: false,
    showAudioControls: false,
    showEnhancedBarChart: false,
    showVillainNudges: true,
  },
  SETUP: {
    showAtomOrbit: false,
    showAudioVisualizer: false,
    showAudioControls: true,
    showEnhancedBarChart: false,
    showVillainNudges: true,
  },
  EXECUTION: {
    showAtomOrbit: false,
    showAudioVisualizer: true,
    showAudioControls: true,
    showEnhancedBarChart: false,
    showVillainNudges: true,
  },
  WRAP_UP: {
    showAtomOrbit: false,
    showAudioVisualizer: false,
    showAudioControls: true,
    showEnhancedBarChart: true,
    showVillainNudges: false,
  },
};

export function usePhase() {
  const [currentPhase, setCurrentPhase] = useState<Phase>('HOOK');
  const phaseState = PHASE_CONFIG[currentPhase];

  const setPhase = useCallback((phase: Phase) => {
    setCurrentPhase(phase);
  }, []);

  return {
    phase: currentPhase,
    setPhase,
    ...phaseState,
  };
}
