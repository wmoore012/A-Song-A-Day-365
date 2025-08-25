import { ReactNode } from 'react';
import { Toaster } from "./ui/sonner";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <main className="relative flex min-h-screen flex-col">
        <div className="flex-1">
          {children}
        </div>
      </main>
      <Toaster richColors position="top-center" />
    </div>
  );
}
