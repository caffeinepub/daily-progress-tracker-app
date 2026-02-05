import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { CheckCircle2, TrendingUp, Target, Flame } from 'lucide-react';
import { useEffect } from 'react';

export default function SplashPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/dashboard' });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center">
        <img
          src="/assets/generated/daily-progress-logo.dim_512x512.png"
          alt="Daily Progress Tracker"
          className="w-32 h-32 mx-auto mb-8"
        />
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Daily Progress Tracker</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Track your daily goals, build streaks, and measure your progress over time
        </p>
        <Button size="lg" onClick={() => navigate({ to: '/login' })} className="mb-16">
          Get Started
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          <div className="p-6 rounded-lg bg-card border border-border">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold text-foreground mb-2">Track Tasks</h3>
            <p className="text-sm text-muted-foreground">
              Add daily tasks and mark them complete as you progress
            </p>
          </div>
          <div className="p-6 rounded-lg bg-card border border-border">
            <Flame className="w-12 h-12 mx-auto mb-4 text-orange-500" />
            <h3 className="font-semibold text-foreground mb-2">Build Streaks</h3>
            <p className="text-sm text-muted-foreground">Stay consistent and watch your streak grow</p>
          </div>
          <div className="p-6 rounded-lg bg-card border border-border">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold text-foreground mb-2">View Analytics</h3>
            <p className="text-sm text-muted-foreground">See your progress with weekly and monthly charts</p>
          </div>
          <div className="p-6 rounded-lg bg-card border border-border">
            <Target className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold text-foreground mb-2">Stay Motivated</h3>
            <p className="text-sm text-muted-foreground">Get daily quotes and track your achievements</p>
          </div>
        </div>
      </div>
    </div>
  );
}
