import {
  Container,
  Grid,
  Stack,
  Typography,
  Box,
  Button,
  CircularProgress,
} from '@mui/material';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded';
import SyncAltRoundedIcon from '@mui/icons-material/SyncAltRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded';

import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { useAuthStore } from '@/store/authStore';

import { useDashboardSummary } from '@/features/dashboard/useDashboard';
import { StatCard } from '@/features/dashboard/components/StatCard';
import { SprintProgressChart } from '@/features/dashboard/components/SprintProgressChart';
import { IssueDistributionChart } from '@/features/dashboard/components/IssueDistributionChart';
import { ActivityFeed } from '@/features/dashboard/components/ActivityFeed';
import { RecentIssuesList } from '@/features/dashboard/components/RecentIssuesList';
import { PriorityBreakdown } from '@/features/dashboard/components/PriorityBreakdown';
import { UpcomingDeadlines } from '@/features/dashboard/components/UpcomingDeadlines';
import { ProjectOverviewCard } from '@/features/dashboard/components/ProjectOverviewCard';

export function DashboardPage() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.user);
  
  const { data: dashboardData, isLoading, error } = useDashboardSummary();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !dashboardData) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error">Failed to load dashboard data.</Typography>
      </Box>
    );
  }

  const {
    stats,
    sprintProgress,
    issueDistribution,
    priorityBreakdown,
    recentIssues,
    upcomingDeadlines,
    recentActivity,
    projectStats,
  } = dashboardData;

  const statCardsData = [
    { label: 'Total Tickets', value: stats.totalIssues, trend: 12, trendText: 'from last week', icon: <ConfirmationNumberRoundedIcon />, iconColor: '#8b5cf6', iconBgColor: '#f3e8ff', trendColor: '#8b5cf6', trendData: [2, 4, 3, 5, 4, 6] },
    { label: 'In Progress', value: stats.inProgressIssues, trend: 8, trendText: 'from last week', icon: <SyncAltRoundedIcon />, iconColor: '#f59e0b', iconBgColor: '#fef3c7', trendColor: '#f59e0b', trendData: [1, 2, 4, 3, 5, 4] },
    { label: 'Completed', value: stats.completedIssues, trend: 20, trendText: 'from last week', icon: <CheckCircleRoundedIcon />, iconColor: '#10b981', iconBgColor: '#dcfce7', trendColor: '#10b981', trendData: [1, 2, 3, 4, 5, 7] },
    { label: 'Overdue', value: stats.overdueIssues, trend: -5, trendText: 'from last week', icon: <ErrorOutlineRoundedIcon />, iconColor: '#ef4444', iconBgColor: '#fee2e2', trendColor: '#ef4444', trendData: [6, 5, 6, 4, 3, 2] },
    { label: 'Active Projects', value: stats.totalProjects, trend: 2, trendText: 'from last week', icon: <FolderOpenRoundedIcon />, iconColor: '#3b82f6', iconBgColor: '#dbeafe', trendColor: '#3b82f6', trendData: [1, 1, 2, 2, 3, 3] },
  ];

  return (
    <Container maxWidth="xl" disableGutters sx={{ py: 3, px: { xs: 2, md: 4 }, width: '100%', overflow: 'hidden' }}>
      <Stack spacing={3}>
        {/* Header */}
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'flex-end' }, gap: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
              Welcome back, {currentUser?.firstName || 'User'}! <span>👋</span>
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              Here's what's happening with your workspace today.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              startIcon={<FilterListRoundedIcon fontSize="small" />}
              sx={{ borderRadius: '8px', fontWeight: 600, borderColor: 'divider', color: 'text.primary', '&:hover': { borderColor: '#cbd5e1', bgcolor: '#f8fafc' } }}
            >
              Filter
            </Button>
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon fontSize="small" />}
              onClick={() => navigate(ROUTES.ISSUES)}
              sx={{ borderRadius: '8px', fontWeight: 600, bgcolor: '#6366f1', '&:hover': { bgcolor: '#4f46e5' }, boxShadow: 'none' }}
            >
              New Issue
            </Button>
          </Stack>
        </Stack>

        {/* Top Stat Cards */}
        <Grid container spacing={2.5}>
          {statCardsData.map((stat, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
              <StatCard
                title={stat.label}
                value={stat.value}
                trendValue={stat.trend}
                trendText={stat.trendText}
                icon={stat.icon}
                iconColor={stat.iconColor}
                iconBgColor={stat.iconBgColor}
                trendlineColor={stat.trendColor}
                trendlineData={stat.trendData}
              />
            </Grid>
          ))}
        </Grid>

        {/* Middle Row */}
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 4 }}>
            <SprintProgressChart
              sprintName="Sprint 24"
              startDate="Jul 22"
              endDate="Aug 5"
              completed={sprintProgress.completed}
              inProgress={sprintProgress.inProgress}
              todo={sprintProgress.todo}
              total={sprintProgress.total}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <IssueDistributionChart distribution={issueDistribution} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <ActivityFeed activities={recentActivity} />
          </Grid>
        </Grid>

        {/* Bottom Row */}
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 4 }}>
            <RecentIssuesList issues={recentIssues} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <PriorityBreakdown priorities={priorityBreakdown} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <UpcomingDeadlines deadlines={upcomingDeadlines} />
          </Grid>
        </Grid>

        {/* Projects Overview */}
        <Box sx={{ pt: 1 }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
              Projects Overview
            </Typography>
            <Button size="small" sx={{ fontWeight: 600, color: '#6366f1' }}>
              View all projects
            </Button>
          </Stack>
          <Grid container spacing={2.5}>
            {projectStats.map((project) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }} key={project._id}>
                <ProjectOverviewCard project={project} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Stack>

          </Container>
  );
}

