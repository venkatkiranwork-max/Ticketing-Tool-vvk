import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { RootLayout } from '@/layouts/RootLayout';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/ResetPasswordPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { WorkspacePage } from '@/pages/WorkspacePage';
import { ProjectPage } from '@/pages/ProjectPage';
import { TeamsPage } from '@/pages/TeamsPage';
import { UsersPage } from '@/pages/UsersPage';
import { IssuesPage } from '@/pages/IssuesPage';
import { KanbanPage } from '@/pages/KanbanPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { AuditLogsPage } from '@/pages/AuditLogsPage';
import { NotificationCenterPage } from '@/pages/NotificationCenterPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { SettingsPage } from '@/pages/SettingsPage';
import { AdministrationPage } from '@/pages/AdministrationPage';
import { GuestRoute, ProtectedRoute } from '@/components/routing/ProtectedRoute';
import { PermissionGuard } from '@/components/routing/PermissionGuard';
import { ROUTES } from '@/constants';

export function AppRouter() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}
