import {
  Container,
  Grid,
  Stack,
  Typography,
  Box,
  Button,
  CircularProgress,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded';
import SyncAltRoundedIcon from '@mui/icons-material/SyncAltRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';

import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { useAuthStore } from '@/store/authStore';

import { useDashboardSummary } from '@/features/dashboard/useDashboard';
import { StatCard } from '@/features/dashboard/components/StatCard';
import { ActivityFeed } from '@/features/dashboard/components/ActivityFeed';
import { RecentIssuesList } from '@/features/dashboard/components/RecentIssuesList';
import { PriorityBreakdown } from '@/features/dashboard/components/PriorityBreakdown';
import { UpcomingDeadlines } from '@/features/dashboard/components/UpcomingDeadlines';
import { ProjectOverviewCard } from '@/features/dashboard/components/ProjectOverviewCard';

export function DashboardPage() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.user);

  // NOTE: assumes useDashboardSummary is a react-query style hook that exposes
  // `refetch`. If it doesn't, drop `refetch` and the "Try again" button below.
  const { data: dashboardData, isLoading, error, refetch } = useDashboardSummary();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          height: '100vh',
        }}
      >
        <CircularProgress size={32} />
        <Typography variant="body2" color="text.secondary">
          Loading your workspace…
        </Typography>
      </Box>
    );
  }

  if (error || !dashboardData) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
          height: '100vh',
          textAlign: 'center',
          px: 3,
        }}
      >
        <ErrorOutlineRoundedIcon sx={{ fontSize: 40, color: '#ef4444' }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Couldn't load your dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
          Something went wrong while fetching your data. Check your connection and try again.
        </Typography>
        {refetch && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshRoundedIcon fontSize="small" />}
            onClick={() => refetch()}
            sx={{ mt: 1, borderRadius: '8px', fontWeight: 600 }}
          >
            Try again
          </Button>
        )}
      </Box>
    );
  }

  const {
    stats,
    priorityBreakdown,
    recentIssues,
    upcomingDeadlines,
    recentActivity,
    projectStats,
  } = dashboardData;

  // Only the four core KPIs live here. "Active Projects" moved down into the
  // Projects Overview header so the same number isn't shown twice.
  const statCardsData = [
    { label: 'Total Tickets', value: stats.totalIssues, icon: <ConfirmationNumberRoundedIcon />, iconColor: '#8b5cf6', iconBgColor: '#f3e8ff' },
    { label: 'In Progress', value: stats.inProgressIssues, icon: <SyncAltRoundedIcon />, iconColor: '#f59e0b', iconBgColor: '#fef3c7' },
    { label: 'Completed', value: stats.completedIssues, icon: <CheckCircleRoundedIcon />, iconColor: '#10b981', iconBgColor: '#dcfce7' },
    { label: 'Overdue', value: stats.overdueIssues, icon: <ErrorOutlineRoundedIcon />, iconColor: '#ef4444', iconBgColor: '#fee2e2' },
  ];

  return (
    <Container maxWidth="xl" disableGutters sx={{ py: 3, px: { xs: 2, md: 4 }, width: '100%' }}>
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
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon fontSize="small" />}
            onClick={() => navigate(ROUTES.ISSUES)}
            sx={{ borderRadius: '8px', fontWeight: 600, bgcolor: '#6366f1', '&:hover': { bgcolor: '#4f46e5' }, boxShadow: 'none' }}
          >
            New Issue
          </Button>
        </Stack>

        {/* Top Stat Cards */}
        <Grid container spacing={2.5}>
          {statCardsData.map((stat, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title={stat.label}
                value={stat.value}
                icon={stat.icon}
                iconColor={stat.iconColor}
                iconBgColor={stat.iconBgColor}
              />
            </Grid>
          ))}
        </Grid>

        {/* Middle Row */}
        <Grid container spacing={2.5}>
          {/* <Grid size={{ xs: 12, md: 4 }}>
            <SprintProgressChart
              sprintName="Sprint 24"
              startDate="Jul 22"
              endDate="Aug 5"
              completed={sprintProgress.completed}
              inProgress={sprintProgress.inProgress}
              todo={sprintProgress.todo}
              total={sprintProgress.total}
            />
          </Grid> */}
          {/* <Grid size={{ xs: 12, md: 4 }}>
            <IssueDistributionChart distribution={issueDistribution} />
          </Grid> */}
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
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
                Projects Overview
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {stats.totalProjects} active project{stats.totalProjects === 1 ? '' : 's'}
              </Typography>
            </Box>
            {projectStats.length > 0 && (
              <Button
                size="small"
                onClick={() => navigate(ROUTES.PROJECTS)}
                sx={{ fontWeight: 600, color: '#6366f1' }}
              >
                View all projects
              </Button>
            )}
          </Stack>

          {projectStats.length === 0 ? (
            <Box
              sx={{
                border: '1px dashed',
                borderColor: 'divider',
                borderRadius: '12px',
                py: 5,
                textAlign: 'center',
              }}
            >
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
                No projects yet. Create one to start tracking issues.
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddRoundedIcon fontSize="small" />}
                onClick={() => navigate(ROUTES.PROJECTS)}
                sx={{ borderRadius: '8px', fontWeight: 600 }}
              >
                New Project
              </Button>
            </Box>
          ) : (
            <Grid container spacing={2.5}>
              {projectStats.map((project) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }} key={project._id}>
                  <ProjectOverviewCard project={project} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Stack>
    </Container>
  );
}