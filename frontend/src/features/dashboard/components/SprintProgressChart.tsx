import { Card, CardContent, Typography, Box, Stack, Chip, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface SprintProgressChartProps {
  sprintName: string;
  startDate: string;
  endDate: string;
  completed: number;
  inProgress: number;
  todo: number;
  total: number;
}

export function SprintProgressChart({
  sprintName,
  startDate,
  endDate,
  completed,
  inProgress,
  todo,
  total,
}: SprintProgressChartProps) {
  const completePercent = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (completePercent / 100) * circumference;

  return (
    <Card sx={{ borderRadius: '12px', boxShadow: '0px 2px 8px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', height: '60%' }}>
      <CardContent sx={{ p: '24px !important', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {sprintName} Progress
            </Typography>
            <Chip label="Active" size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, bgcolor: '#faf5ff', color: '#7c3aed', borderRadius: '6px' }} />
          </Stack>
          <Link component={RouterLink} to="/issues" underline="hover" sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563eb' }}>
            View details
          </Link>
        </Stack>

        <Stack direction="row" spacing={3} sx={{ alignItems: 'center', flexGrow: 1 }}>
          <Box sx={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }}>
            {/* Background Circle */}
            <svg width="100" height="100">
              <circle
                stroke="#f1f5f9"
                strokeWidth="10"
                fill="transparent"
                r={radius}
                cx="50"
                cy="50"
              />
              {/* Progress Circle */}
              <circle
                stroke="#2563eb"
                strokeWidth="10"
                strokeLinecap="round"
                fill="transparent"
                r={radius}
                cx="50"
                cy="50"
                style={{
                  strokeDasharray,
                  strokeDashoffset,
                  transform: 'rotate(-90deg)',
                  transformOrigin: '50% 50%',
                  transition: 'stroke-dashoffset 0.5s ease 0s',
                }}
              />
            </svg>
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1 }}>
                {completePercent}%
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', mt: 0.5, fontWeight: 500 }}>
                Complete
              </Typography>
            </Box>
          </Box>

          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ mb: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', display: 'inline-block' }}>
                {sprintName}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25, fontWeight: 500 }}>
                {startDate} – {endDate}
              </Typography>
              {/* Blue horizontal progress bar */}
              <Box sx={{ width: '100%', height: 6, bgcolor: '#f1f5f9', borderRadius: '3px', mt: 1, overflow: 'hidden' }}>
                <Box sx={{ width: `${completePercent}%`, height: '100%', bgcolor: '#2563eb' }} />
              </Box>
            </Box>

            <Stack spacing={1.25}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#16a34a' }} />
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>Completed</Typography>
                </Stack>
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>{completed}</Typography>
              </Stack>

              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ea580c' }} />
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>In Progress</Typography>
                </Stack>
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>{inProgress}</Typography>
              </Stack>

              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#94a3b8' }} />
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>Pending</Typography>
                </Stack>
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>{todo}</Typography>
              </Stack>

              <Box sx={{ pt: 1, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>Total Issues</Typography>
                <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary' }}>{total}</Typography>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
