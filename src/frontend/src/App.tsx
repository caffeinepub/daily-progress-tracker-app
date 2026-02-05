import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import SplashPage from './pages/SplashPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TaskEditorPage from './pages/TaskEditorPage';
import DailyProgressPage from './pages/DailyProgressPage';
import ChartsPage from './pages/ChartsPage';
import SettingsPage from './pages/SettingsPage';
import AppLayout from './components/AppLayout';
import AuthGate from './components/AuthGate';

const rootRoute = createRootRoute({
  component: () => <AppLayout />,
});

const splashRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: SplashPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => (
    <AuthGate>
      <DashboardPage />
    </AuthGate>
  ),
});

const addTaskRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tasks/new',
  component: () => (
    <AuthGate>
      <TaskEditorPage />
    </AuthGate>
  ),
});

const editTaskRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tasks/$taskId/edit',
  component: () => (
    <AuthGate>
      <TaskEditorPage />
    </AuthGate>
  ),
});

const dailyProgressRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/progress',
  component: () => (
    <AuthGate>
      <DailyProgressPage />
    </AuthGate>
  ),
});

const chartsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/charts',
  component: () => (
    <AuthGate>
      <ChartsPage />
    </AuthGate>
  ),
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: () => (
    <AuthGate>
      <SettingsPage />
    </AuthGate>
  ),
});

const routeTree = rootRoute.addChildren([
  splashRoute,
  loginRoute,
  dashboardRoute,
  addTaskRoute,
  editTaskRoute,
  dailyProgressRoute,
  chartsRoute,
  settingsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
