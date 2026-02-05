import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Trophy } from 'lucide-react';
import { useStreak } from '../hooks/useStreak';
import { Skeleton } from '@/components/ui/skeleton';

export default function StreakWidget() {
  const { currentStreak, bestStreak, streakRule, isLoading } = useStreak();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Streak</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Your Streak</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-around">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Flame className="w-6 h-6 text-orange-500" />
              <span className="text-3xl font-bold text-foreground">{currentStreak.toString()}</span>
            </div>
            <p className="text-sm text-muted-foreground">Current Streak</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="w-6 h-6 text-amber-500" />
              <span className="text-3xl font-bold text-foreground">{bestStreak.toString()}</span>
            </div>
            <p className="text-sm text-muted-foreground">Best Streak</p>
          </div>
        </div>
        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">{streakRule}</p>
        </div>
      </CardContent>
    </Card>
  );
}
