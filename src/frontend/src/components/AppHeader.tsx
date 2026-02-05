import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function AppHeader() {
  const navigate = useNavigate();
  const { identity, clear, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: userProfile } = useGetCallerUserProfile();
  const isAuthenticated = !!identity;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate({ to: isAuthenticated ? '/dashboard' : '/' })}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <img
            src="/assets/generated/daily-progress-logo.dim_512x512.png"
            alt="Daily Progress Tracker"
            className="w-10 h-10"
          />
          <div className="text-left">
            <h1 className="text-xl font-bold text-foreground">Daily Progress</h1>
            <p className="text-xs text-muted-foreground">Track your journey</p>
          </div>
        </button>

        {isAuthenticated && (
          <div className="flex items-center gap-4">
            {userProfile && (
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-foreground">{userProfile.displayName}</p>
                <p className="text-xs text-muted-foreground capitalize">{userProfile.goalType}</p>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={loginStatus === 'logging-in'}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
