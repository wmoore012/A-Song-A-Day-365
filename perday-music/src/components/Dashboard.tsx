import { useState, useEffect } from 'react';
import { useAppStore } from '../store/store';
import { useDemoMode } from '../hooks/useDemoMode';
import { FlowState } from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet';
import LockInTips from './LockInTips';
import HeatButtons from './HeatButtons';
import { 
  Play, 
  Target, 
  Clock, 
  Trophy, 
  TrendingUp, 
  Music,
  Plus,
  BarChart3,
  Users,
  Zap,
  Volume2
} from 'lucide-react';

export default function Dashboard() {
  const { dispatch, settings, setSettings, session } = useAppStore();
  const { getData } = useDemoMode();
  const [showCommunity, setShowCommunity] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showSoundPrompt, setShowSoundPrompt] = useState(false);

  // Show sound prompt on first visit
  useEffect(() => {
    const hasSeenSoundPrompt = localStorage.getItem('hasSeenSoundPrompt');
    if (!hasSeenSoundPrompt && !settings.soundEnabled) {
      setShowSoundPrompt(true);
    }
  }, [settings.soundEnabled]);

  // Get data based on demo mode
  const data = getData();
  const stats = {
    totalSessions: data.inventory.length,
    currentStreak: data.streak,
    totalMinutes: data.inventory.length * 25, // Assume 25 min per session
    averageRating: data.inventory.length > 0 
      ? data.inventory.reduce((sum, item) => sum + (item.rating || 0), 0) / data.inventory.length 
      : 0,
    thisWeek: Math.floor(data.inventory.length * 0.3), // Rough estimate
    thisMonth: Math.floor(data.inventory.length * 0.7) // Rough estimate
  };

  const recentSessions = data.inventory.slice(0, 4).map((item, index) => ({
    id: index + 1,
    title: item.title,
    duration: 25,
    rating: item.rating || 3,
    date: index === 0 ? "2 hours ago" : index === 1 ? "Yesterday" : `${index + 1} days ago`,
    type: item.genre
  }));

  const quickActions = [
    { title: "Start Focus Session", icon: Play, action: () => dispatch({ type: "START_QUESTIONNAIRE" }) },
    { title: "View Analytics", icon: BarChart3, action: () => setShowAnalytics(true) },
    { title: "Community", icon: Users, action: () => setShowCommunity(true) }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <LockInTips />
      
      {/* Sound Enable Prompt - Front and Center */}
      {showSoundPrompt && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-black/60 backdrop-blur-xl border border-cyan-400/30 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl shadow-cyan-400/20">
            <div className="mb-8">
              <Volume2 className="w-20 h-20 text-cyan-300 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">Enable Sound?</h2>
              <p className="text-cyan-200/80 text-lg">
                Get the full experience with background music and audio feedback
              </p>
            </div>
            <div className="space-y-4">
              <Button
                onClick={() => {
                  setSettings({ ...settings, soundEnabled: true });
                  localStorage.setItem('hasSeenSoundPrompt', 'true');
                  setShowSoundPrompt(false);
                }}
                className="w-full h-14 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-lg font-semibold rounded-xl"
              >
                <Volume2 className="w-5 h-5 mr-2" />
                Enable Sound
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSettings({ ...settings, soundEnabled: false });
                  localStorage.setItem('hasSeenSoundPrompt', 'true');
                  setShowSoundPrompt(false);
                }}
                className="w-full h-12 border-cyan-400/60 text-cyan-300 hover:bg-cyan-400/20 rounded-xl"
              >
                Proceed with no sound
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              Your Studio
            </h1>
            <p className="text-cyan-300/70 mt-1">Welcome back, producer</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 border border-cyan-400/30 text-cyan-300 rounded-full text-sm">
              <Trophy className="w-3 h-3 mr-1 inline" />
              {stats.currentStreak} day streak
            </div>
            <Button 
              onClick={() => dispatch({ type: "START_QUESTIONNAIRE" })}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Session
            </Button>
          </div>
        </div>
      </div>

      {/* Heat Buttons - Only show when session is active and questionnaire completed */}
      {session.state === FlowState.FOCUS_RUNNING && session.target && (
        <div className="mb-8">
          <HeatButtons />
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-black/40 border-cyan-400/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-cyan-300 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Total Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalSessions}</div>
            <p className="text-xs text-white/60 mt-1">+{stats.thisWeek} this week</p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-400/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-purple-300 flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Focus Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{Math.floor(stats.totalMinutes / 60)}h</div>
            <p className="text-xs text-white/60 mt-1">{stats.totalMinutes % 60}m total</p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-green-400/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-green-300 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Avg Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.averageRating}</div>
            <p className="text-xs text-white/60 mt-1">out of 5</p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-orange-400/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-orange-300 flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.thisMonth}</div>
            <p className="text-xs text-white/60 mt-1">sessions completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Sessions */}
        <div className="lg:col-span-2">
          <Card className="bg-black/40 border-cyan-400/20">
            <CardHeader>
              <CardTitle className="text-cyan-300">Recent Sessions</CardTitle>
              <CardDescription className="text-white/60">
                Your latest creative work
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:shadow-lg hover:shadow-cyan-400/20 transition-all duration-300 cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                        <Music className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{session.title}</h3>
                        <p className="text-sm text-white/60">{session.type} • {session.duration}min</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <div className="px-2 py-1 border border-green-400/30 text-green-300 rounded text-xs">
                          {session.rating}/5
                        </div>
                        <span className="text-xs text-white/40">{session.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Progress */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="bg-black/40 border-purple-400/20">
            <CardHeader>
              <CardTitle className="text-purple-300">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start border-white/20 text-white hover:bg-white/10 hover:shadow-lg hover:shadow-cyan-400/30 transition-all duration-300"
                    onClick={action.action}
                  >
                    <action.icon className="w-4 h-4 mr-2" />
                    {action.title}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Progress */}
          <Card className="bg-black/40 border-green-400/20">
            <CardHeader>
              <CardTitle className="text-green-300">Weekly Goal</CardTitle>
              <CardDescription className="text-white/60">
                5 sessions this week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Progress</span>
                  <span className="text-white">{stats.thisWeek}/5</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(stats.thisWeek / 5) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-white/60">
                  {5 - stats.thisWeek} sessions remaining
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Community Stats */}
          <Card className="bg-black/40 border-orange-400/20">
            <CardHeader>
              <CardTitle className="text-orange-300">Community</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/60">Active Producers</span>
                  <span className="text-white">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Your Rank</span>
                  <span className="text-white">#42</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Challenges Won</span>
                  <span className="text-white">8</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Community Sheet */}
      <Sheet open={showCommunity} onOpenChange={setShowCommunity}>
        <SheetContent className="bg-black/95 border-cyan-400/30 text-white w-[400px]">
          <SheetHeader>
            <SheetTitle className="text-cyan-300">Community</SheetTitle>
            <SheetDescription className="text-white/60">
              Connect with fellow producers
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-white/5 rounded-lg border border-cyan-400/20">
              <h3 className="font-semibold text-cyan-300 mb-2">Live Sessions</h3>
              <p className="text-white/70 text-sm">Join global studio sessions</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg border border-purple-400/20">
              <h3 className="font-semibold text-purple-300 mb-2">Genre Challenges</h3>
              <p className="text-white/70 text-sm">Compete by genre</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg border border-green-400/20">
              <h3 className="font-semibold text-green-300 mb-2">Squad Energy</h3>
              <p className="text-white/70 text-sm">Find your crew</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Analytics Sheet */}
      <Sheet open={showAnalytics} onOpenChange={setShowAnalytics}>
        <SheetContent className="bg-black/95 border-cyan-400/30 text-white w-[500px]">
          <SheetHeader>
            <SheetTitle className="text-cyan-300">Analytics</SheetTitle>
            <SheetDescription className="text-white/60">
              Your performance insights
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-lg border border-cyan-400/20">
                <h3 className="font-semibold text-cyan-300">Focus Time</h3>
                <p className="text-2xl font-bold text-white">{Math.floor(stats.totalMinutes / 60)}h</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-purple-400/20">
                <h3 className="font-semibold text-purple-300">Sessions</h3>
                <p className="text-2xl font-bold text-white">{stats.totalSessions}</p>
              </div>
            </div>
            <div className="p-4 bg-white/5 rounded-lg border border-green-400/20">
              <h3 className="font-semibold text-green-300 mb-2">Trends</h3>
              <p className="text-white/70 text-sm">Your productivity patterns</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>


    </div>
  );
}
