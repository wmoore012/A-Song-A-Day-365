import { ReactNode } from 'react';
import PremiumSidebar from './PremiumSidebar';
import SocialDock from './SocialDock';
import InventoryCounter from './InventoryCounter';
import Notepad from './Notepad';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
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
      <Notepad />
    </div>
  );
}
