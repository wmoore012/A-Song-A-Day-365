import { useAppStore } from '../store/store';
import { getDemoData } from '../utils/demoData';

export const useDemoMode = () => {
  const store = useAppStore();
  const isDemoMode = store.isDemoMode;
  
  // Get demo data or real data based on mode
  const getData = () => {
    if (isDemoMode) {
      const demoData = getDemoData();
      return {
        inventory: demoData.inventory,
        session: { ...store.session, ...demoData.session },
        settings: { ...store.settings, ...demoData.settings },
        streak: demoData.streak,
        freezes: demoData.freezes,
        grades: demoData.grades,
        latencies: demoData.latencies
      };
    }
    
    return {
      inventory: store.inventory,
      session: store.session,
      settings: store.settings,
      streak: store.streak,
      freezes: store.freezes,
      grades: store.grades,
      latencies: store.latencies
    };
  };
  
  return {
    isDemoMode,
    enableDemoMode: store.enableDemoMode,
    disableDemoMode: store.disableDemoMode,
    getData,
    // Direct access to store methods
    dispatch: store.dispatch,
    setSettings: store.setSettings,
    addToInventory: store.addToInventory
  };
};
