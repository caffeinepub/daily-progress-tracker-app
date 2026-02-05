import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import TaskList from '../components/TaskList';
import StreakWidget from '../components/StreakWidget';
import MotivationalQuoteCard from '../components/MotivationalQuoteCard';
import { useGetTasksByDate } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { computeDailyCompletion } from '../utils/analytics';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { data: tasks = [], isLoading } = useGetTasksByDate(selectedDate);

  const dailyCompletion = computeDailyCompletion(tasks);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Track your daily progress</p>
          </div>
          <Button onClick={() => navigate({ to: '/tasks/new' })}>
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>

        <MotivationalQuoteCard />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Select Date</CardTitle>
                  <CalendarIcon className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                {!isLoading && tasks.length > 0 && (
                  <div className="mt-4 p-4 bg-accent/20 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Today's Completion</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-primary h-full transition-all duration-300"
                          style={{ width: `${dailyCompletion}%` }}
                        />
                      </div>
                      <span className="text-lg font-bold text-foreground">{dailyCompletion}%</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tasks for {selectedDate}</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : (
                  <TaskList tasks={tasks} selectedDate={selectedDate} />
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <StreakWidget />
          </div>
        </div>
      </div>
    </div>
  );
}
