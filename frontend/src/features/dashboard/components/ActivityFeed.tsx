import { Card, CardContent, Typography, Box, Stack, Avatar, Link } from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';

interface ActivityFeedProps {
  activities: Array<{
    _id: string;
    action: string;
    userName: string;
    details: string;
  }>;
}

const actionConfig: Record<string, { icon: React.ReactNode; color: string; bgcolor: string }> = {
  updated: { icon: <EditRoundedIcon sx={{ fontSize: '0.8rem' }} />, color: '#8b5cf6', bgcolor: '#f3e8ff' },
  created: { icon: <AddRoundedIcon sx={{ fontSize: '0.9rem' }} />, color: '#3b82f6', bgcolor: '#dbeafe' },
  completed: { icon: <CheckRoundedIcon sx={{ fontSize: '0.9rem' }} />, color: '#10b981', bgcolor: '#dcfce7' },
  commented: { icon: <ChatBubbleOutlineRoundedIcon sx={{ fontSize: '0.8rem' }} />, color: '#f59e0b', bgcolor: '#fef3c7' },
};

function getActionType(details: string, actionStr: string) {
  const lowerDetails = (details || '').toLowerCase();
  const lowerAction = (actionStr || '').toLowerCase();
  
  if (lowerAction.includes('comment') || lowerDetails.includes('comment')) return 'commented';
  if (lowerAction.includes('create') || lowerDetails.includes('create')) return 'created';
  if (lowerAction.includes('complete') || lowerDetails.includes('complete') || lowerDetails.includes('status to done')) return 'completed';
  return 'updated';
}

function stringAvatar(name: string) {
  const parts = name.split(' ');
  return {
    children: parts.length > 1 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name[0]?.toUpperCase(),
  };
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card sx={{ borderRadius: '12px', boxShadow: '0px 2px 8px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', height: '100%' }}>
      <CardContent sx={{ p: '24px !important' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Team Activity
          </Typography>
          <Link href="#" underline="hover" sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#6366f1' }}>
            View all
          </Link>
        </Stack>

        <Stack spacing={2.5}>
          {activities.map((activity) => {
            const actionType = getActionType(activity.details, activity.action);
            const config = actionConfig[actionType];
            
            return (
              <Stack key={activity._id} direction="row" spacing={2} alignItems="center">
                <Avatar {...stringAvatar(activity.userName)} sx={{ width: 36, height: 36, fontSize: '0.9rem', bgcolor: '#e2e8f0', color: '#475569' }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', display: 'inline' }}>
                    {activity.userName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', display: 'inline', ml: 0.5 }}>
                    {actionType} {activity.details.split(' ').slice(1).join(' ')}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    bgcolor: config.bgcolor,
                    color: config.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {config.icon}
                </Box>
              </Stack>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
}
