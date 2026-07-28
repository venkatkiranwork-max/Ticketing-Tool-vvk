import { useMemo } from 'react';
import {
  Container,
  Stack,
  Box,
  Typography,
  Button,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  IconButton,
  Tooltip,
} from '@mui/material';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import BugReportOutlinedIcon from '@mui/icons-material/BugReportOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';

import { useIssuesQuery, useDeleteIssueMutation } from '@/features/issues/useIssues';
import { useUiStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { mockUsers } from '@/mock/users';
import type { MockIssue, IssueType } from '@/mock/issues';
import { hasPermission, filterIssuesForUser } from '@/features/auth/permissions';
import { IssueDetailsDrawer } from '@/components/ui/IssueDetailsDrawer';
import { CreateIssueModal } from '@/components/ui/CreateIssueModal';

const typeIcons: Record<IssueType, React.ReactNode> = {
  task: <CheckCircleOutlinedIcon fontSize="small" sx={{ color: '#3b82f6' }} />,
  bug: <BugReportOutlinedIcon fontSize="small" sx={{ color: '#ef4444' }} />,
  story: <AutoAwesomeOutlinedIcon fontSize="small" sx={{ color: '#10b981' }} />,
  improvement: <TrendingUpOutlinedIcon fontSize="small" sx={{ color: '#f59e0b' }} />,
};

const priorityColors: Record<MockIssue['priority'], { bg: string; color: string }> = {
  critical: { bg: 'rgba(239, 68, 68, 0.12)', color: '#ef4444' },
  high: { bg: 'rgba(249, 115, 22, 0.12)', color: '#f97316' },
  medium: { bg: 'rgba(234, 179, 8, 0.12)', color: '#ca8a04' },
  low: { bg: 'rgba(6, 182, 212, 0.12)', color: '#0891b2' },
};

const statusColors: Record<MockIssue['status'], { bg: string; color: string; label: string }> = {
  backlog: { bg: 'rgba(148, 163, 184, 0.12)', color: '#64748b', label: 'Backlog' },
  todo: { bg: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6', label: 'To Do' },
  in_progress: { bg: 'rgba(245, 158, 11, 0.12)', color: '#d97706', label: 'In Progress' },
  review: { bg: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6', label: 'In Review' },
  done: { bg: 'rgba(16, 185, 129, 0.12)', color: '#10b981', label: 'Done' },
};

export function IssuesPage() {
  const currentUser = useAuthStore((s) => s.user) || mockUsers[0];
  const canCreateIssues = hasPermission(currentUser, 'create_issues');
  const canDeleteIssues = hasPermission(currentUser, 'delete_issues');

  // UI state from Zustand
  const openDrawer = useUiStore((s) => s.openDrawer);
  const openCreateModal = useUiStore((s) => s.openCreateModal);
  const filters = useUiStore((s) => s.filters);
  const setFilters = useUiStore((s) => s.setFilters);

  // Server state from TanStack Query
  const { data: issues = [], isLoading } = useIssuesQuery();
  const deleteMutation = useDeleteIssueMutation();

  // Role visibility filtering
  const visibleIssues = useMemo(() => {
    return filterIssuesForUser(issues, currentUser);
  }, [issues, currentUser]);

  const filteredIssues = useMemo(() => {
    return visibleIssues.filter((iss) => {
      const matchesSearch =
        (iss.key || '').toLowerCase().includes(filters.search.toLowerCase()) ||
        (iss.title || '').toLowerCase().includes(filters.search.toLowerCase()) ||
        (iss.projectName || '').toLowerCase().includes(filters.search.toLowerCase());
      const matchesStatus = filters.status === 'all' || iss.status === filters.status;
      const matchesPriority = filters.priority === 'all' || iss.priority === filters.priority;
      const matchesType = filters.type === 'all' || iss.type === filters.type;
      return matchesSearch && matchesStatus && matchesPriority && matchesType;
    });
  }, [visibleIssues, filters]);

  const handleDeleteIssue = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteMutation.mutate(id);
  };

  const columns: GridColDef[] = [
    {
      field: 'key',
      headerName: 'Issue ID',
      width: 120,
      renderCell: (params: GridRenderCellParams<MockIssue>) => (
        <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', height: '100%' }}>
          {typeIcons[params.row.type || 'task']}
          <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main', fontSize: '0.85rem' }}>
            {params.row.key}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'title',
      headerName: 'Title',
      flex: 1.5,
      minWidth: 260,
      renderCell: (params: GridRenderCellParams<MockIssue>) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
            {params.row.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.projectName} • {params.row.sprint}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params: GridRenderCellParams<MockIssue>) => {
        const style = statusColors[params.row.status] || statusColors.todo;
        return (
          <Chip
            label={style.label}
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: '0.725rem',
              bgcolor: style.bg,
              color: style.color,
              border: 'none',
            }}
          />
        );
      },
    },
    {
      field: 'priority',
      headerName: 'Priority',
      width: 110,
      renderCell: (params: GridRenderCellParams<MockIssue>) => {
        const style = priorityColors[params.row.priority] || priorityColors.medium;
        return (
          <Chip
            label={(params.row.priority || 'medium').toUpperCase()}
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: '0.675rem',
              bgcolor: style.bg,
              color: style.color,
              border: 'none',
            }}
          />
        );
      },
    },
    {
      field: 'assignee',
      headerName: 'Assignee',
      width: 170,
      renderCell: (params: GridRenderCellParams<MockIssue>) => (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', height: '100%' }}>
          <Avatar src={params.row.assignee?.avatarUrl} sx={{ width: 26, height: 26, fontSize: '0.7rem' }}>
            {params.row.assignee?.firstName ? params.row.assignee.firstName[0] : 'U'}
          </Avatar>
          <Typography variant="body2" sx={{ fontSize: '0.825rem', fontWeight: 500 }}>
            {params.row.assignee?.firstName || 'Unassigned'} {params.row.assignee?.lastName || ''}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'dueDate',
      headerName: 'Due Date',
      width: 110,
      renderCell: (params: GridRenderCellParams<MockIssue>) => (
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.825rem', alignSelf: 'center' }}>
          {params.row.dueDate}
        </Typography>
      ),
    },
    {
      field: 'labels',
      headerName: 'Labels',
      width: 160,
      renderCell: (params: GridRenderCellParams<MockIssue>) => (
        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', flexWrap: 'nowrap', overflow: 'hidden', height: '100%' }}>
          {params.row.labels?.map((label) => (
            <Chip key={label} label={label} size="small" sx={{ height: 20, fontSize: '0.675rem', fontWeight: 500 }} />
          ))}
        </Stack>
      ),
    },
    ...(canDeleteIssues
      ? [
          {
            field: 'actions',
            headerName: 'Actions',
            width: 80,
            sortable: false,
            renderCell: (params: GridRenderCellParams<MockIssue>) => (
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', height: '100%' }}>
                <Tooltip title="Delete issue">
                  <IconButton size="small" onClick={(e) => handleDeleteIssue(e, (params.row as any).id || (params.row as any)._id)} color="error">
                    <DeleteOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            ),
          },
        ]
      : []),
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={3.5}>
        {/* Header */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', alignItems: { md: 'center' } }}>
          <Box>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 800, letterSpacing: '-0.03em' }}>
                Issues Directory
              </Typography>
              {currentUser.role === 'Member' && (
                <Chip label="Assigned to Me Only" color="primary" size="small" sx={{ fontWeight: 700, fontSize: '0.7rem' }} />
              )}
            </Stack>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              Enterprise data grid powered by TanStack Query. Click any row to open details. ({filteredIssues.length} issues).
            </Typography>
          </Box>
          {canCreateIssues && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openCreateModal}
              sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, px: 2.5 }}
            >
              Create Issue
            </Button>
          )}
        </Stack>

        {/* Toolbar Filter */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: 'center' }}>
          <TextField
            placeholder="Search issues by ID, title, or project..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            size="small"
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
          />

          <Stack direction="row" spacing={1.5} sx={{ minWidth: { sm: 420 } }}>
            <Select value={filters.type} onChange={(e) => setFilters({ type: e.target.value })} size="small" fullWidth sx={{ borderRadius: '10px' }}>
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="task">Task</MenuItem>
              <MenuItem value="bug">Bug</MenuItem>
              <MenuItem value="story">Story</MenuItem>
              <MenuItem value="improvement">Improvement</MenuItem>
            </Select>

            <Select value={filters.status} onChange={(e) => setFilters({ status: e.target.value })} size="small" fullWidth sx={{ borderRadius: '10px' }}>
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="backlog">Backlog</MenuItem>
              <MenuItem value="todo">To Do</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="review">In Review</MenuItem>
              <MenuItem value="done">Done</MenuItem>
            </Select>

            <Select value={filters.priority} onChange={(e) => setFilters({ priority: e.target.value })} size="small" fullWidth sx={{ borderRadius: '10px' }}>
              <MenuItem value="all">All Priorities</MenuItem>
              <MenuItem value="critical">Critical</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </Select>
          </Stack>
        </Stack>

        {/* MUI DataGrid */}
        <Box sx={{ height: 640, width: '100%' }}>
          <DataGrid
            rows={filteredIssues}
            columns={columns}
            loading={isLoading}
            getRowId={(row: any) => row.id || row._id}
            onRowClick={(params: any) => openDrawer(params.row.id || params.row._id)}
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            rowHeight={64}
            sx={{
              borderRadius: '14px',
              borderColor: 'divider',
              cursor: 'pointer',
              '& .MuiDataGrid-columnHeaders': {
                bgcolor: 'action.hover',
                fontWeight: 700,
              },
              '& .MuiDataGrid-row:hover': {
                bgcolor: 'action.hover',
              },
            }}
          />
        </Box>
      </Stack>

      {/* Slide-out Issue Details Drawer */}
      <IssueDetailsDrawer />

      {/* Create Issue Dialog Modal */}
      <CreateIssueModal />
    </Container>
  );
}
