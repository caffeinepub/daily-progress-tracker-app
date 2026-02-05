import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Download } from 'lucide-react';
import { useActor } from '../hooks/useActor';
import { getAllDatesInRange } from '../utils/dateRanges';
import { exportTasksToCSV } from '../utils/csvExport';
import { toast } from 'sonner';
import { Task } from '../backend';

export default function ExportDataCard() {
  const { actor } = useActor();
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (new Date(startDate) > new Date(endDate)) {
      toast.error('Start date must be before end date');
      return;
    }

    if (!actor) {
      toast.error('Not connected to backend');
      return;
    }

    setIsExporting(true);
    try {
      const dates = getAllDatesInRange(startDate, endDate);
      const allTasks: Task[] = [];

      for (const date of dates) {
        const tasks = await actor.getTasksByDate(date);
        allTasks.push(...tasks);
      }

      exportTasksToCSV(allTasks, startDate, endDate);
      toast.success('Data exported successfully!');
    } catch (error) {
      toast.error('Failed to export data');
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Data</CardTitle>
        <CardDescription>Download your task history as a CSV file</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>
        <Button onClick={handleExport} disabled={isExporting} className="w-full">
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export to CSV'}
        </Button>
      </CardContent>
    </Card>
  );
}
