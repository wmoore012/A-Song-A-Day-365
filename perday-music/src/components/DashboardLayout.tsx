import { ReactNode } from 'react';
import PremiumSidebar from './PremiumSidebar';

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
    </div>
  );
}
