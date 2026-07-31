import { Card, CardContent, Typography, Box, Stack } from '@mui/material';

interface PriorityBreakdownProps {
  priorities: Record<string, number>;
}

const config = [
  { key: 'high', label: 'High', color: '#ef4444' },
  { key: 'medium', label: 'Medium', color: '#f59e0b' },
  { key: 'low', label: 'Low', color: '#10b981' },
];

export function PriorityBreakdown({ priorities }: PriorityBreakdownProps) {
  const total = Object.values(priorities).reduce((a, b) => a + b, 0) || 1;

  return (
    <Card sx={{ borderRadius: '12px', boxShadow: '0px 2px 8px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', height: '100%' }}>
      <CardContent sx={{ p: '24px !important' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', mb: 3 }}>
          Priority Breakdown
        </Typography>

        <Stack spacing={2.5}>
          {config.map((item) => {
            const count = priorities[item.key] || 0;
            const percent = Math.round((count / total) * 100);

            return (
              <Stack key={item.key} direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, width: 55, flexShrink: 0 }}>
                  {item.label}
                </Typography>
                <Box sx={{ flexGrow: 1, height: 6, bgcolor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                  <Box sx={{ width: `${percent}%`, height: '100%', bgcolor: item.color, borderRadius: '4px' }} />
                </Box>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', width: 60, flexShrink: 0, justifyContent: 'flex-end' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {count}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    ({percent}%)
                  </Typography>
                </Stack>
              </Stack>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
}
