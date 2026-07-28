import React from 'react';
import { Card, CardContent, Typography, Box, Stack } from '@mui/material';

export interface ChartCardProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  height?: number | string;
}

export function ChartCard({ title, subtitle, action, children, height = 300 }: ChartCardProps) {
  return (
    <Card
      sx={{
        borderRadius: '16px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(145deg, rgba(17, 24, 50, 0.85) 0%, rgba(12, 18, 38, 0.9) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.18)',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      }}
    >
      <CardContent sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: '0.95rem',
                letterSpacing: '-0.01em',
                color: '#e2d9f3',
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'rgba(148, 163, 184, 0.7)', mt: 0.25 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          {action && <Box>{action}</Box>}
        </Stack>
        <Box sx={{ width: '100%', height, flex: 1, minHeight: height }}>{children}</Box>
      </CardContent>
    </Card>
  );
}
