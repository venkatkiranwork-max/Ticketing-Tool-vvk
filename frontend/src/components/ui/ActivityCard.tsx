import { Box, Typography, Stack, Avatar } from '@mui/material';
import type { MockActivityItem } from '@/mock/activity';

export interface ActivityCardProps {
  activity: MockActivityItem;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const user = activity?.user || { firstName: 'User', lastName: '', avatarUrl: undefined };
  const firstName = user.firstName || 'User';
  const lastName = user.lastName || '';

  return (
    <Stack
      direction="row"
      spacing={1.5}
      sx={{
        alignItems: 'flex-start',
        py: 1.25,
        borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
        '&:last-child': { borderBottom: 'none' },
      }}
    >
      <Avatar
        src={user.avatarUrl}
        sx={{
          width: 30,
          height: 30,
          fontSize: '0.72rem',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
          boxShadow: '0 2px 8px rgba(124, 58, 237, 0.3)',
          flexShrink: 0,
        }}
      >
        {firstName[0]}
      </Avatar>
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" sx={{ lineHeight: 1.5, color: '#e2d9f3', fontSize: '0.82rem' }}>
          <strong style={{ color: '#ffffff' }}>
            {firstName} {lastName}
          </strong>{' '}
          <span style={{ color: 'rgba(148, 163, 184, 0.8)' }}>{activity.action || ''}</span>{' '}
          <strong style={{ color: '#a78bfa' }}>{activity.target || ''}</strong>
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(100, 116, 139, 0.8)', fontSize: '0.72rem' }}>
          {activity.timestamp || ''}
        </Typography>
      </Box>
    </Stack>
  );
}
