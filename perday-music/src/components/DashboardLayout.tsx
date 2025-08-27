import { ReactNode, useRef, useEffect } from 'react';
import PremiumSidebar from './PremiumSidebar';
import SocialDock from './SocialDock';
import InventoryCounter from './InventoryCounter';
import Notepad from './Notepad';
import GlassNavigationDock, { setNotepadRef } from './GlassNavigationDock';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const notepadRef = useRef<{ open: () => void }>(null);

  useEffect(() => {
    setNotepadRef(notepadRef.current);
  }, []);

  return (
    <div className="flex h-screen bg-black">
      <PremiumSidebar />
      <main className="flex-1 overflow-auto relative">
        {children}
      </main>

      {/* Social Dock */}
      <SocialDock />

      {/* Inventory Counter */}
      <InventoryCounter />

      {/* Notepad */}
      <Notepad ref={notepadRef} />

      {/* Premium Glass Navigation Dock */}
      <GlassNavigationDock />
    </div>
  );
}
