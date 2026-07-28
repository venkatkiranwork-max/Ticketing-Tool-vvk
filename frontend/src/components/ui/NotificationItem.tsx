import { Card, CardContent, Typography, Box, Stack, Avatar, Chip, IconButton } from '@mui/material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import FolderSharedOutlinedIcon from '@mui/icons-material/FolderSharedOutlined';
import type { MockNotification } from '@/mock/notifications';

export interface NotificationItemProps {
  notification: MockNotification;
  onMarkRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const getNotificationIcon = (type: MockNotification['type']) => {
  switch (type) {
    case 'issue_assigned':
      return <AssignmentIndOutlinedIcon sx={{ color: '#3b82f6' }} />;
    case 'comment_added':
      return <CommentOutlinedIcon sx={{ color: '#8b5cf6' }} />;
    case 'sprint_started':
      return <RocketLaunchOutlinedIcon sx={{ color: '#f59e0b' }} />;
    case 'issue_completed':
      return <CheckOutlinedIcon sx={{ color: '#10b981' }} />;
    default:
      return <FolderSharedOutlinedIcon sx={{ color: '#6366f1' }} />;
  }
};

export function NotificationItem({ notification, onMarkRead, onDelete }: NotificationItemProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: '12px',
        bgcolor: notification.isRead ? 'transparent' : 'rgba(99, 102, 241, 0.04)',
        borderColor: notification.isRead ? 'divider' : 'primary.main',
        transition: 'all 0.15s ease-in-out',
        '&:hover': {
          bgcolor: 'action.hover',
        },
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
          <Avatar src={notification.sender?.avatarUrl} sx={{ width: 40, height: 40 }}>
            {notification.sender?.firstName[0]}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
              {getNotificationIcon(notification.type)}
              <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.925rem' }}>
                {notification.title}
              </Typography>
              {!notification.isRead && (
                <Chip label="Unread" size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700, bgcolor: 'primary.main', color: '#fff' }} />
              )}
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, lineHeight: 1.4 }}>
              {notification.message}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              {notification.timeAgo}
            </Typography>
          </Box>
          <Stack direction="row" spacing={0.5}>
            {!notification.isRead && (
              <IconButton size="small" onClick={() => onMarkRead?.(notification.id)} title="Mark as read" color="primary">
                <CheckCircleOutlineOutlinedIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton size="small" onClick={() => onDelete?.(notification.id)} title="Delete notification" color="default">
              <DeleteOutlinedIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
