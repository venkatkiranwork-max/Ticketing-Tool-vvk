import { Card, CardContent, Typography, Stack, Link } from '@mui/material';

interface UpcomingDeadlinesProps {
  deadlines: Array<{
    _id: string;
    key: string;
    title: string;
    dueDate: string;
  }>;
}

function formatDateAndColor(dateString: string) {
  const d = new Date(dateString);
  const now = new Date();
  const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 3600 * 24));
  
  let color = '#64748b'; // default gray
  if (diffDays < 0) color = '#ef4444'; // overdue red
  else if (diffDays <= 3) color = '#f59e0b'; // soon orange
  else if (diffDays <= 7) color = '#eab308'; // yellow
  else color = '#10b981'; // green

  return {
    text: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    color
  };
}

export function UpcomingDeadlines({ deadlines }: UpcomingDeadlinesProps) {
  return (
    <Card sx={{ borderRadius: '12px', boxShadow: '0px 2px 8px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', height: '100%' }}>
      <CardContent sx={{ p: '24px !important' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Upcoming Deadlines
          </Typography>
          <Link href="#" underline="hover" sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#6366f1' }}>
            View all
          </Link>
        </Stack>

        <Stack spacing={2}>
          {deadlines.map((item) => {
            const { text, color } = formatDateAndColor(item.dueDate);
            return (
              <Stack key={item._id} direction="row" alignItems="center" spacing={2}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#6366f1', width: 60, flexShrink: 0 }}>
                  {item.key}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary', flexGrow: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.title}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 600, color, width: 45, textAlign: 'right', flexShrink: 0 }}>
                  {text}
                </Typography>
              </Stack>
            );
          })}
          {deadlines.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No upcoming deadlines.
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
