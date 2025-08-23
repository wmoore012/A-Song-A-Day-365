import { useState } from 'react';

export function PremiumSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`fixed left-0 top-0 h-full bg-black/80 backdrop-blur-xl border-r border-synth-icy/20 transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Light Bar */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-48 rounded-full bg-gradient-to-b from-synth-violet via-synth-magenta via-synth-white via-synth-icy to-synth-aqua animate-breathe"></div>
      
      {/* Header */}
      <div className="p-4 border-b border-synth-icy/20">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="text-synth-white font-bold text-lg">
              <span className="text-synth-violet">Per</span>day
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg bg-synth-violet/20 hover:bg-synth-violet/30 text-synth-icy transition-colors"
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        <NavItem icon="🎵" label="Studio" active={true} collapsed={collapsed} />
        <NavItem icon="📊" label="Analytics" active={false} collapsed={collapsed} />
        <NavItem icon="⚡" label="Cookups" active={false} collapsed={collapsed} />
        <NavItem icon="🎯" label="Goals" active={false} collapsed={collapsed} />
        <NavItem icon="⚙️" label="Settings" active={false} collapsed={collapsed} />
      </nav>

      {/* Quick Stats */}
      {!collapsed && (
        <div className="p-4 border-t border-synth-icy/20 mt-auto">
          <div className="space-y-3">
            <div className="text-synth-icy text-sm">Today's Progress</div>
            <div className="bg-synth-violet/20 rounded-lg p-3">
              <div className="text-synth-white font-bold text-lg">7</div>
              <div className="text-synth-icy text-xs">Days Streak</div>
            </div>
            <div className="bg-synth-aqua/20 rounded-lg p-3">
              <div className="text-synth-white font-bold text-lg">85%</div>
              <div className="text-synth-icy text-xs">Avg Grade</div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Light Bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-1 h-16 rounded-full bg-gradient-to-b from-synth-violet to-synth-aqua animate-pulseGlow"></div>
    </div>
  );
}

function NavItem({ icon, label, active, collapsed }: { 
  icon: string; 
  label: string; 
  active: boolean; 
  collapsed: boolean;
}) {
  return (
    <button
      className={`w-full p-3 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
        active 
          ? 'bg-synth-violet/30 text-synth-white border border-synth-violet/50' 
          : 'text-synth-icy hover:bg-synth-icy/10 hover:text-synth-white'
      }`}
    >
      <span className="text-lg">{icon}</span>
      {!collapsed && <span className="font-medium">{label}</span>}
    </button>
  );
}
