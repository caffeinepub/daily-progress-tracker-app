import { Task, TaskStatus } from '../backend';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useToggleTask, useDeleteTask } from '../hooks/useQueries';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface TaskListProps {
  tasks: Task[];
  selectedDate: string;
}

export default function TaskList({ tasks, selectedDate }: TaskListProps) {
  const navigate = useNavigate();
  const toggleTask = useToggleTask();
  const deleteTask = useDeleteTask();

  const handleToggle = async (task: Task) => {
    try {
      await toggleTask.mutateAsync({
        taskId: task.id,
        currentStatus: task.status,
        date: selectedDate,
      });
    } catch (error) {
      toast.error('Failed to update task');
      console.error(error);
    }
  };

  const handleDelete = async (taskId: bigint) => {
    try {
      await deleteTask.mutateAsync({ taskId, date: selectedDate });
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
      console.error(error);
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <img
          src="/assets/generated/empty-tasks-illustration.dim_1200x800.png"
          alt="No tasks"
          className="w-64 h-auto mx-auto mb-6 opacity-60"
        />
        <h3 className="text-lg font-semibold text-foreground mb-2">No tasks for this day</h3>
        <p className="text-muted-foreground mb-6">Start by adding your first task!</p>
        <Button onClick={() => navigate({ to: '/tasks/new' })}>Add Task</Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <Card key={task.id.toString()} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Checkbox
                checked={task.status === TaskStatus.done}
                onCheckedChange={() => handleToggle(task)}
                className="mt-1"
              />
              <div className="flex-1 min-w-0">
                <h4
                  className={`font-medium text-foreground mb-1 ${
                    task.status === TaskStatus.done ? 'line-through opacity-60' : ''
                  }`}
                >
                  {task.title}
                </h4>
                {task.category && (
                  <span className="inline-block text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full mb-2">
                    {task.category}
                  </span>
                )}
                {task.notes && (
                  <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{task.notes}</p>
                )}
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate({ to: `/tasks/${task.id}/edit`, search: { date: selectedDate } })}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete task?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the task.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(task.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
