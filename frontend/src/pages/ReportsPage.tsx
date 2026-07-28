import { useState } from 'react';
import { Container, Grid, Stack, Card, CardContent, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
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

import { PageHeader } from '@/components/ui/PageHeader';
import { ChartCard } from '@/components/ui/ChartCard';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { reportService } from '@/services/reportService';
import { useProjectsQuery } from '@/hooks/useProjectsQuery';
import { mockProjects } from '@/mock/projects';

export function ReportsPage() {
  const [selectedProject, setSelectedProject] = useState('all');
  const { data: projectsData } = useProjectsQuery();

  const projectsList = Array.isArray(projectsData) && projectsData.length > 0 ? projectsData : mockProjects;

  const projectOptions = [
    { label: 'All Workspace Projects', value: 'all' },
    ...projectsList.map((p: any) => ({ label: p.name, value: p._id || p.id })),
  ];

  const { data: reportData, isLoading } = useQuery({
    queryKey: ['reports', selectedProject],
    queryFn: () => reportService.getProjectReports(selectedProject),
  });

  const statusDistribution = reportData?.statusDistribution || [];
  const priorityDistribution = reportData?.priorityDistribution || [];
  const weeklyProgress = reportData?.weeklyProgress || [];
  const totalIssues = reportData?.totalIssues ?? 0;
  const completionRate = reportData?.completionRate ?? 0;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={3.5}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}>
          <PageHeader
            title="Reports & Analytics"
            subtitle="Real-time MongoDB telemetry feed for issue status distribution, priority breakdown, and sprint velocity trends."
          />
          <FilterDropdown
            value={selectedProject}
            onChange={(val) => setSelectedProject(val)}
            options={projectOptions}
          />
        </Stack>

        {/* Summary Telemetry Metrics */}
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card variant="outlined" sx={{ borderRadius: '14px' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                  Total Tracked Issues
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>
                  {isLoading ? '...' : totalIssues}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card variant="outlined" sx={{ borderRadius: '14px' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                  Completion Rate
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, mt: 1, color: 'success.main' }}>
                  {isLoading ? '...' : `${completionRate}%`}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={2.5}>
          {/* Status Distribution Pie Chart */}
          <Grid size={{ xs: 12, md: 4 }}>
            <ChartCard title="Status Distribution" subtitle="Live Mongo aggregation by status" height={280}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={85} paddingAngle={4} dataKey="value">
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(val) => [`${val ?? 0} issues`, 'Count']} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '0.75rem' }} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>

          {/* Priority Distribution Donut Chart */}
          <Grid size={{ xs: 12, md: 4 }}>
            <ChartCard title="Priority Distribution" subtitle="Severity breakdown mix" height={280}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={priorityDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={85} paddingAngle={4} dataKey="value">
                    {priorityDistribution.map((entry, index) => (
                      <Cell key={`cell-p-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(val) => [`${val ?? 0} issues`, 'Count']} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '0.75rem' }} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>

          {/* Weekly Progress Line Chart */}
          <Grid size={{ xs: 12, md: 4 }}>
            <ChartCard title="Weekly Progress Trend" subtitle="Live Mongo weekly creation & completion" height={280}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyProgress} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <RechartsTooltip />
                  <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} name="Completed" />
                  <Line type="monotone" dataKey="created" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" dot={false} name="Created" />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '0.75rem' }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
}
