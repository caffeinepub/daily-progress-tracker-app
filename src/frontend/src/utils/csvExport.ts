import { Task } from '../backend';

export function exportTasksToCSV(tasks: Task[], startDate: string, endDate: string) {
  const headers = ['Date', 'Title', 'Status', 'Category', 'Notes'];
  const rows = tasks.map((task) => [
    task.date,
    escapeCSV(task.title),
    task.status,
    escapeCSV(task.category || ''),
    escapeCSV(task.notes || ''),
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `tasks_${startDate}_to_${endDate}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
