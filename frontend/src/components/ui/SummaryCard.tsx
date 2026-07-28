import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Stack } from '@mui/material';

export interface SummaryCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
  color?: string;
}

export function SummaryCard({ label, value, change, changeType = 'positive', icon, color = '#7c3aed' }: SummaryCardProps) {
  const getBadgeStyle = () => {
    if (changeType === 'positive') return { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: 'rgba(16, 185, 129, 0.25)' };
    if (changeType === 'negative') return { bg: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: 'rgba(239, 68, 68, 0.25)' };
    return { bg: 'rgba(148, 163, 184, 0.1)', color: '#94a3b8', border: 'rgba(148, 163, 184, 0.2)' };
  };

  const badge = getBadgeStyle();

  return (
    <Card
      sx={{
        borderRadius: '16px',
        background: 'linear-gradient(145deg, rgba(17, 24, 50, 0.85) 0%, rgba(12, 18, 38, 0.9) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.18)',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: `0 12px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px ${color}40`,
          borderColor: `${color}50`,
        },
      }}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, fontSize: '0.8rem', color: 'rgba(148, 163, 184, 0.8)', letterSpacing: '0.03em' }}
            >
              {label}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                mt: 0.5,
                letterSpacing: '-0.03em',
                background: `linear-gradient(135deg, #ffffff 0%, ${color} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {value}
            </Typography>
          </Box>
          {icon && (
            <Box
              sx={{
                p: 1.25,
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${color}22 0%, ${color}10 100%)`,
                border: `1px solid ${color}30`,
                color: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 4px 12px ${color}20`,
              }}
            >
              {icon}
            </Box>
          )}
        </Stack>
        {change && (
          <Box sx={{ mt: 1.5 }}>
            <Chip
              label={change}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.7rem',
                fontWeight: 700,
                bgcolor: badge.bg,
                color: badge.color,
                border: `1px solid ${badge.border}`,
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
