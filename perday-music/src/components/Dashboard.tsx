import { useAppStore } from '../store/store';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { 
  Play, 
  Target, 
  Clock, 
  Trophy, 
  TrendingUp, 
  Music,
  Settings,
  Plus,
  BarChart3,
  Users,
  Zap
} from 'lucide-react';

export default function Dashboard() {
  const { dispatch } = useAppStore();

  // Mock data for demonstration
  const stats = {
    totalSessions: 47,
    currentStreak: 12,
    totalMinutes: 2840,
    averageRating: 4.2,
    thisWeek: 5,
    thisMonth: 23
  };

  const recentSessions = [
    { id: 1, title: "Trap Beat - Verse 2", duration: 25, rating: 4, date: "2 hours ago", type: "Production" },
    { id: 2, title: "Mixing Session", duration: 45, rating: 5, date: "Yesterday", type: "Mixing" },
    { id: 3, title: "Sound Design", duration: 30, rating: 3, date: "2 days ago", type: "Sound Design" },
    { id: 4, title: "Arrangement", duration: 35, rating: 4, date: "3 days ago", type: "Arrangement" }
  ];

  const quickActions = [
    { title: "Start Focus Session", icon: Play, action: () => dispatch({ type: "PICK_TYPE", payload: "Production" }) },
    { title: "View Analytics", icon: BarChart3, action: () => console.log("View Analytics") },
    { title: "Community", icon: Users, action: () => console.log("Community") },
    { title: "Settings", icon: Settings, action: () => console.log("Settings") }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">
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
              onClick={() => dispatch({ type: "PICK_TYPE", payload: "Production" })}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Session
            </Button>
          </div>
        </div>
      </div>

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
                  <div key={session.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
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
                    className="w-full justify-start border-white/20 text-white hover:bg-white/10"
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
    </div>
  );
}
