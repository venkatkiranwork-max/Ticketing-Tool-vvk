import { useMemo } from 'react';
import { Container, Grid, Stack, Typography, Box, Card, CardContent, Chip, Button, Avatar } from '@mui/material';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import BoltIcon from '@mui/icons-material/Bolt';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';

import { SummaryCard } from '@/components/ui/SummaryCard';
import { ChartCard } from '@/components/ui/ChartCard';
import { ActivityCard } from '@/components/ui/ActivityCard';
import { mockWeeklyProgress } from '@/mock/dashboard';
import { mockActivityItems } from '@/mock/activity';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { useAuthStore } from '@/store/authStore';
import { mockUsers } from '@/mock/users';
import { mockProjects } from '@/mock/projects';
import { useIssuesQuery } from '@/features/issues/useIssues';
import { useUiStore } from '@/store/uiStore';
import { IssueDetailsDrawer } from '@/components/ui/IssueDetailsDrawer';

// Glassmorphic card style shared across dashboard
const glassCard = {
  borderRadius: '16px',
  background: 'linear-gradient(145deg, rgba(17, 24, 50, 0.85) 0%, rgba(12, 18, 38, 0.9) 100%)',
  border: '1px solid rgba(139, 92, 246, 0.18)',
  backdropFilter: 'blur(16px)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
};

