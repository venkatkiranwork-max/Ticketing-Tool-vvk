import { Card, CardContent, Typography, Box, Stack, Avatar, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface ActivityFeedProps {
  activities: Array<{
    _id: string;
    action: string;
    userName: string;
    details: string;
    createdAt?: string;
  }>;
}

function stringAvatar(name: string) {
  const parts = name.split(' ');
  return {
    children: parts.length > 1 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name[0]?.toUpperCase(),
  };
}

function formatRelativeTime(dateString?: string) {
  if (!dateString) return '2 hours ago';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) {
    return `${Math.max(1, diffMins)}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  } else {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  }
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  // Format details to pull issue keys if present (e.g. EPR-101)
  const formatActivityText = (details: string, action: string, userName: string) => {
    const isYou = userName.toLowerCase().includes('suresh') || userName.toLowerCase().includes('member');
    const actorName = isYou ? 'You' : userName;

    // Detect issue key (e.g., EPR-101, APIDE-1, TX-1254)
    const keyMatch = details.match(/[A-Z]+-\d+/);
    const key = keyMatch ? keyMatch[0] : null;

    let actionLabel = 'updated issue';
    if (action.includes('CREATE') || details.toLowerCase().includes('created')) actionLabel = 'created issue';
    if (action.includes('COMMENT') || details.toLowerCase().includes('commented')) actionLabel = 'commented on';
    if (action.includes('DELETE') || details.toLowerCase().includes('deleted')) actionLabel = 'deleted issue';

    // strip the key and action words out of details to get clean description text
    let cleanText = details;
    if (key) cleanText = cleanText.replace(key, '').trim();
    cleanText = cleanText.replace(/created issue|updated issue|added a comment|commented on/gi, '').trim();
    if (cleanText.startsWith('for') || cleanText.startsWith('on')) {
      cleanText = cleanText.substring(3).trim();
    }
    // Remove extra quotation marks
    cleanText = cleanText.replace(/^["']|["']$/g, '');

    return {
      actorName,
      actionLabel,
      key,
      cleanText,
    };
  };

  const displayActivities = (activities || []).slice(0, 4);

  return (
    <Card sx={{ borderRadius: '12px', boxShadow: '0px 2px 8px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', height: '60%' }}>
      <CardContent sx={{ p: '24px !important' }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Team Activity
          </Typography>
          <Link component={RouterLink} to="/audit-logs" underline="hover" sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563eb' }}>
            View all
          </Link>
        </Stack>

        <Stack spacing={2.5}>
          {displayActivities.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
              No recent team activities.
            </Typography>
          ) : (
            displayActivities.map((activity) => {
              const { actorName, actionLabel, key, cleanText } = formatActivityText(activity.details, activity.action, activity.userName);
              const relativeTime = formatRelativeTime(activity.createdAt);

              return (
                <Stack key={activity._id} direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
                  <Avatar
                    {...stringAvatar(activity.userName)}
                    sx={{ width: 32, height: 32, fontSize: '0.8rem', bgcolor: '#e2e8f0', color: '#475569', fontWeight: 700, mt: 0.25 }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" sx={{ fontSize: '0.85rem', lineHeight: 1.4 }}>
                      <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
                        {actorName}
                      </Box>{' '}
                      <Box component="span" sx={{ color: 'text.secondary' }}>
                        {actionLabel}
                      </Box>{' '}
                      {key && (
                        <Box component="span" sx={{ fontWeight: 700, color: '#2563eb' }}>
                          #{key}{' '}
                        </Box>
                      )}
                      {cleanText && (
                        <Box component="span" sx={{ fontWeight: 500, color: 'text.primary' }}>
                          {cleanText}
                        </Box>
                      )}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5, fontWeight: 500 }}>
                      {relativeTime}
                    </Typography>
                  </Box>
                </Stack>
              );
            })
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
