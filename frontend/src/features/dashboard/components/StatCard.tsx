import { Card, CardContent, Typography, Box, Stack } from '@mui/material';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';

interface StatCardProps {
  title: string;
  value: number;
  trendValue: number;
  trendText: string;
  icon: React.ReactNode;
  iconColor: string;
  iconBgColor: string;
  trendlineColor: string;
  trendlineData: number[]; // e.g. [1, 3, 2, 5, 4, 6]
}

export function StatCard({
  title,
  value,
  trendValue,
  trendText,
  icon,
  iconColor,
  iconBgColor,
  trendlineColor,
  trendlineData,
}: StatCardProps) {
  const isPositiveTrend = trendValue >= 0;

  // Simple SVG generation for trendline
  const svgWidth = 100;
  const svgHeight = 24;
  const maxData = Math.max(...trendlineData, 1);
  const minData = Math.min(...trendlineData, 0);
  
  const points = trendlineData
    .map((d, i) => {
      const x = (i / (trendlineData.length - 1 || 1)) * svgWidth;
      const y = svgHeight - ((d - minData) / (maxData - minData || 1)) * svgHeight;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <Card sx={{ borderRadius: '12px', boxShadow: '0px 2px 8px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
      <CardContent sx={{ p: '20px !important' }}>
        <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '8px',
                bgcolor: iconBgColor,
                color: iconColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '& svg': { fontSize: '1.25rem' }
              }}
            >
              {icon}
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
              {title}
            </Typography>
          </Stack>
        </Stack>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1.5, letterSpacing: '-0.02em' }}>
          {value}
        </Typography>
        <Stack direction="row" sx={{ alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
            {isPositiveTrend ? (
              <TrendingUpRoundedIcon sx={{ fontSize: '1rem', color: 'success.main' }} />
            ) : (
              <TrendingDownRoundedIcon sx={{ fontSize: '1rem', color: 'error.main' }} />
            )}
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, color: isPositiveTrend ? 'success.main' : 'error.main' }}
            >
              {isPositiveTrend ? '+' : ''}{trendValue}%
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', ml: 0.5 }}>
              {trendText}
            </Typography>
          </Stack>
          
          <Box sx={{ width: 60, height: 24, opacity: 0.8 }}>
            <svg viewBox={`0 -4 ${svgWidth} ${svgHeight + 8}`} preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
              <polyline
                fill="none"
                stroke={trendlineColor}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
            </svg>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
