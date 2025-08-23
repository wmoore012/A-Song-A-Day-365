import { useState, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { 
  BarChart2, 
  Zap, 
  Target, 
  Settings, 
  Music, 
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import PerdayLogo from './PerdayLogo';

gsap.registerPlugin(useGSAP);

function NavItem({ icon: Icon, label, active, collapsed }: { 
  icon: any; 
  label: string; 
  active: boolean; 
  collapsed: boolean;
}) {
  const itemRef = useRef<HTMLButtonElement>(null);

  useGSAP(() => {
    if (!itemRef.current) return;
    
    // Force animations in dev/tests, only respect reduced motion in production
    const shouldAnimate = 
      import.meta?.env?.MODE !== 'test' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
        ? false
        : true;
    
    if (!shouldAnimate) return;
    
    gsap.fromTo(itemRef.current, 
      { opacity: 0, x: -10 }, 
      { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" }
    );
  }, []);

  return (
    <button
      ref={itemRef}
      className={`w-full px-3 py-2 rounded-lg transition-all duration-300 flex items-center space-x-3 text-sm font-medium ${
        active 
          ? 'bg-gradient-to-r from-synth-violet/30 to-synth-magenta/20 text-synth-white shadow-[0_0_15px_rgba(108,26,237,0.2)]' 
          : 'text-synth-violet hover:bg-synth-violet/10 hover:text-synth-violet/80 hover:shadow-[0_0_10px_rgba(108,26,237,0.1)]'
      }`}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      {!collapsed && <span className="font-medium">{label}</span>}
    </button>
  );
}

export default function PremiumSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const lightBarRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sidebarRef.current || !lightBarRef.current) return;
    
    // Force animations in dev/tests, only respect reduced motion in production
    const shouldAnimate = 
      import.meta?.env?.MODE !== 'test' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
        ? false
        : true;
    
    if (!shouldAnimate) return;

    // Entrance animation
    gsap.fromTo(sidebarRef.current, 
      { x: -100, opacity: 0 }, 
      { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
    );

    // Light bar pulse
    gsap.to(lightBarRef.current, {
      opacity: 0.3,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });
  }, []);

  return (
    <div 
      ref={sidebarRef}
      className={`fixed left-0 top-0 h-full bg-[#DFD9E2] backdrop-blur-xl transition-[width] duration-300 shadow-2xl ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Light Bar */}
      <div 
        ref={lightBarRef}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-48 rounded-full bg-gradient-to-b from-synth-violet via-synth-magenta via-synth-white via-synth-icy to-synth-aqua shadow-[0_0_20px_rgba(178,235,255,0.5)]"
      ></div>
      
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-synth-violet/10 to-synth-aqua/10">
        <div className="flex items-center justify-between">
          {!collapsed ? (
            <PerdayLogo size={40} />
          ) : (
            <PerdayLogo size={32} showText={false} />
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg bg-synth-violet/20 hover:bg-synth-violet/30 text-synth-icy transition-all duration-300 hover:shadow-[0_0_15px_rgba(108,26,237,0.3)]"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-6 space-y-3">
        {!collapsed && (
          <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-synth-violet/70">
            Studio
          </div>
        )}
        <NavItem icon={Music} label="Studio" active={true} collapsed={collapsed} />
        <NavItem icon={BarChart2} label="Analytics" active={false} collapsed={collapsed} />
        <NavItem icon={Zap} label="Cookups" active={false} collapsed={collapsed} />
        
        {!collapsed && (
          <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-synth-violet/70 mt-6">
            Progress
          </div>
        )}
        <NavItem icon={Target} label="Goals" active={false} collapsed={collapsed} />
        <NavItem icon={Settings} label="Settings" active={false} collapsed={collapsed} />
      </nav>

      {/* Quick Stats */}
      {!collapsed && (
        <div className="p-6 mt-auto bg-gradient-to-t from-synth-violet/5 to-transparent">
          <div className="space-y-4">
            <div className="text-synth-violet text-sm font-semibold uppercase tracking-wider">Today's Progress</div>
            <div className="bg-gradient-to-r from-synth-violet/20 to-synth-magenta/10 rounded-xl p-4 shadow-lg">
              <div className="text-synth-violet font-bold text-2xl">7</div>
              <div className="text-synth-violet/70 text-xs font-medium">Days Streak</div>
            </div>
            <div className="bg-gradient-to-r from-synth-aqua/20 to-synth-icy/10 rounded-xl p-4 shadow-lg">
              <div className="text-synth-violet font-bold text-2xl">85%</div>
              <div className="text-synth-violet/70 text-xs font-medium">Avg Grade</div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Light Bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-1 h-16 rounded-full bg-gradient-to-b from-synth-violet to-synth-aqua animate-pulseGlow"></div>
    </div>
  );
}
