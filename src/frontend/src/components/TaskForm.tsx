import { useState, useEffect } from 'react';
import { Task, TaskStatus, GoalType } from '../backend';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface TaskFormProps {
  task?: Task;
  initialDate?: string;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export interface TaskFormData {
  title: string;
  date: string;
  status: TaskStatus;
  category: string;
  notes: string;
}

export default function TaskForm({ task, initialDate, onSubmit, onCancel, isSubmitting }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [date, setDate] = useState(task?.date || initialDate || new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<TaskStatus>(task?.status || TaskStatus.pending);
  const [category, setCategory] = useState(task?.category || '');
  const [notes, setNotes] = useState(task?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, date, status, category, notes });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Task Title *</Label>
        <Input
          id="title"
          placeholder="e.g., Study Python for 2 hours"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date *</Label>
        <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={(value) => setStatus(value as TaskStatus)}>
          <SelectTrigger id="status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TaskStatus.pending}>Pending</SelectItem>
            <SelectItem value={TaskStatus.done}>Done</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category (optional)</Label>
        <Input
          id="category"
          placeholder="e.g., Study, Fitness, Coding"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          placeholder="Add any additional details..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