// Stat mini card style
const statCard = (accentColor: string) => ({
  borderRadius: '16px',
  background: 'linear-gradient(145deg, rgba(17, 24, 50, 0.85) 0%, rgba(12, 18, 38, 0.9) 100%)',
  border: `1px solid ${accentColor}30`,
  backdropFilter: 'blur(16px)',
  boxShadow: `0 4px 20px rgba(0, 0, 0, 0.25)`,
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 28px rgba(0, 0, 0, 0.35), 0 0 0 1px ${accentColor}40`,
  },
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: `linear-gradient(90deg, ${accentColor} 0%, ${accentColor}60 100%)`,
    borderRadius: '16px 16px 0 0',
  },
});

export function DashboardPage() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.user) || mockUsers[0];
  const role = currentUser.role;

  const openDrawer = useUiStore((s) => s.openDrawer);

  const { data: rawIssues = [], refetch } = useIssuesQuery();
  const issues = useMemo(() => (Array.isArray(rawIssues) ? rawIssues : []), [rawIssues]);

  const isSuperOrAdmin = role === 'Super Admin' || role === 'super_admin' || role === 'Admin' || role === 'admin';

  const totalIssuesCount = issues.length;
  const completedIssuesCount = issues.filter((i) => i.status === 'done').length;
  const inProgressIssuesCount = issues.filter((i) => i.status === 'in_progress').length;
  const overdueIssuesCount = issues.filter(
    (i) => i.dueDate && new Date(i.dueDate) < new Date() && i.status !== 'done'
  ).length;
  const sprintCompletionPercent = totalIssuesCount
    ? Math.round((completedIssuesCount / totalIssuesCount) * 100)
    : 0;

  const myAssignedIssues = useMemo(
    () => issues.filter((i) => i.assignee?.id === currentUser.id),
    [issues, currentUser]
  );

  const statusDistributionData = useMemo(() => {
    const counts = { backlog: 0, todo: 0, in_progress: 0, review: 0, done: 0 };
    issues.forEach((i) => {
      if (counts[i.status] !== undefined) counts[i.status]++;
    });
    return [
      { name: 'Backlog', value: counts.backlog, color: '#64748b' },
      { name: 'To Do', value: counts.todo, color: '#3b82f6' },
      { name: 'In Progress', value: counts.in_progress, color: '#f59e0b' },
      { name: 'In Review', value: counts.review, color: '#8b5cf6' },
      { name: 'Done', value: counts.done, color: '#10b981' },
    ];
  }, [issues]);

  return (
    <Container maxWidth="xl" sx={{ py: 1 }}>
      <Stack spacing={3}>
        {/* ── Hero Banner ── */}
        <Card
          sx={{
            ...glassCard,
            background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.9) 0%, rgba(17, 24, 50, 0.95) 50%, rgba(12, 18, 38, 0.98) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '-50%',
              right: '-10%',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%)',
              filter: 'blur(40px)',
              pointerEvents: 'none',
            },
          }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, p: 2.5 }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                <Chip
                  label="SPRINT 24 ACTIVE"
                  icon={<BoltIcon sx={{ fontSize: '0.75rem !important', color: '#a78bfa !important' }} />}
                  size="small"
                  sx={{
                    background: 'rgba(124, 58, 237, 0.25)',
                    color: '#c4b5fd',
                    fontWeight: 700,
                    fontSize: '0.65rem',
                    borderRadius: '20px',
                    height: 22,
                    border: '1px solid rgba(167, 139, 250, 0.3)',
                  }}
                />
                <Chip
                  label="PROJECT TELEMETRY"
                  size="small"
                  sx={{
                    background: 'rgba(56, 189, 248, 0.1)',
                    color: '#7dd3fc',
                    fontWeight: 600,
                    fontSize: '0.65rem',
                    borderRadius: '20px',
                    height: 22,
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                  }}
                />
              </Stack>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  letterSpacing: '-0.04em',
                  background: 'linear-gradient(135deg, #ffffff 0%, #c4b5fd 60%, #a78bfa 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Workspace Control Center
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.75, color: 'rgba(148, 163, 184, 0.8)', fontSize: '0.875rem' }}>
                Real-time project tracking, sprint velocity telemetry, and workload distribution.
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5} sx={{ position: 'relative', zIndex: 1 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<RefreshIcon fontSize="small" />}
                onClick={() => refetch()}
                sx={{
                  borderRadius: '10px',
                  borderColor: 'rgba(139, 92, 246, 0.4)',
                  color: '#c4b5fd',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 2,
                  '&:hover': {
                    borderColor: 'rgba(167, 139, 250, 0.7)',
                    background: 'rgba(124, 58, 237, 0.15)',
                  },
                }}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={() => navigate(ROUTES.ISSUES)}
                sx={{
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                  color: '#ffffff',
                  fontWeight: 700,
                  px: 2,
                  textTransform: 'none',
                  boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #6d28d9 0%, #4338ca 100%)',
                    boxShadow: '0 6px 20px rgba(124, 58, 237, 0.5)',
                  },
                }}
              >
                + Manage Issues
              </Button>
            </Stack>
          </Stack>
        </Card>

        {/* ── 6 Stat Mini Cards ── */}
        <Grid container spacing={2}>
          {[
            { label: 'Total Tickets', value: totalIssuesCount, badge: 'ALL ISSUES', icon: <AssignmentOutlinedIcon fontSize="small" />, color: '#6366f1' },
            { label: 'In Progress', value: inProgressIssuesCount, badge: 'ACTIVE SPRINT', icon: <ShowChartIcon fontSize="small" />, color: '#f59e0b' },
            { label: 'Completed', value: completedIssuesCount, badge: `${sprintCompletionPercent}% RATE`, icon: <CheckCircleOutlinedIcon fontSize="small" />, color: '#10b981' },
            { label: 'Overdue / At Risk', value: overdueIssuesCount, badge: 'NEEDS ACTION', icon: <WarningAmberOutlinedIcon fontSize="small" />, color: '#f43f5e' },
            { label: 'Active Projects', value: mockProjects.length, badge: 'WORKSPACE', icon: <FolderOutlinedIcon fontSize="small" />, color: '#06b6d4' },
            { label: 'Team Members', value: mockUsers.length, badge: 'COLLABORATORS', icon: <GroupsOutlinedIcon fontSize="small" />, color: '#8b5cf6' },
          ].map((stat) => (
            <Grid key={stat.label} size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
              <Card sx={statCard(stat.color)}>
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, p: 2, pb: 0 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'rgba(148, 163, 184, 0.7)', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.02em' }}>
                      {stat.label}
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 800,
                        mt: 0.25,
                        background: `linear-gradient(135deg, #ffffff 0%, ${stat.color} 100%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {stat.value}
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: `${stat.color}18`,
                      color: stat.color,
                      width: 34,
                      height: 34,
                      border: `1px solid ${stat.color}30`,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                </Stack>
                <Box sx={{ px: 2, pb: 1.5 }}>
                  <Chip
                    label={stat.badge}
                    size="small"
                    sx={{
                      bgcolor: `${stat.color}18`,
                      color: stat.color,
                      fontSize: '0.625rem',
                      height: 18,
                      fontWeight: 700,
                      border: `1px solid ${stat.color}28`,
                    }}
                  />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* ── Sprint Health Banner ── */}
        <Box
          sx={{
            p: 2,
            borderRadius: '12px',
            background: 'rgba(124, 58, 237, 0.08)',
            border: '1px solid rgba(139, 92, 246, 0.18)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <Typography variant="caption" sx={{ fontSize: '0.82rem', color: 'rgba(196, 181, 253, 0.9)', lineHeight: 1.6 }}>
            <strong style={{ color: '#c4b5fd' }}>Sprint 24 Health:</strong>{' '}
            <strong style={{ color: '#ffffff' }}>{sprintCompletionPercent}% completion rate</strong>. {inProgressIssuesCount} tickets currently in
            progress across active development streams.{' '}
            {overdueIssuesCount > 0
              ? <span style={{ color: '#f87171' }}>{overdueIssuesCount} overdue issue(s) require immediate triage.</span>
              : <span style={{ color: '#34d399' }}>All issues are on schedule.</span>}
          </Typography>
        </Box>

        {/* ── Super Admin / Admin Dashboard ── */}
        {isSuperOrAdmin && (
          <Stack spacing={3}>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <SummaryCard label="Total Users" value={mockUsers.length} change="+4 this week" changeType="positive" icon={<GroupsOutlinedIcon />} color="#8b5cf6" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <SummaryCard label="Total Projects" value={mockProjects.length} change="5 Active" changeType="positive" icon={<FolderOutlinedIcon />} color="#3b82f6" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <SummaryCard label="Completed Issues" value={completedIssuesCount} change={`${sprintCompletionPercent}% rate`} changeType="positive" icon={<CheckCircleOutlinedIcon />} color="#10b981" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <SummaryCard label="Overdue Issues" value={overdueIssuesCount} change="Requires attention" changeType="negative" icon={<WarningAmberOutlinedIcon />} color="#ef4444" />
              </Grid>
            </Grid>

            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ ...glassCard, height: '100%' }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '0.95rem', mb: 2, color: '#e2d9f3' }}>
                      System Activity & Audit Telemetry
                    </Typography>
                    <Stack spacing={0.5}>
                      {mockActivityItems.slice(0, 5).map((act) => (
                        <ActivityCard key={act.id} activity={act} />
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <ChartCard title="Workspace Issue Distribution" subtitle="Live status breakdown across board columns" height={240}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={statusDistributionData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                        {statusDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        contentStyle={{
                          background: 'rgba(15, 20, 40, 0.95)',
                          border: '1px solid rgba(139, 92, 246, 0.3)',
                          borderRadius: '10px',
                          color: '#e2d9f3',
                        }}
                        formatter={(val) => [`${val ?? 0} issues`, 'Count']}
                      />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '0.75rem', color: '#94a3b8' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>
              </Grid>
            </Grid>
          </Stack>
        )}

        {/* ── Project Manager Dashboard ── */}
        {role === 'Project Manager' && (
          <Stack spacing={3}>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <SummaryCard label="My Managed Projects" value={3} change="On Track" changeType="positive" icon={<FolderOutlinedIcon />} color="#6366f1" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <SummaryCard label="Sprint 24 Completion" value={`${sprintCompletionPercent}%`} change={`${completedIssuesCount} of ${totalIssuesCount} done`} changeType="positive" icon={<CheckCircleOutlinedIcon />} color="#10b981" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <SummaryCard label="Open Project Issues" value={totalIssuesCount - completedIssuesCount} change={`${inProgressIssuesCount} in progress`} changeType="neutral" icon={<AssignmentOutlinedIcon />} color="#f59e0b" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <SummaryCard label="Overdue Tasks" value={overdueIssuesCount} change="Action Needed" changeType="negative" icon={<WarningAmberOutlinedIcon />} color="#ef4444" />
              </Grid>
            </Grid>

            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, md: 6 }}>
                <ChartCard title="Sprint Burnup Trajectory" subtitle="Completed vs created issue velocity" height={240}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockWeeklyProgress} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.12)" />
                      <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                      <RechartsTooltip
                        contentStyle={{
                          background: 'rgba(15, 20, 40, 0.95)',
                          border: '1px solid rgba(139, 92, 246, 0.3)',
                          borderRadius: '10px',
                          color: '#e2d9f3',
                        }}
                      />
                      <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} name="Completed" />
                      <Line type="monotone" dataKey="created" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" dot={false} name="Created" />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '0.75rem', color: '#94a3b8' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartCard>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ ...glassCard, height: '100%' }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '0.95rem', mb: 2, color: '#e2d9f3' }}>
                      Recent Project Milestones
                    </Typography>
                    <Stack spacing={0.5}>
                      {mockActivityItems.slice(0, 5).map((act) => (
                        <ActivityCard key={act.id} activity={act} />
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Stack>
        )}

        {/* ── Team Lead Dashboard ── */}
        {role === 'Team Lead' && (
          <Stack spacing={3}>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <SummaryCard label="My Team Members" value={5} change="Active" changeType="positive" icon={<GroupsOutlinedIcon />} color="#ec4899" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <SummaryCard label="Total Sprint Issues" value={totalIssuesCount} change={`${inProgressIssuesCount} in progress`} changeType="neutral" icon={<AssignmentOutlinedIcon />} color="#3b82f6" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <SummaryCard label="Pending In Review" value={issues.filter((i) => i.status === 'review').length} change="Review Needed" changeType="negative" icon={<WarningAmberOutlinedIcon />} color="#f59e0b" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <SummaryCard label="Team Velocity" value={`${completedIssuesCount} done`} change="Capacity OK" changeType="positive" icon={<CheckCircleOutlinedIcon />} color="#10b981" />
              </Grid>
            </Grid>

            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ ...glassCard, height: '100%' }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '0.95rem', mb: 2, color: '#e2d9f3' }}>
                      Team Activity Stream
                    </Typography>
                    <Stack spacing={0.5}>
                      {mockActivityItems.slice(0, 5).map((act) => (
                        <ActivityCard key={act.id} activity={act} />
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ ...glassCard, height: '100%' }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '0.95rem', mb: 2, color: '#e2d9f3' }}>
                      Assigned Team Tasks
                    </Typography>
                    <Stack spacing={1.5}>
                      {myAssignedIssues.slice(0, 4).map((iss) => (
                        <Box
                          key={iss.id}
                          onClick={() => openDrawer(iss.id)}
                          sx={{
                            p: 1.5,
                            borderRadius: '10px',
                            background: 'rgba(139, 92, 246, 0.07)',
                            border: '1px solid rgba(139, 92, 246, 0.18)',
                            cursor: 'pointer',
                            transition: 'all 0.18s ease',
                            '&:hover': {
                              background: 'rgba(124, 58, 237, 0.15)',
                              borderColor: 'rgba(167, 139, 250, 0.4)',
                            },
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#e2d9f3' }}>
                            {iss.title}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(148, 163, 184, 0.7)' }}>
                            {iss.key} • Priority: {iss.priority.toUpperCase()}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Stack>
        )}

        {/* ── Member Dashboard ── */}
        {role === 'Member' && (
          <Stack spacing={3}>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <SummaryCard label="My Tasks" value={myAssignedIssues.length} change="In Progress" changeType="positive" icon={<AssignmentOutlinedIcon />} color="#6366f1" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <SummaryCard label="Due Soon" value={myAssignedIssues.filter((i) => i.status !== 'done').length} change="Priority focus" changeType="negative" icon={<WarningAmberOutlinedIcon />} color="#ef4444" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <SummaryCard label="Completed Tasks" value={myAssignedIssues.filter((i) => i.status === 'done').length} change="Sprint 24" changeType="positive" icon={<CheckCircleOutlinedIcon />} color="#10b981" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <SummaryCard label="Unread Digest" value={2} change="Updated" changeType="neutral" icon={<FolderOutlinedIcon />} color="#3b82f6" />
              </Grid>
            </Grid>

            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ ...glassCard, height: '100%' }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '0.95rem', mb: 2, color: '#e2d9f3' }}>
                      My Active Tasks ({myAssignedIssues.length})
                    </Typography>
                    <Stack spacing={1.5}>
                      {myAssignedIssues.map((issue) => (
                        <Box
                          key={issue.id}
                          sx={{
                            p: 1.5,
                            borderRadius: '10px',
                            background: 'rgba(139, 92, 246, 0.07)',
                            border: '1px solid rgba(139, 92, 246, 0.18)',
                            cursor: 'pointer',
                            transition: 'all 0.18s ease',
                            '&:hover': {
                              background: 'rgba(124, 58, 237, 0.15)',
                              borderColor: 'rgba(167, 139, 250, 0.4)',
                            },
                          }}
                          onClick={() => openDrawer(issue.id)}
                        >
                          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'rgba(167, 139, 250, 0.8)' }}>
                              {issue.key}
                            </Typography>
                            <Chip
                              label={issue.priority}
                              size="small"
                              sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700 }}
                            />
                          </Stack>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#e2d9f3' }}>
                            {issue.title}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ ...glassCard, height: '100%' }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '0.95rem', mb: 2, color: '#e2d9f3' }}>
                      Recent Activity
                    </Typography>
                    <Stack spacing={0.5}>
                      {mockActivityItems.slice(0, 5).map((act) => (
                        <ActivityCard key={act.id} activity={act} />
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Stack>
        )}

        {/* ── Viewer & Guest Dashboard ── */}
        {(role === 'Viewer' || role === 'Guest') && (
          <Stack spacing={3}>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <SummaryCard label="Read-Only Workspace Access" value="Viewer Mode" change="Active" changeType="neutral" icon={<FolderOutlinedIcon />} color="#64748b" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <SummaryCard label="Assigned Projects" value={role === 'Guest' ? 1 : 5} change="Read-Only" changeType="neutral" icon={<CheckCircleOutlinedIcon />} color="#3b82f6" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <SummaryCard label="Workspace Sprint" value="Sprint 24" change={`${sprintCompletionPercent}% Complete`} changeType="positive" icon={<AssignmentOutlinedIcon />} color="#10b981" />
              </Grid>
            </Grid>

            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, md: 6 }}>
                <ChartCard title="Issue Status Distribution" subtitle="Read-only view of workspace issues" height={240}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={statusDistributionData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                        {statusDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        contentStyle={{
                          background: 'rgba(15, 20, 40, 0.95)',
                          border: '1px solid rgba(139, 92, 246, 0.3)',
                          borderRadius: '10px',
                          color: '#e2d9f3',
                        }}
                        formatter={(val) => [`${val ?? 0} issues`, 'Count']}
                      />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '0.75rem', color: '#94a3b8' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ ...glassCard, height: '100%' }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '0.95rem', mb: 2, color: '#e2d9f3' }}>
                      Read-Only Activity Stream
                    </Typography>
                    <Stack spacing={0.5}>
                      {mockActivityItems.slice(0, 5).map((act) => (
                        <ActivityCard key={act.id} activity={act} />
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Stack>
        )}
      </Stack>

      <IssueDetailsDrawer />
    </Container>
  );
}
