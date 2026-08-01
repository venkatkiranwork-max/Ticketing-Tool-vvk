import {
  Container,
  Grid,
  Stack,
  Typography,
  Box,
  Button,
  CircularProgress,
  Select,
  MenuItem,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import HourglassEmptyRoundedIcon from '@mui/icons-material/HourglassEmptyRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';

import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { useAuthStore } from '@/store/authStore';

import { useDashboardSummary } from '@/features/dashboard/useDashboard';
import { StatCard } from '@/features/dashboard/components/StatCard';
import { ActivityFeed } from '@/features/dashboard/components/ActivityFeed';
import { RecentTicketsTable } from '@/features/dashboard/components/RecentTicketsTable';
import { SprintProgressChart } from '@/features/dashboard/components/SprintProgressChart';
import { IssueDistributionChart } from '@/features/dashboard/components/IssueDistributionChart';
import { IssueDetailsDrawer } from '@/components/ui/IssueDetailsDrawer';

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
    sprintProgress,
    issueDistribution,
    recentIssues,
    recentActivity,
  } = dashboardData;

  const statCardsData = [
    {
      label: 'Total Tickets',
      value: stats.totalIssues,
      icon: <AssignmentRoundedIcon />,
      iconColor: '#2563eb',
      iconBgColor: '#eff6ff',
      trendValue: 12,
      trendText: 'vs last 7 days',
    },
    {
      label: 'In Progress',
      value: stats.inProgressIssues,
      icon: <AccessTimeRoundedIcon />,
      iconColor: '#ea580c',
      iconBgColor: '#fff7ed',
      trendValue: 8,
      trendText: 'vs last 7 days',
    },
    {
      label: 'Completed',
      value: stats.completedIssues,
      icon: <CheckCircleRoundedIcon />,
      iconColor: '#16a34a',
      iconBgColor: '#f0fdf4',
      trendValue: 16,
      trendText: 'vs last 7 days',
    },
    {
      label: 'Pending',
      value: stats.pendingIssues ?? 0,
      icon: <HourglassEmptyRoundedIcon />,
      iconColor: '#7c3aed',
      iconBgColor: '#faf5ff',
      trendValue: -4,
      trendText: 'vs last 7 days',
    },
  ];

  return (
    <Container maxWidth="xl" disableGutters sx={{ py: 3, px: { xs: 2, md: 4 }, width: '100%' }}>
      <Stack spacing={3}>
        {/* Header */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'flex-end' }, gap: 2 }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
              Welcome back, {currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim() : 'User'}! <span>👋</span>
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              Here's what's happening with your work today.
            </Typography>
          </Box>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Select
              value="Jul 22 - Jul 28, 2025"
              size="small"
              renderValue={(value) => (
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{value}</span>
                </Stack>
              )}
              sx={{
                height: 38,
                borderRadius: '8px',
                bgcolor: 'background.paper',
                px: 0.5,
              }}
            >
              <MenuItem value="Jul 22 - Jul 28, 2025">Jul 22 - Jul 28, 2025</MenuItem>
            </Select>
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon fontSize="small" />}
              onClick={() => navigate(ROUTES.ISSUES)}
              sx={{
                height: 38,
                borderRadius: '8px',
                fontWeight: 600,
                bgcolor: '#2563eb',
                '&:hover': { bgcolor: '#1d4ed8' },
                boxShadow: 'none',
                textTransform: 'none',
              }}
            >
              New Issue
            </Button>
          </Stack>
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
                trendValue={stat.trendValue}
                trendText={stat.trendText}
              />
            </Grid>
          ))}
        </Grid>

        {/* Middle Row */}
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 4 }}>
            <SprintProgressChart
              sprintName="Sprint 24"
              startDate="Jul 20"
              endDate="Aug 02"
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

        {/* Bottom Row - Recent Tickets Table */}
        <Box sx={{ pt: 1 }}>
          <RecentTicketsTable issues={recentIssues} />
        </Box>
      </Stack>
      <IssueDetailsDrawer />
    </Container>
  );
}