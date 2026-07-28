import { Avatar, Badge, Tooltip } from '@mui/material';
import type { MockUser } from '@/mock/users';

export interface UserAvatarProps {
  user?: MockUser;
  name?: string;
  avatarUrl?: string;
  size?: number;
  showStatus?: boolean;
  online?: boolean;
}

export function UserAvatar({ user, name, avatarUrl, size = 32, showStatus = false, online }: UserAvatarProps) {
  const displayName = name || (user ? `${user.firstName} ${user.lastName}` : 'User');
  const src = avatarUrl || user?.avatarUrl;
  const isOnline = online !== undefined ? online : user?.online;
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('');

  const avatar = (
    <Avatar src={src} sx={{ width: size, height: size, fontSize: size * 0.4, fontWeight: 700 }}>
      {initials}
    </Avatar>
  );

  return (
    <Tooltip title={displayName}>
      {showStatus ? (
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          variant="dot"
          sx={{
            '& .MuiBadge-badge': {
              backgroundColor: isOnline ? '#10b981' : '#94a3b8',
              color: isOnline ? '#10b981' : '#94a3b8',
              boxShadow: (theme) => `0 0 0 2px ${theme.palette.background.paper}`,
              width: 10,
              height: 10,
              borderRadius: '50%',
            },
          }}
        >
          {avatar}
        </Badge>
      ) : (
        avatar
      )}
    </Tooltip>
  );
}
