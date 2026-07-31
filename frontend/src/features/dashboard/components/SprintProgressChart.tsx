import { Card, CardContent, Typography, Box, Stack, Chip } from '@mui/material';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';

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
  const inProgressPercent = total > 0 ? Math.round((inProgress / total) * 100) : 0;
  
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (completePercent / 100) * circumference;

  return (
    <Card sx={{ borderRadius: '12px', boxShadow: '0px 2px 8px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', height: '100%' }}>
      <CardContent sx={{ p: '24px !important', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {sprintName} Progress
          </Typography>
          <Chip label="Active" size="small" sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600, bgcolor: '#f3e8ff', color: '#9333ea', borderRadius: '6px' }} />
        </Stack>

        <Stack direction="row" spacing={4} sx={{ alignItems: 'center', flexGrow: 1 }}>
          <Box sx={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }}>
            {/* Background Circle */}
            <svg width="100" height="100">
              <circle
                stroke="#f1f5f9"
                strokeWidth="12"
                fill="transparent"
                r={radius}
                cx="50"
                cy="50"
              />
              {/* Progress Circle */}
              <circle
                stroke="#6366f1"
                strokeWidth="12"
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
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', mt: 0.5 }}>
                Complete
              </Typography>
            </Box>
          </Box>

          <Box sx={{ flexGrow: 1 }}>
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {sprintName}
              </Typography>
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', color: 'text.secondary' }}>
                <Typography variant="caption" sx={{ fontWeight: 500 }}>
                  {startDate} - {endDate}
                </Typography>
                <CalendarTodayOutlinedIcon sx={{ fontSize: '0.8rem' }} />
              </Stack>
            </Stack>

            {/* Horizontal Progress Bar */}
            <Box sx={{ width: '100%', height: 8, bgcolor: '#f1f5f9', borderRadius: '4px', display: 'flex', overflow: 'hidden', mb: 2 }}>
              <Box sx={{ width: `${completePercent}%`, bgcolor: '#10b981' }} />
              <Box sx={{ width: `${inProgressPercent}%`, bgcolor: '#f59e0b' }} />
            </Box>

            <Stack direction="row" spacing={3} sx={{ alignItems: 'center' }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981' }} />
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  <Box component="span" sx={{ color: 'text.primary', fontWeight: 600 }}>{completed}</Box> Completed
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#f59e0b' }} />
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  <Box component="span" sx={{ color: 'text.primary', fontWeight: 600 }}>{inProgress}</Box> In Progress
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#94a3b8' }} />
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  <Box component="span" sx={{ color: 'text.primary', fontWeight: 600 }}>{todo}</Box> To Do
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
