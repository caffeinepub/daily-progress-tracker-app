import { useNavigate, useParams, useSearch } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TaskForm, { TaskFormData } from '../components/TaskForm';
import { useCreateTask, useEditTask, useGetTasksByDate } from '../hooks/useQueries';
import { toast } from 'sonner';
import { TaskStatus } from '../backend';

export default function TaskEditorPage() {
  const navigate = useNavigate();
  const params = useParams({ strict: false });
  const search = useSearch({ strict: false }) as { date?: string };
  const taskId = params.taskId ? BigInt(params.taskId) : undefined;
  const initialDate = search.date || new Date().toISOString().split('T')[0];

  const { data: tasks = [] } = useGetTasksByDate(initialDate);
  const task = taskId ? tasks.find((t) => t.id === taskId) : undefined;

  const createTask = useCreateTask();
  const editTask = useEditTask();

  const handleSubmit = async (data: TaskFormData) => {
    try {
      if (task) {
        await editTask.mutateAsync({
          taskId: task.id,
          title: data.title,
          date: data.date,
          status: data.status,
          category: data.category || null,
          notes: data.notes || null,
        });
        toast.success('Task updated successfully!');
      } else {
        await createTask.mutateAsync({
          title: data.title,
          date: data.date,
          category: data.category || null,
          notes: data.notes || null,
        });
        toast.success('Task created successfully!');
      }
      navigate({ to: '/dashboard' });
    } catch (error) {
      toast.error(task ? 'Failed to update task' : 'Failed to create task');
      console.error(error);
    }
  };

  const handleCancel = () => {
    navigate({ to: '/dashboard' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{task ? 'Edit Task' : 'Add New Task'}</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskForm
              task={task}
              initialDate={initialDate}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isSubmitting={createTask.isPending || editTask.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
