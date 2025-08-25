import { ReactNode } from 'react';
import PremiumSidebar from './PremiumSidebar';
import SocialDock from './SocialDock';
import InventoryCounter from './InventoryCounter';
import Notepad from './Notepad';
import ProfileAvatar from './ProfileAvatar';

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
      
      {/* Profile Avatar */}
      <div className="fixed bottom-6 left-6 z-50">
        <ProfileAvatar size="md" />
      </div>
    </div>
  );
}
