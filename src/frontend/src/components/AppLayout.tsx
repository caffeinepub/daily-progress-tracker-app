import { Outlet } from '@tanstack/react-router';
import AppHeader from './AppHeader';
import AppNav from './AppNav';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function AppLayout() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      {isAuthenticated && <AppNav />}
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026. Built with <span className="text-destructive">♥</span> using{' '}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
