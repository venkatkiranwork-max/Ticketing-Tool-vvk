import { Card, CardContent, Typography, Stack, Avatar, Chip, Link } from '@mui/material';

interface RecentIssuesListProps {
  issues: Array<{
    _id: string;
    key: string;
    title: string;
    status: string;
    assigneeName?: string;
    assigneeAvatar?: string;
    dueDate?: string; // used for the date column in the UI mockup (e.g. Jul 29)
  }>;
}

const statusConfig: Record<string, { label: string; color: string; bgcolor: string }> = {
  todo: { label: 'To Do', color: '#64748b', bgcolor: '#f1f5f9' },
  in_progress: { label: 'In Progress', color: '#8b5cf6', bgcolor: '#f3e8ff' },
  review: { label: 'In Review', color: '#3b82f6', bgcolor: '#dbeafe' },
  done: { label: 'Completed', color: '#10b981', bgcolor: '#dcfce7' },
  backlog: { label: 'Backlog', color: '#64748b', bgcolor: '#f1f5f9' },
};

function formatDateShort(dateString?: string) {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function RecentIssuesList({ issues }: RecentIssuesListProps) {
  return (
    <Card sx={{ borderRadius: '12px', boxShadow: '0px 2px 8px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', height: '100%' }}>
      <CardContent sx={{ p: '24px !important' }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Recent Issues
          </Typography>
          <Link href="#" underline="hover" sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#6366f1' }}>
            View all
          </Link>
        </Stack>

        <Stack spacing={2}>
          {issues.map((issue) => {
            const s = statusConfig[issue.status] || statusConfig.todo;
            return (
              <Stack key={issue._id} direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#6366f1', width: 60, flexShrink: 0 }}>
                  {issue.key}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary', flexGrow: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {issue.title}
                </Typography>
                <Chip
                  label={s.label}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    bgcolor: s.bgcolor,
                    color: s.color,
                    borderRadius: '6px',
                    width: 75,
                    flexShrink: 0
                  }}
                />
                <Avatar
                  src={issue.assigneeAvatar}
                  sx={{ width: 24, height: 24, fontSize: '0.7rem', flexShrink: 0, bgcolor: '#e2e8f0', color: '#475569' }}
                >
                  {issue.assigneeName ? issue.assigneeName[0].toUpperCase() : 'U'}
                </Avatar>
                <Typography variant="caption" sx={{ color: 'text.secondary', width: 40, textAlign: 'right', flexShrink: 0 }}>
                  {formatDateShort(issue.dueDate)}
                </Typography>
              </Stack>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
}
