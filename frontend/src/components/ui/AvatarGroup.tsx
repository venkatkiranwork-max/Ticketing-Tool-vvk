import { Avatar, AvatarGroup as MuiAvatarGroup, Tooltip } from '@mui/material';
import type { MockUser } from '@/mock/users';

export interface AvatarGroupProps {
  users: (MockUser | any)[];
  max?: number;
  size?: number;
}

export function AvatarGroup({ users = [], max = 4, size = 30 }: AvatarGroupProps) {
  const safeUsers = users
    .filter((u): u is any => Boolean(u && (typeof u === 'object' || typeof u === 'string')))
    .map((u) => {
      if (typeof u === 'string') {
        return { id: u, firstName: 'User', lastName: '', avatarUrl: undefined, role: 'Member' };
      }
      return u;
    });

  return (
    <MuiAvatarGroup
      max={max}
      sx={{
        '& .MuiAvatar-root': {
          width: size,
          height: size,
          fontSize: '0.75rem',
          fontWeight: 600,
          border: '2px solid',
          borderColor: 'background.paper',
        },
      }}
    >
      {safeUsers.map((user, idx) => {
        const firstName = user.firstName || user.userName?.split(' ')[0] || 'User';
        const lastName = user.lastName || user.userName?.split(' ')[1] || '';
        const email = user.email || user.userEmail || `user-${idx}@abctech.io`;
        const key = user.id || user._id || email || `usr-${idx}`;
        const label = `${firstName} ${lastName}`.trim();

        return (
          <Tooltip key={key} title={`${label} (${user.department || user.role || user.projectRole || 'Member'})`}>
            <Avatar src={user.avatarUrl} alt={label}>
              {firstName[0]}
              {lastName[0]}
            </Avatar>
          </Tooltip>
        );
      })}
    </MuiAvatarGroup>
  );
}
