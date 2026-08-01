import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { RootLayout } from '@/layouts/RootLayout';
import { lazy, Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';

const PageLoader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', width: '100%' }}>
    <CircularProgress />
  </Box>
);

const HomePage = lazy(() => import('@/pages/HomePage').then(m => ({ default: m.HomePage })));
const LoginPage = lazy(() => import('@/pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('@/pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage').then(m => ({ default: m.ResetPasswordPage })));
const DashboardPage = lazy(() => import('@/pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const WorkspacePage = lazy(() => import('@/pages/WorkspacePage').then(m => ({ default: m.WorkspacePage })));
const ProjectPage = lazy(() => import('@/pages/ProjectPage').then(m => ({ default: m.ProjectPage })));
const TeamsPage = lazy(() => import('@/pages/TeamsPage').then(m => ({ default: m.TeamsPage })));
const UsersPage = lazy(() => import('@/pages/UsersPage').then(m => ({ default: m.UsersPage })));
const IssuesPage = lazy(() => import('@/pages/IssuesPage').then(m => ({ default: m.IssuesPage })));
const KanbanPage = lazy(() => import('@/pages/KanbanPage').then(m => ({ default: m.KanbanPage })));
const ReportsPage = lazy(() => import('@/pages/ReportsPage').then(m => ({ default: m.ReportsPage })));
const AuditLogsPage = lazy(() => import('@/pages/AuditLogsPage').then(m => ({ default: m.AuditLogsPage })));
const NotificationCenterPage = lazy(() => import('@/pages/NotificationCenterPage').then(m => ({ default: m.NotificationCenterPage })));
const ProfilePage = lazy(() => import('@/pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const SettingsPage = lazy(() => import('@/pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const AdministrationPage = lazy(() => import('@/pages/AdministrationPage').then(m => ({ default: m.AdministrationPage })));
import { GuestRoute, ProtectedRoute } from '@/components/routing/ProtectedRoute';
import { PermissionGuard } from '@/components/routing/PermissionGuard';
import { ROUTES } from '@/constants';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path={ROUTES.HOME} element={<HomePage />} />

          <Route element={<GuestRoute />}>
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
            <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route
              path={ROUTES.DASHBOARD}
              element={
                <PermissionGuard screen="dashboard">
                  <DashboardPage />
                </PermissionGuard>
              }
            />
            <Route
              path={ROUTES.PROJECTS}
              element={
                <PermissionGuard screen="projects">
                  <ProjectPage />
                </PermissionGuard>
              }
            />
            <Route
              path={ROUTES.ISSUES}
              element={
                <PermissionGuard screen="issues">
                  <IssuesPage />
                </PermissionGuard>
              }
            />
            <Route
              path={ROUTES.KANBAN}
              element={
                <PermissionGuard screen="board">
                  <KanbanPage />
                </PermissionGuard>
              }
            />
            <Route path={ROUTES.WORKSPACES} element={<WorkspacePage />} />
            <Route
              path={ROUTES.PROFILE}
              element={
                <PermissionGuard screen="profile">
                  <ProfilePage />
                </PermissionGuard>
              }
            />
            <Route
              path="/notifications"
              element={
                <PermissionGuard screen="notifications">
                  <NotificationCenterPage />
                </PermissionGuard>
              }
            />

            {/* Super Admin Exclusive Route */}
            <Route
              path={ROUTES.ADMINISTRATION}
              element={
                <PermissionGuard requireSuperAdmin screen="administration">
                  <AdministrationPage />
                </PermissionGuard>
              }
            />

            {/* Permission & Screen Guarded Routes */}
            <Route
              path={ROUTES.TEAMS}
              element={
                <PermissionGuard screen="teams" permission="manage_teams">
                  <TeamsPage />
                </PermissionGuard>
              }
            />
            <Route
              path={ROUTES.USERS}
              element={
                <PermissionGuard screen="users" permission="manage_users">
                  <UsersPage />
                </PermissionGuard>
              }
            />
            <Route
              path={ROUTES.REPORTS}
              element={
                <PermissionGuard screen="reports" permission="view_reports">
                  <ReportsPage />
                </PermissionGuard>
              }
            />
            <Route
              path="/audit-logs"
              element={
                <PermissionGuard screen="auditLogs" permission="view_audit_logs">
                  <AuditLogsPage />
                </PermissionGuard>
              }
            />
            <Route
              path={ROUTES.SETTINGS}
              element={
                <PermissionGuard screen="settings">
                  <SettingsPage />
                </PermissionGuard>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
