import React from 'react';
import { Card, CardContent, Typography, Box, Stack } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import RemoveIcon from '@mui/icons-material/Remove';

export interface SummaryCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
  color?: string;
}

export function SummaryCard({
  label,
  value,
  change,
  changeType = 'positive',
  icon,
  color = '#2563eb',
}: SummaryCardProps) {
  const trendIcon =
    changeType === 'positive' ? (
      <TrendingUpIcon sx={{ fontSize: '0.8rem' }} />
    ) : changeType === 'negative' ? (
      <TrendingDownIcon sx={{ fontSize: '0.8rem' }} />
    ) : (
      <RemoveIcon sx={{ fontSize: '0.8rem' }} />
    );

  const trendColor =
    changeType === 'positive' ? '#10b981' : changeType === 'negative' ? '#ef4444' : '#94a3b8';

  return (
    <Card
      sx={{
        borderRadius: '12px',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 'none',
        transition: 'border-color 0.18s, box-shadow 0.18s',
        '&:hover': {
          borderColor: color,
          boxShadow: `0 0 0 3px ${color}18`,
        },
        position: 'relative',
        overflow: 'hidden',
        // Left accent border
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '4px',
          bgcolor: color,
          background: color,
          borderRadius: '12px 0 0 12px',
        },
      }}
    >
      <CardContent sx={{ p: 2, pl: 2.5, '&:last-child': { pb: 2 } }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, fontSize: '0.72rem', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em' }}
            >
              {label}
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, letterSpacing: '-0.02em', color: 'text.primary', mt: 0.5, lineHeight: 1 }}
            >
              {value}
            </Typography>
            {change && (
              <Stack direction="row" spacing={0.4} sx={{ alignItems: 'center', mt: 0.75, color: trendColor }}>
                {trendIcon}
                <Typography variant="caption" sx={{ fontWeight: 600, color: trendColor, fontSize: '0.72rem' }}>
                  {change}
                </Typography>
              </Stack>
            )}
          </Box>
          {icon && (
            <Box
              sx={{
                color: color,
                opacity: 0.25,
                display: 'flex',
                alignItems: 'center',
                '& svg': { fontSize: '2.2rem' },
              }}
            >
              {icon}
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
