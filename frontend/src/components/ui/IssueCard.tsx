import React, { useState } from 'react';
import { Card, CardContent, Typography, Stack, Chip, Avatar, Tooltip, IconButton, Menu, MenuItem, Select } from '@mui/material';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import type { MockIssue } from '@/mock/issues';
import { useAuthStore } from '@/store/authStore';
import { mockUsers } from '@/mock/users';
import { hasPermission } from '@/features/auth/permissions';

export interface IssueCardProps {
  issue: MockIssue;
  onClick?: (issue: MockIssue) => void;
  onStatusChange?: (issue: MockIssue, newStatus: MockIssue['status']) => void;
  onDelete?: (id: string) => void;
}

const priorityColors: Record<MockIssue['priority'], { bg: string; color: string; label: string }> = {
  critical: { bg: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', label: 'Critical' },
  high: { bg: 'rgba(249, 115, 22, 0.12)', color: '#f97316', label: 'High' },
  medium: { bg: 'rgba(234, 179, 8, 0.12)', color: '#ca8a04', label: 'Medium' },
  low: { bg: 'rgba(6, 182, 212, 0.12)', color: '#0891b2', label: 'Low' },
};

export function IssueCard({ issue, onClick, onStatusChange, onDelete }: IssueCardProps) {
  const currentUser = useAuthStore((s) => s.user) || mockUsers[0];
  const canDeleteIssues = hasPermission(currentUser, 'delete_issues');
  const canChangeStatus = hasPermission(currentUser, 'change_issue_status') || hasPermission(currentUser, 'edit_assigned_issues');

  const priorityStyle = priorityColors[issue.priority] || priorityColors.medium;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setAnchorEl(null);
  };

  return (
    <Card
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', issue.id || issue._id);
        e.dataTransfer.effectAllowed = 'move';
      }}
      variant="outlined"
      onClick={() => onClick?.(issue)}
      sx={{
        borderRadius: '10px',
        bgcolor: 'background.paper',
        cursor: 'pointer',
        transition: 'all 0.15s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.06)',
          borderColor: 'primary.main',
        },
      }}
    >
      <CardContent sx={{ p: 1.75, '&:last-child': { pb: 1.75 } }}>
        {/* Top Header */}
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
              {issue.key}
            </Typography>
            <Chip
              label={priorityStyle.label}
              size="small"
              sx={{
                height: 18,
                fontSize: '0.65rem',
                fontWeight: 700,
                bgcolor: priorityStyle.bg,
                color: priorityStyle.color,
                border: 'none',
              }}
            />
          </Stack>

          <Stack direction="row" spacing={0.25} sx={{ alignItems: 'center' }}>
            {/* Direct Status Selector Dropdown */}
            {canChangeStatus && (
              <Select
                value={issue.status}
                onChange={(e) => {
                  e.stopPropagation();
                  onStatusChange?.(issue, e.target.value as MockIssue['status']);
                }}
                onClick={(e) => e.stopPropagation()}
                size="small"
                sx={{
                  height: 22,
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  borderRadius: '6px',
                  bgcolor: 'action.hover',
                  '& .MuiSelect-select': { py: 0, px: 1 },
                }}
              >
                <MenuItem value="backlog" sx={{ fontSize: '0.75rem' }}>Backlog</MenuItem>
                <MenuItem value="todo" sx={{ fontSize: '0.75rem' }}>To Do</MenuItem>
                <MenuItem value="in_progress" sx={{ fontSize: '0.75rem' }}>In Progress</MenuItem>
                <MenuItem value="review" sx={{ fontSize: '0.75rem' }}>In Review</MenuItem>
                <MenuItem value="done" sx={{ fontSize: '0.75rem' }}>Done</MenuItem>
              </Select>
            )}

            {/* Context Menu Trigger */}
            <IconButton size="small" onClick={handleMenuOpen} sx={{ p: 0.25 }}>
              <MoreVertIcon fontSize="small" />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => handleMenuClose()}
              onClick={(e) => e.stopPropagation()}
              slotProps={{ paper: { sx: { borderRadius: '10px', minWidth: 140 } } }}
            >
              <MenuItem
                onClick={(e) => {
                  handleMenuClose(e);
                  onClick?.(issue);
                }}
                sx={{ fontSize: '0.8rem' }}
              >
                Open Details
              </MenuItem>
              {canDeleteIssues && (
                <MenuItem
                  onClick={(e) => {
                    handleMenuClose(e);
                    onDelete?.(issue.id);
                  }}
                  sx={{ fontSize: '0.8rem', color: 'error.main' }}
                >
                  Delete Issue
                </MenuItem>
              )}
            </Menu>
          </Stack>
        </Stack>

        {/* Title */}
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5, lineHeight: 1.35, color: 'text.primary' }}>
          {issue.title}
        </Typography>

        {/* Footer */}
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
            <CalendarTodayOutlinedIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
              {issue.dueDate}
            </Typography>
          </Stack>
          {issue.assignee && typeof issue.assignee === 'object' && (
            <Tooltip title={`${issue.assignee.firstName || ''} ${issue.assignee.lastName || ''}`}>
              <Avatar src={issue.assignee.avatarUrl} sx={{ width: 22, height: 22, fontSize: '0.65rem' }}>
                {issue.assignee.firstName ? issue.assignee.firstName[0] : 'U'}
              </Avatar>
            </Tooltip>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
