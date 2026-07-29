import { Card, CardContent, Typography, Box, Stack, Select, MenuItem } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface IssueDistributionChartProps {
  distribution: Record<string, number>;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  todo: { label: 'To Do', color: '#cbd5e1' },
  in_progress: { label: 'In Progress', color: '#f59e0b' },
  review: { label: 'In Review', color: '#3b82f6' },
  done: { label: 'Completed', color: '#10b981' },
  backlog: { label: 'Backlog', color: '#64748b' },
};

export function IssueDistributionChart({ distribution }: IssueDistributionChartProps) {
  const data = Object.keys(distribution)
    .filter((key) => statusConfig[key])
    .map((key) => ({
      name: statusConfig[key].label,
      value: distribution[key],
      color: statusConfig[key].color,
    }))
    .filter((d) => d.value > 0);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card sx={{ borderRadius: '12px', boxShadow: '0px 2px 8px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', height: '100%' }}>
      <CardContent sx={{ p: '24px !important', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Issue Distribution
          </Typography>
          <Select
            value="All Projects"
            size="small"
            sx={{
              height: 28,
              fontSize: '0.75rem',
              fontWeight: 500,
              bgcolor: '#f8fafc',
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              borderRadius: '6px'
            }}
          >
            <MenuItem value="All Projects" sx={{ fontSize: '0.75rem' }}>All Projects</MenuItem>
          </Select>
        </Stack>

        <Stack direction="row" spacing={3} alignItems="center" sx={{ flexGrow: 1 }}>
          <Box sx={{ width: 140, height: 140, position: 'relative', flexShrink: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
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
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1 }}>
                {total}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                Total
              </Typography>
            </Box>
          </Box>

          <Stack spacing={1.5} sx={{ flexGrow: 1 }}>
            {data.map((item) => (
              <Stack key={item.name} direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.color }} />
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    {item.name}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {item.value}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', width: 35, textAlign: 'right' }}>
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
