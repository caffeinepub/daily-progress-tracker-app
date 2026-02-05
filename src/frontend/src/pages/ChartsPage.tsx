import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AnalyticsSummaryCards from '../components/AnalyticsSummaryCards';
import { useAnalytics } from '../hooks/useAnalytics';
import { Skeleton } from '@/components/ui/skeleton';

export default function ChartsPage() {
  const { dailyCompletion, weeklyTotal, monthlyTotal, totalCompleted, isLoading } = useAnalytics();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Analytics & Charts</h1>
          <p className="text-muted-foreground">View your progress over time</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        ) : (
          <AnalyticsSummaryCards
            dailyCompletion={dailyCompletion}
            weeklyTotal={weeklyTotal}
            monthlyTotal={monthlyTotal}
            totalCompleted={totalCompleted}
          />
        )}

        <Card>
          <CardHeader>
            <CardTitle>Progress Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Weekly Progress</span>
                  <span className="text-sm text-muted-foreground">{weeklyTotal} tasks</span>
                </div>
                <div className="bg-muted rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-chart-1 h-full transition-all duration-300"
                    style={{ width: `${Math.min((weeklyTotal / 50) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Monthly Progress</span>
                  <span className="text-sm text-muted-foreground">{monthlyTotal} tasks</span>
                </div>
                <div className="bg-muted rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-chart-2 h-full transition-all duration-300"
                    style={{ width: `${Math.min((monthlyTotal / 200) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">All Time</span>
                  <span className="text-sm text-muted-foreground">{totalCompleted} tasks</span>
                </div>
                <div className="bg-muted rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-chart-3 h-full transition-all duration-300"
                    style={{ width: `${Math.min((totalCompleted / 500) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
