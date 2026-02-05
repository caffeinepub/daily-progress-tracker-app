import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useGetTasksByDate } from '../hooks/useQueries';
import { computeDailyCompletion } from '../utils/analytics';
import { TaskStatus } from '../backend';
import { CheckCircle2, Circle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DailyProgressPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { data: tasks = [], isLoading } = useGetTasksByDate(selectedDate);

  const dailyCompletion = computeDailyCompletion(tasks);
  const completedTasks = tasks.filter((t) => t.status === TaskStatus.done);
  const pendingTasks = tasks.filter((t) => t.status === TaskStatus.pending);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Daily Progress</h1>
          <p className="text-muted-foreground">View your completion rate and task breakdown</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          </CardContent>
        </Card>

        {isLoading ? (
          <Skeleton className="h-48 w-full" />
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="text-6xl font-bold text-primary mb-4">{dailyCompletion}%</div>
                  <p className="text-muted-foreground">
                    {completedTasks.length} of {tasks.length} tasks completed
                  </p>
                  <div className="mt-6 max-w-md mx-auto">
                    <div className="bg-muted rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all duration-300"
                        style={{ width: `${dailyCompletion}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    Completed Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {completedTasks.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No completed tasks</p>
                  ) : (
                    <ul className="space-y-2">
                      {completedTasks.map((task) => (
                        <li key={task.id.toString()} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary mt-1 shrink-0" />
                          <span className="text-sm">{task.title}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Circle className="w-5 h-5 text-muted-foreground" />
                    Pending Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pendingTasks.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No pending tasks</p>
                  ) : (
                    <ul className="space-y-2">
                      {pendingTasks.map((task) => (
                        <li key={task.id.toString()} className="flex items-start gap-2">
                          <Circle className="w-4 h-4 text-muted-foreground mt-1 shrink-0" />
                          <span className="text-sm">{task.title}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
