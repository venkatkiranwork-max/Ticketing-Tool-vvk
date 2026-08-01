import { Card, CardContent, Typography, Stack, Avatar, Chip, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useUiStore } from '@/store/uiStore';
import { Link as RouterLink } from 'react-router-dom';

interface RecentTicketsTableProps {
  issues: Array<{
    _id: string;
    key: string;
    title: string;
    status: string;
    priority: string;
    projectName?: string;
    assigneeName?: string;
    assigneeAvatar?: string;
    updatedAt?: string;
  }>;
}

// Clean status badge styling matching custom tags
const statusConfig: Record<string, { label: string; color: string; bgcolor: string }> = {
  todo: { label: 'To Do', color: '#7c3aed', bgcolor: '#faf5ff' },
  in_progress: { label: 'In Progress', color: '#ea580c', bgcolor: '#fff7ed' },
  review: { label: 'In Review', color: '#2563eb', bgcolor: '#eff6ff' },
  done: { label: 'Completed', color: '#16a34a', bgcolor: '#f0fdf4' },
  backlog: { label: 'Backlog', color: '#64748b', bgcolor: '#f8fafc' },
};

// Clean priority tag styling matching custom tags
const priorityConfig: Record<string, { label: string; color: string; bgcolor: string }> = {
  critical: { label: 'Critical', color: '#ef4444', bgcolor: '#fee2e2' },
  high: { label: 'High', color: '#f97316', bgcolor: '#ffedd5' },
  medium: { label: 'Medium', color: '#ca8a04', bgcolor: '#fef9c3' },
  low: { label: 'Low', color: '#15803d', bgcolor: '#dcfce7' },
};

function getRelativeTime(dateString?: string) {
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

export function RecentTicketsTable({ issues }: RecentTicketsTableProps) {
  const openDrawer = useUiStore((s) => s.openDrawer);

  return (
    <Card sx={{ borderRadius: '12px', boxShadow: '0px 2px 8px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
      <CardContent sx={{ p: '24px !important' }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Recent Tickets
          </Typography>
          <Link
            component={RouterLink}
            to="/issues"
            sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563eb', underline: 'none', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
          >
            View all tickets
          </Link>
        </Stack>

        <TableContainer component={Paper} elevation={0} sx={{ border: 'none', background: 'transparent' }}>
          <Table sx={{ minWidth: 650 }} aria-label="recent tickets table">
            <TableHead>
              <TableRow sx={{ '& th': { borderBottom: '1px solid #f1f5f9', color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem', px: 1, py: 1.5 } }}>
                <TableCell width={110}>ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Project</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Assignee</TableCell>
                <TableCell align="right">Updated</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {issues.map((issue) => {
                const s = statusConfig[issue.status.toLowerCase()] || statusConfig.todo;
                const p = priorityConfig[issue.priority.toLowerCase()] || priorityConfig.medium;
                const relativeTime = getRelativeTime(issue.updatedAt);

                return (
                  <TableRow
                    key={issue._id}
                    hover
                    sx={{
                      cursor: 'pointer',
                      '& td': { borderBottom: '1px solid #f1f5f9', py: 1.5, px: 1 },
                      '&:last-child td': { border: 0 },
                    }}
                    onClick={() => openDrawer(issue._id)}
                  >
                    <TableCell sx={{ color: '#2563eb', fontWeight: 700, fontSize: '0.825rem' }}>
                      #{issue.key}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.85rem' }}>
                      {issue.title}
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                      {issue.projectName || 'Unassigned'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={s.label}
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          bgcolor: s.bgcolor,
                          color: s.color,
                          borderRadius: '6px',
                          border: 'none',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={p.label}
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          bgcolor: p.bgcolor,
                          color: p.color,
                          borderRadius: '6px',
                          border: 'none',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <Avatar
                          src={issue.assigneeAvatar}
                          sx={{ width: 24, height: 24, bgcolor: '#e2e8f0', color: '#475569', fontSize: '0.7rem', fontWeight: 700 }}
                        >
                          {issue.assigneeName ? issue.assigneeName[0].toUpperCase() : 'U'}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontSize: '0.825rem', fontWeight: 500 }}>
                          {issue.assigneeName || 'Unassigned'}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="right" sx={{ color: 'text.secondary', fontSize: '0.825rem' }}>
                      {relativeTime}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
