import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useQueries';
import { GoalType } from '../backend';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import ExportDataCard from '../components/ExportDataCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsPage() {
  const { data: userProfile, isLoading } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  const { theme, setTheme } = useTheme();

  const [displayName, setDisplayName] = useState('');
  const [goalType, setGoalType] = useState<GoalType>(GoalType.study);

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName);
      setGoalType(userProfile.goalType);
    }
  }, [userProfile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    try {
      await saveProfile.mutateAsync({ displayName: displayName.trim(), goalType });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your profile and preferences</p>
        </div>

        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goalType">Primary Goal</Label>
                  <Select value={goalType} onValueChange={(value) => setGoalType(value as GoalType)}>
                    <SelectTrigger id="goalType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={GoalType.study}>Study</SelectItem>
                      <SelectItem value={GoalType.fitness}>Fitness</SelectItem>
                      <SelectItem value={GoalType.coding}>Coding</SelectItem>
                      <SelectItem value={GoalType.other}>Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" disabled={saveProfile.isPending}>
                  {saveProfile.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how the app looks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="darkMode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Toggle between light and dark theme</p>
              </div>
              <Switch
                id="darkMode"
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
            </div>
          </CardContent>
        </Card>

        <ExportDataCard />
      </div>
    </div>
  );
}
