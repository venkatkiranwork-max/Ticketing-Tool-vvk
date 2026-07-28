import { useMemo } from 'react';
import { Container, Stack, Box, Typography, Button, Paper, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import toast from 'react-hot-toast';

import { IssueCard } from '@/components/ui/IssueCard';
import { IssueDetailsDrawer } from '@/components/ui/IssueDetailsDrawer';
import { CreateIssueModal } from '@/components/ui/CreateIssueModal';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import type { MockIssue } from '@/mock/issues';
import { mockProjects } from '@/mock/projects';
import { useAuthStore } from '@/store/authStore';
import { toMockUser } from '@/mock/users';
import { hasPermission, filterBoardCardsForUser } from '@/features/auth/permissions';
import { useIssuesQuery, useUpdateIssueMutation, useDeleteIssueMutation } from '@/features/issues/useIssues';
import { useUiStore } from '@/store/uiStore';

const COLUMNS: { id: MockIssue['status']; title: string; color: string }[] = [
  { id: 'backlog', title: 'Backlog', color: '#64748b' },
  { id: 'todo', title: 'To Do', color: '#3b82f6' },
  { id: 'in_progress', title: 'In Progress', color: '#f59e0b' },
  { id: 'review', title: 'In Review', color: '#8b5cf6' },
  { id: 'done', title: 'Done', color: '#10b981' },
];

export function KanbanPage() {
  const currentUser = toMockUser(useAuthStore((s) => s.user));
  const canCreateIssues = hasPermission(currentUser, 'create_issues');

  // Zustand UI state
  const openDrawer = useUiStore((s) => s.openDrawer);
  const openCreateModal = useUiStore((s) => s.openCreateModal);
  const filters = useUiStore((s) => s.filters);
  const setFilters = useUiStore((s) => s.setFilters);

  // TanStack Query server state
  const { data: issues = [] } = useIssuesQuery();
  const updateMutation = useUpdateIssueMutation();
  const deleteMutation = useDeleteIssueMutation();

  // Role visibility filtering
  const visibleIssues = useMemo(() => {
    return filterBoardCardsForUser(issues, currentUser);
  }, [issues, currentUser]);

  const filteredIssues = useMemo(() => {
    return visibleIssues.filter((iss) => {
      const matchesSearch =
        iss.key.toLowerCase().includes(filters.search.toLowerCase()) ||
        iss.title.toLowerCase().includes(filters.search.toLowerCase());
      const matchesProject = filters.project === 'all' || iss.projectId === filters.project;
      const matchesType = filters.type === 'all' || iss.type === filters.type;
      return matchesSearch && matchesProject && matchesType;
    });
  }, [visibleIssues, filters]);

  const handleCardStatusChange = (issue: MockIssue, newStatus: MockIssue['status']) => {
    const isAssignedToMe = issue.assignee?.id === currentUser.id;
    const canEditAllFields = hasPermission(currentUser, 'edit_all_issues') || hasPermission(currentUser, 'assign_issues');
    const canEditStatus = canEditAllFields || (hasPermission(currentUser, 'edit_assigned_issues') && isAssignedToMe);

    if (!canEditStatus) {
      toast.error('Members may only update status of their own assigned issues.');
      return;
    }

    const targetId = issue.id || issue._id;
    updateMutation.mutate({
      issueId: targetId,
      updates: { status: newStatus },
      actor: currentUser,
    });
  };

  const handleDrop = (e: React.DragEvent, newStatus: MockIssue['status']) => {
    e.preventDefault();
    const issueId = e.dataTransfer.getData('text/plain');
    if (!issueId) return;

    const issue = issues.find((i) => i.id === issueId || i._id === issueId);
    if (!issue || issue.status === newStatus) return;

    handleCardStatusChange(issue, newStatus);
  };

  const handleCardDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={3.5}>
        {/* Header */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}>
          <Box>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 800, letterSpacing: '-0.03em' }}>
                Sprint Board
              </Typography>
              {currentUser.role === 'Member' && (
                <Chip label="My Assigned Cards" color="primary" size="small" sx={{ fontWeight: 700, fontSize: '0.7rem' }} />
              )}
            </Stack>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              Sprint 24 Kanban workflow board. Role-scoped card visibility ({filteredIssues.length} cards visible).
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

        {/* Toolbar */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: 'center' }}>
          <SearchBar
            placeholder="Search board cards by title or key..."
            value={filters.search}
            onChange={(val) => setFilters({ search: val })}
          />
          <FilterDropdown
            value={filters.project}
            onChange={(val) => setFilters({ project: val })}
            options={[{ label: 'All Projects', value: 'all' }, ...mockProjects.map((p) => ({ label: p.name, value: p.id }))]}
          />
        </Stack>

        {/* 5 Column Kanban Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(5, 1fr)' },
            gap: 2,
            alignItems: 'start',
            overflowX: 'auto',
            pb: 2,
          }}
        >
          {COLUMNS.map((col) => {
            const colIssues = filteredIssues.filter((i) => i.status === col.id);
            return (
              <Paper
                key={col.id}
                variant="outlined"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, col.id)}
                sx={{
                  p: 2,
                  borderRadius: '14px',
                  bgcolor: 'action.hover',
                  minHeight: 480,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Column Header */}
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: col.color }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                      {col.title}
                    </Typography>
                  </Stack>
                  <Chip label={colIssues.length} size="small" sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700 }} />
                </Stack>

                {/* Cards List */}
                <Stack spacing={1.5} sx={{ flex: 1 }}>
                  {colIssues.map((iss) => (
                    <IssueCard
                      key={iss.id || iss._id}
                      issue={iss}
                      onClick={(card) => openDrawer(card.id || card._id)}
                      onStatusChange={handleCardStatusChange}
                      onDelete={handleCardDelete}
                    />
                  ))}
                </Stack>
              </Paper>
            );
          })}
        </Box>
      </Stack>

      {/* Slide-out Issue Details Drawer */}
      <IssueDetailsDrawer />

      {/* Create Issue Dialog Modal */}
      <CreateIssueModal />
    </Container>
  );
}
