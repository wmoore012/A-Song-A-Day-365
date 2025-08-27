import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import GlassPanel from './common/GlassPanel';
import { Lock, Eye, EyeOff, Users, Zap, Target } from 'lucide-react';
import { toast } from 'sonner';

const SECRET_PASSWORD = 'perday2024'; // In production, this would be server-side

export default function SecretFeatures() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate server delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (password === SECRET_PASSWORD) {
      setIsAuthenticated(true);
      toast.success('Access granted! Welcome to the secret features.');
    } else {
      toast.error('Incorrect password. Try again.');
    }
    
    setIsLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <GlassPanel className="max-w-md w-full p-8">
          <div className="text-center mb-8">
            <Lock className="w-16 h-16 text-cyan-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Secret Features</h1>
            <p className="text-cyan-200/80">
              Enter the password to access proprietary camp logic and collaboration features
            </p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="pr-10 bg-black/40 border-cyan-400/50 text-white placeholder:text-cyan-200/50"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-200/50 hover:text-cyan-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500"
            >
              {isLoading ? 'Checking...' : 'Access Secret Features'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-white/40">
              This area contains proprietary collaboration algorithms and camp logic
            </p>
          </div>
        </GlassPanel>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                Secret Features
              </h1>
              <p className="text-cyan-300/70 mt-1">Proprietary camp logic and collaboration algorithms</p>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsAuthenticated(false)}
              className="border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/20"
            >
              <Lock className="w-4 h-4 mr-2" />
              Lock
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Instant Camps */}
          <GlassPanel className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-8 h-8 text-cyan-300" />
              <h3 className="text-xl font-bold text-white">Instant Camps</h3>
            </div>
            <p className="text-cyan-200/80 mb-4">
              Real-time collaboration with anonymous tip gates, vouching system, and automatic split sheet generation.
            </p>
            <div className="space-y-2 text-sm text-white/60">
              <div>• Entry Tip Gate (anonymous pro tips)</div>
              <div>• 3-member vouching system</div>
              <div>• Auto split sheet generation</div>
              <div>• Group scoring with penalties</div>
            </div>
          </GlassPanel>

          {/* Vibe Stealer Logic */}
          <GlassPanel className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-8 h-8 text-purple-300" />
              <h3 className="text-xl font-bold text-white">Vibe Stealer Detection</h3>
            </div>
            <p className="text-cyan-200/80 mb-4">
              Advanced algorithms to detect and handle disruptive behavior in collaborative sessions.
            </p>
            <div className="space-y-2 text-sm text-white/60">
              <div>• Early exit penalty system</div>
              <div>• Strike accumulation logic</div>
              <div>• Appeal and vouch requirements</div>
              <div>• Progressive moderation</div>
            </div>
          </GlassPanel>

          {/* Split Sheet Algorithm */}
          <GlassPanel className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-8 h-8 text-green-300" />
              <h3 className="text-xl font-bold text-white">Split Sheet Engine</h3>
            </div>
            <p className="text-cyan-200/80 mb-4">
              Intelligent split sheet generation with equal distribution and manual override capabilities.
            </p>
            <div className="space-y-2 text-sm text-white/60">
              <div>• Equal "Pop splits" by default</div>
              <div>• Manual adjustment options</div>
              <div>• 100% validation logic</div>
              <div>• Audit trail tracking</div>
            </div>
          </GlassPanel>

          {/* Real-time Collaboration */}
          <GlassPanel className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-8 h-8 text-blue-300" />
              <h3 className="text-xl font-bold text-white">Real-time Sync</h3>
            </div>
            <p className="text-cyan-200/80 mb-4">
              WebSocket-based real-time collaboration with conflict resolution and state management.
            </p>
            <div className="space-y-2 text-sm text-white/60">
              <div>• WebSocket event handling</div>
              <div>• Conflict resolution</div>
              <div>• State synchronization</div>
              <div>• Offline recovery</div>
            </div>
          </GlassPanel>

          {/* Moderation System */}
          <GlassPanel className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-8 h-8 text-red-300" />
              <h3 className="text-xl font-bold text-white">Moderation Engine</h3>
            </div>
            <p className="text-cyan-200/80 mb-4">
              Comprehensive moderation system with reporting, appeals, and automated enforcement.
            </p>
            <div className="space-y-2 text-sm text-white/60">
              <div>• Report categorization</div>
              <div>• Strike management</div>
              <div>• Appeal processing</div>
              <div>• Ban enforcement</div>
            </div>
          </GlassPanel>

          {/* Analytics & Scoring */}
          <GlassPanel className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-8 h-8 text-yellow-300" />
              <h3 className="text-xl font-bold text-white">Scoring Algorithm</h3>
            </div>
            <p className="text-cyan-200/80 mb-4">
              Advanced scoring system with multiplier decay, group penalties, and achievement tracking.
            </p>
            <div className="space-y-2 text-sm text-white/60">
              <div>• Multiplier decay logic</div>
              <div>• Group penalty calculation</div>
              <div>• Achievement unlocking</div>
              <div>• Streak tracking</div>
            </div>
          </GlassPanel>
        </div>

        {/* Implementation Status */}
        <div className="mt-8">
          <GlassPanel className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Implementation Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-cyan-300 mb-2">Completed</h4>
                <ul className="space-y-1 text-sm text-white/60">
                  <li>• Core camp data structures</li>
                  <li>• Basic real-time sync</li>
                  <li>• Split sheet generation</li>
                  <li>• Moderation framework</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-amber-300 mb-2">In Development</h4>
                <ul className="space-y-1 text-sm text-white/60">
                  <li>• Advanced vibe stealer detection</li>
                  <li>• Appeal system</li>
                  <li>• Performance optimization</li>
                  <li>• Mobile responsiveness</li>
                </ul>
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
