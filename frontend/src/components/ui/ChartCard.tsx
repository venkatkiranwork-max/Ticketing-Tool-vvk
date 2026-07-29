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
        borderRadius: '10px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, fontSize: '0.95rem', color: 'text.primary' }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'text.secondary', mt: 0.25 }}>
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
