import { Card, CardContent, Typography, Box, Stack, Select, MenuItem } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface IssueDistributionChartProps {
  distribution: Record<string, number>;
}

// Clean status badge styling matching custom tags
const statusConfig: Record<string, { label: string; color: string }> = {
  todo: { label: 'To Do', color: '#7c3aed' },
  in_progress: { label: 'In Progress', color: '#ea580c' },
  review: { label: 'In Review', color: '#2563eb' },
  done: { label: 'Completed', color: '#16a34a' },
  backlog: { label: 'Backlog', color: '#64748b' },
};

export function IssueDistributionChart({ distribution }: IssueDistributionChartProps) {
  // Normalize casing of distribution keys (e.g. from API) to lowercase
  const normalizedDistribution: Record<string, number> = {};
  Object.keys(distribution || {}).forEach((key) => {
    normalizedDistribution[key.toLowerCase()] = distribution[key];
  });

  const data = Object.keys(statusConfig)
    .map((key) => ({
      name: statusConfig[key].label,
      value: normalizedDistribution[key] || 0,
      color: statusConfig[key].color,
    }))
    .filter((d) => d.value > 0);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card sx={{ borderRadius: '12px', boxShadow: '0px 2px 8px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', height: '60%' }}>
      <CardContent sx={{ p: '24px !important', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Issue Distributions
          </Typography>
          <Select
            value="All Projects"
            size="small"
            sx={{
              height: 28,
              fontSize: '0.75rem',
              fontWeight: 600,
              bgcolor: '#f8fafc',
              color: 'text.secondary',
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              borderRadius: '6px',
            }}
          >
            <MenuItem value="All Projects" sx={{ fontSize: '0.75rem' }}>All Projects</MenuItem>
          </Select>
        </Stack>

        <Stack direction="row" spacing={3} sx={{ alignItems: 'center', flexGrow: 1 }}>
          <Box sx={{ width: 130, height: 130, position: 'relative', flexShrink: 0 }}>
            {total === 0 ? (
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  border: '8px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                  No issues
                </Typography>
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <ResponsiveContainer>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={42}
                      outerRadius={60}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </ResponsiveContainer>
                </PieChart>
              </ResponsiveContainer>
            )}
            {total > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1 }}>
                  {total}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', mt: 0.25, fontWeight: 500 }}>
                  Total
                </Typography>
              </Box>
            )}
          </Box>

          <Stack spacing={1.5} sx={{ flexGrow: 1 }}>
            {data.map((item) => (
              <Stack key={item.name} direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.color }} />
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    {item.name}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {item.value}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', width: 35, textAlign: 'right', fontWeight: 500 }}>
                    ({Math.round((item.value / total) * 100)}%)
                  </Typography>
                </Stack>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
