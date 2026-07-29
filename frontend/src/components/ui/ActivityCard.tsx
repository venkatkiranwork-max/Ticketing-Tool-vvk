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
        py: 1,
        borderBottom: '1px solid',
        borderColor: 'divider',
        '&:last-child': { borderBottom: 'none' },
      }}
    >
      <Avatar
        src={user.avatarUrl}
        sx={{
          width: 28,
          height: 28,
          fontSize: '0.7rem',
          fontWeight: 600,
          bgcolor: 'primary.main',
          flexShrink: 0,
        }}
      >
        {firstName[0]}
      </Avatar>
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" sx={{ lineHeight: 1.5, fontSize: '0.82rem' }}>
          <strong>{firstName} {lastName}</strong>{' '}
          <span style={{ color: 'inherit', opacity: 0.7 }}>{activity.action || ''}</span>{' '}
          <strong>{activity.target || ''}</strong>
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.72rem' }}>
          {activity.timestamp || ''}
        </Typography>
      </Box>
    </Stack>
  );
}
