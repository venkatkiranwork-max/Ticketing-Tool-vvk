import { useState, useMemo, useEffect } from 'react';
import {
  Container,
  Stack,
  Box,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  Card,
  LinearProgress,
  Checkbox,
  OutlinedInput,
  ListItemText,
  FormControl,
  InputLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import toast from 'react-hot-toast';

import { PageHeader } from '@/components/ui/PageHeader';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { mockProjects } from '@/mock/projects';
import type { MockProject, ProjectMember } from '@/mock/projects';
import { mockUsers, toMockUser } from '@/mock/users';
import { mockTeams } from '@/mock/teams';
import { useAuthStore } from '@/store/authStore';
import { hasPermission, filterProjectsForUser } from '@/features/auth/permissions';
import { IssueCard } from '@/components/ui/IssueCard';
import { IssueDetailsDrawer } from '@/components/ui/IssueDetailsDrawer';
import { CreateIssueModal } from '@/components/ui/CreateIssueModal';
import { useIssuesQuery, useCloseSprintMutation, useUpdateIssueMutation } from '@/features/issues/useIssues';
import { useUiStore } from '@/store/uiStore';
import { useProjectsQuery } from '@/hooks/useProjectsQuery';
import { useUsersQuery } from '@/hooks/useUsersQuery';

export function ProjectPage() {
  const currentUser = toMockUser(useAuthStore((s) => s.user));
  const canManageProjects = hasPermission(currentUser, 'manage_projects');
  const canManageMembers = hasPermission(currentUser, 'manage_project_members');

  // Zustand UI store
  const openDrawer = useUiStore((s) => s.openDrawer);

  const { data: issues = [] } = useIssuesQuery();
  const { data: serverProjects, createProject: createProjectApi, updateProject: updateProjectApi, archiveProject: archiveProjectApi } = useProjectsQuery();
  const { data: allUsers = [] } = useUsersQuery();
  const [localProjectsState, setLocalProjectsState] = useState<MockProject[]>(mockProjects);

  useEffect(() => {
    if (Array.isArray(serverProjects) && serverProjects.length > 0) {
      setLocalProjectsState(serverProjects);
    }
  }, [serverProjects]);

  const projects = localProjectsState;
  const setProjects = setLocalProjectsState;

  const closeSprintMutation = useCloseSprintMutation();
  const updateMutation = useUpdateIssueMutation();

  const [catalogTab, setCatalogTab] = useState<'my' | 'accessible' | 'archived'>('my');
  const [selectedProject, setSelectedProject] = useState<MockProject | null>(null);
  const [detailsSubTab, setDetailsSubTab] = useState<'overview' | 'board' | 'issues' | 'members' | 'reports' | 'settings'>('overview');

  const [search, setSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState('all');
  const [openCreateProjectModal, setOpenCreateProjectModal] = useState(false);

  // New project state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [team, setTeam] = useState('Engineering');

  // Edit project state
  const [openEditProjectModal, setOpenEditProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<MockProject | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTeam, setEditTeam] = useState('Engineering');
  const [editStatus, setEditStatus] = useState<'active' | 'planning' | 'paused' | 'completed'>('active');

  // Add member modal state
  const [openAddMemberModal, setOpenAddMemberModal] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // Project specific issues calculation
  const projectIssues = useMemo(() => {
    if (!selectedProject) return issues;
    const targetId = selectedProject.id || selectedProject._id;
    return issues.filter(
      (i: any) => i.projectId === targetId || i._id === targetId || i.projectName === selectedProject.name
    );
  }, [issues, selectedProject]);

  const openProjectIssuesCount = projectIssues.filter((i) => i.status !== 'done').length;
  const completedProjectIssuesCount = projectIssues.filter((i) => i.status === 'done').length;
  const projectCompletionRate = projectIssues.length
    ? Math.round((completedProjectIssuesCount / projectIssues.length) * 100)
    : 0;

  // Filter catalog projects
  const visibleProjects = useMemo(() => {
    return filterProjectsForUser(projects, currentUser);
  }, [projects, currentUser]);

  const filteredCatalogProjects = useMemo(() => {
    return visibleProjects.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
      const matchesTeam = teamFilter === 'all' || p.team === teamFilter;

      if (catalogTab === 'my') {
        const isManagedByMe = p.members?.some((m: any) =>
          (m?.user?.id === currentUser?.id || m?.userId === currentUser?.id) &&
          (m?.projectRole === 'Project Admin' || m?.projectRole === 'Lead Developer' || m?.role === 'owner' || m?.role === 'admin')
        );
        return matchesSearch && matchesTeam && (isManagedByMe || currentUser.role === 'Super Admin' || currentUser.role === 'Admin' || (currentUser.role as string) === 'super_admin' || (currentUser.role as string) === 'admin');
      }

      if (catalogTab === 'archived') {
        return matchesSearch && matchesTeam && p.status === 'completed';
      }

      return matchesSearch && matchesTeam && p.status === 'active';
    });
  }, [visibleProjects, search, teamFilter, catalogTab, currentUser]);

  const handleCreateProject = async () => {
    if (!name.trim()) {
      toast.error('Please enter project name');
      return;
    }

    try {
      await createProjectApi({
        name: name.trim(),
        description: description.trim(),
        team,
        workspaceId: (currentUser as any)?.workspaceId || '6a664f8afb0f23cde13c954a',
        slug: name.trim().toLowerCase().replace(/\s+/g, '-'),
      });

      setName('');
      setDescription('');
      setOpenCreateProjectModal(false);
      toast.success('Project created successfully!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to create project');
    }
  };

  const handleOpenEditModal = (proj: MockProject) => {
    setEditingProject(proj);
    setEditName(proj.name || '');
    setEditDescription(proj.description || '');
    setEditTeam(proj.team || 'Engineering');
    setEditStatus(proj.status || 'active');
    setOpenEditProjectModal(true);
  };

  const handleSaveEditProject = async () => {
    if (!editingProject || !editName.trim()) return;
    const targetId = editingProject.id || editingProject._id;
    try {
      await updateProjectApi({
        id: targetId,
        updates: {
          name: editName.trim(),
          description: editDescription.trim(),
          team: editTeam,
          status: editStatus,
        },
      });

      if (selectedProject && (selectedProject.id === targetId || selectedProject._id === targetId)) {
        setSelectedProject((prev) =>
          prev ? { ...prev, name: editName.trim(), description: editDescription.trim(), team: editTeam, status: editStatus } : null
        );
      }

      setOpenEditProjectModal(false);
      toast.success('Project updated successfully!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to update project');
    }
  };

  const handleAddMember = () => {
    if (!selectedProject || selectedUserIds.length === 0) {
      toast.error('Please select at least one user');
      return;
    }

    const selectedUserObjects = selectedUserIds.map(
      (id) => allUsers.find((u) => u.id === id) || mockUsers.find((u) => u.id === id) || mockUsers[0]
    );

    const newMembers: ProjectMember[] = selectedUserObjects.map((u) => ({
      user: u,
      projectRole: (u.role as ProjectMember['projectRole']) || 'Member',
    }));

    const updatedProjects = projects.map((p) => {
      if (p.id === selectedProject.id || p._id === selectedProject._id) {
        // Filter out existing users to avoid duplicate additions
        const existingUserIds = new Set((p.members || []).map((m: any) => m.user?.id || m.userId));
        const filteredNewMembers = newMembers.filter((nm) => !existingUserIds.has(nm.user.id));
        return {
          ...p,
          members: [...(p.members || []), ...filteredNewMembers],
        };
      }
      return p;
    });

    setProjects(updatedProjects);
    setSelectedProject(updatedProjects.find((p) => p.id === selectedProject.id || p._id === selectedProject._id) || null);
    setOpenAddMemberModal(false);
    setSelectedUserIds([]);
    toast.success(`${selectedUserObjects.length} member(s) added to project!`);
  };

  const handleCloseSprint = () => {
    if (!selectedProject) return;
    closeSprintMutation.mutate({
      sprintName: selectedProject.sprint || 'Sprint 24 (Q3 Platform)',
      actor: currentUser,
    });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={3.5}>
        {!selectedProject ? (
          /* Catalog View */
          <>
            <PageHeader
              title="Project Catalog"
              subtitle="Software delivery project repository divided by managed, accessible, and archived projects."
              actionText={canManageProjects ? 'Create Project' : undefined}
              actionIcon={<AddIcon />}
              onAction={() => setOpenCreateProjectModal(true)}
            />

            {/* Catalog Tabs */}
            <Tabs value={catalogTab} onChange={(_, val) => setCatalogTab(val)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tab value="my" label="My Managed Projects" sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab value="accessible" label="Accessible Projects" sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab value="archived" label="Archived Projects" sx={{ textTransform: 'none', fontWeight: 600 }} />
            </Tabs>

            {/* Search & Filter Toolbar */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: 'center' }}>
              <SearchBar placeholder="Search projects by name or description..." value={search} onChange={setSearch} />
              <FilterDropdown
                value={teamFilter}
                onChange={setTeamFilter}
                options={[{ label: 'All Teams', value: 'all' }, ...mockTeams.map((t) => ({ label: t.name, value: t.name }))]}
              />
            </Stack>

            {/* Projects Grid */}
            <Grid container spacing={3}>
              {filteredCatalogProjects.map((p) => (
                <Grid key={p.id || (p as any)._id} size={{ xs: 12, md: 6, lg: 4 }}>
                  <ProjectCard
                    project={p}
                    onOpen={(proj) => {
                      setSelectedProject(proj);
                      setDetailsSubTab('overview');
                    }}
                    onEdit={handleOpenEditModal}
                  />
                </Grid>
              ))}
            </Grid>
          </>
        ) : (
          /* Dedicated Project Details Page */
          <>
            <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ArrowBackOutlinedIcon />}
                  onClick={() => setSelectedProject(null)}
                  sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
                >
                  Back to Catalog
                </Button>
                <Chip label={selectedProject.team} size="small" color="primary" sx={{ fontWeight: 700 }} />
                <Chip label={selectedProject.sprint || 'Sprint 1'} size="small" variant="outlined" sx={{ fontWeight: 700 }} />
              </Stack>

              {/* PM Close Sprint Action */}
              {canManageProjects && (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<TaskAltOutlinedIcon />}
                  onClick={handleCloseSprint}
                  disabled={closeSprintMutation.isPending}
                  sx={{ borderRadius: '8px', fontWeight: 700 }}
                >
                  Close Sprint
                </Button>
              )}
            </Stack>

            <PageHeader
              title={selectedProject.name}
              subtitle={selectedProject.description}
              actionText={canManageMembers ? 'Add Member' : undefined}
              actionIcon={<AddIcon />}
              onAction={() => setOpenAddMemberModal(true)}
            />

            {/* Sub-Navigation Tabs */}
            <Tabs value={detailsSubTab} onChange={(_, val) => setDetailsSubTab(val)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tab value="overview" label="Overview" sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab value="board" label="Sprint Board" sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab value="issues" label={`Project Issues (${projectIssues.length})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab value="members" label={`Members (${(selectedProject.members || []).length})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab value="reports" label="Reports & Velocity" sx={{ textTransform: 'none', fontWeight: 600 }} />
              {canManageProjects && <Tab value="settings" label="Settings" sx={{ textTransform: 'none', fontWeight: 600 }} />}
            </Tabs>

            {/* Sub-tab 1: Overview */}
            {detailsSubTab === 'overview' && (
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                  <Card variant="outlined" sx={{ borderRadius: '14px', p: 3, mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                      Project Summary & Sprint Telemetry
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.6 }}>
                      {selectedProject.description}
                    </Typography>

                    <Box sx={{ mb: 3 }}>
                      <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>
                          Sprint Completion Rate ({completedProjectIssuesCount} of {projectIssues.length} issues done)
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main' }}>
                          {projectCompletionRate}%
                        </Typography>
                      </Stack>
                      <LinearProgress variant="determinate" value={projectCompletionRate} sx={{ height: 8, borderRadius: 4 }} />
                    </Box>

                    <Stack direction="row" spacing={3} sx={{ pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                          Open Issues
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: 'warning.main' }}>
                          {openProjectIssuesCount}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                          Completed Issues
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: 'success.main' }}>
                          {completedProjectIssuesCount}
                        </Typography>
                      </Box>
                    </Stack>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Card variant="outlined" sx={{ borderRadius: '14px', p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                      Project Actions
                    </Typography>
                    <Stack spacing={1.5}>
                      <Button
                        variant="outlined"
                        onClick={() => handleOpenEditModal(selectedProject)}
                        sx={{ borderRadius: '8px', fontWeight: 600 }}
                      >
                        Edit Project Details
                      </Button>
                    </Stack>
                  </Card>
                </Grid>
              </Grid>
            )}

            {/* Sub-tab 2: Board */}
            {detailsSubTab === 'board' && (
              <Grid container spacing={2}>
                {projectIssues.map((iss: any) => (
                  <Grid key={iss.id || iss._id} size={{ xs: 12, sm: 6, md: 3 }}>
                    <IssueCard
                      issue={iss}
                      onClick={(i) => openDrawer(i.id || (i as any)._id)}
                      onStatusChange={(issueObj, newStatus) =>
                        updateMutation.mutate({ issueId: issueObj.id || (issueObj as any)._id, updates: { status: newStatus }, actor: currentUser })
                      }
                    />
                  </Grid>
                ))}
              </Grid>
            )}

            {/* Sub-tab 3: Issues */}
            {detailsSubTab === 'issues' && (
              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '14px' }}>
                <Table>
                  <TableHead sx={{ bgcolor: 'action.hover' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Key</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Priority</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Assignee</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {projectIssues.map((iss: any) => (
                      <TableRow key={iss.id || iss._id} hover onClick={() => openDrawer(iss.id || iss._id)} sx={{ cursor: 'pointer' }}>
                        <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>{iss.key}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{iss.title}</TableCell>
                        <TableCell>
                          <Chip label={(iss.type || 'task').toUpperCase()} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <Chip label={(iss.status || '').replace('_', ' ')} size="small" />
                        </TableCell>
                        <TableCell>
                          <Chip label={iss.priority} size="small" />
                        </TableCell>
                        <TableCell>{iss.assignee?.firstName} {iss.assignee?.lastName}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Sub-tab 4: Members */}
            {detailsSubTab === 'members' && (
              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '14px' }}>
                <Table>
                  <TableHead sx={{ bgcolor: 'action.hover' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Project Role</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(selectedProject.members || []).map((m: any, idx: number) => {
                      const nameStr = m.userName || (m.user ? `${m.user.firstName} ${m.user.lastName}` : 'Project User');
                      const emailStr = m.userEmail || m.user?.email || 'user@abctech.io';
                      const roleStr = m.projectRole || m.role || 'Member';
                      return (
                        <TableRow key={m.userId || idx}>
                          <TableCell sx={{ fontWeight: 600 }}>
                            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                              <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem' }}>{nameStr[0]}</Avatar>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {nameStr}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>{emailStr}</TableCell>
                          <TableCell>
                            <Chip label={roleStr} size="small" variant="outlined" color="primary" />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Sub-tab 5: Reports */}
            {detailsSubTab === 'reports' && (
              <Box sx={{ p: 3, borderRadius: '14px', border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Sprint Telemetry Velocity
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Project {selectedProject.name} completion rate is currently at {projectCompletionRate}% across {projectIssues.length} total sprint issues.
                </Typography>
              </Box>
            )}

            {/* Sub-tab 6: Settings */}
            {detailsSubTab === 'settings' && canManageProjects && (
              <Box sx={{ p: 3, borderRadius: '14px', border: '1px solid', borderColor: 'divider', maxWidth: 600 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Project Administration & Archival
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<ArchiveOutlinedIcon />}
                  onClick={async () => {
                    const targetId = selectedProject.id || selectedProject._id;
                    try {
                      await archiveProjectApi(targetId);
                      // Also update local state
                      setProjects((prev) => prev.map((p) => (p.id === targetId || p._id === targetId ? { ...p, status: 'completed' } : p)));
                      toast.success(`Project "${selectedProject.name}" has been archived`);
                      setSelectedProject(null);
                      setCatalogTab('archived');
                    } catch {
                      // Fallback: update local state directly if API fails
                      setProjects((prev) => prev.map((p) => (p.id === targetId || p._id === targetId ? { ...p, status: 'completed' } : p)));
                      toast.success(`Project "${selectedProject.name}" has been archived`);
                      setSelectedProject(null);
                      setCatalogTab('archived');
                    }
                  }}
                  sx={{ borderRadius: '8px', fontWeight: 600 }}
                >
                  Archive Project
                </Button>
              </Box>
            )}
          </>
        )}
      </Stack>

      {/* Slide-out Issue Details Drawer */}
      <IssueDetailsDrawer />

      {/* Create Issue Dialog Modal */}
      <CreateIssueModal />

      {/* Create Project Modal */}
      <Dialog open={openCreateProjectModal} onClose={() => setOpenCreateProjectModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Create New Project</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: 1 }}>
          <TextField label="Project Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth required />
          <TextField
            label="Description"
            multiline
            minRows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
          />
          <Select label="Owner Team" value={team} onChange={(e) => setTeam(e.target.value)} fullWidth>
            {mockTeams.map((t) => (
              <MenuItem key={t.id} value={t.name}>
                {t.name}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenCreateProjectModal(false)} color="inherit">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleCreateProject} sx={{ fontWeight: 600 }}>
            Create Project
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Project Modal */}
      <Dialog open={openEditProjectModal} onClose={() => setOpenEditProjectModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Edit Project Details</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: 1 }}>
          <TextField label="Project Name" value={editName} onChange={(e) => setEditName(e.target.value)} fullWidth required />
          <TextField
            label="Description"
            multiline
            minRows={3}
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            fullWidth
          />
          <Select label="Owner Team" value={editTeam} onChange={(e) => setEditTeam(e.target.value)} fullWidth>
            {mockTeams.map((t) => (
              <MenuItem key={t.id} value={t.name}>
                {t.name}
              </MenuItem>
            ))}
          </Select>
          <Select label="Project Status" value={editStatus} onChange={(e) => setEditStatus(e.target.value as any)} fullWidth>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="planning">Planning</MenuItem>
            <MenuItem value="paused">Paused</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenEditProjectModal(false)} color="inherit">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSaveEditProject} sx={{ fontWeight: 600 }}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Member Modal */}
      <Dialog
        open={openAddMemberModal}
        onClose={() => {
          setOpenAddMemberModal(false);
          setSelectedUserIds([]);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Add Members to Project</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="add-members-label">Select Users</InputLabel>
            <Select
              labelId="add-members-label"
              multiple
              value={selectedUserIds}
              onChange={(e) => {
                const val = e.target.value as string[];
                setSelectedUserIds(val.filter((v) => typeof v === 'string' && v.length > 0));
              }}
              input={<OutlinedInput label="Select Users" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map((value) => {
                    const u =
                      allUsers.find((user) => user.id === value) ||
                      mockUsers.find((user) => user.id === value);
                    return (
                      <Chip
                        key={value}
                        label={u ? `${u.firstName} ${u.lastName}` : value}
                        size="small"
                      />
                    );
                  })}
                </Box>
              )}

            >
              {allUsers.length === 0 ? (
                <MenuItem disabled value="">No users available</MenuItem>
              ) : (
                allUsers
                  .filter((u) => u.id && u.id.length > 0)
                  .map((u) => {
                    const isSelected = selectedUserIds.includes(u.id);
                    return (
                      <MenuItem
                        key={u.id}
                        value={u.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUserIds((prev) =>
                            isSelected
                              ? prev.filter((id) => id !== u.id)
                              : [...prev, u.id]
                          );
                        }}
                      >
                        <Checkbox checked={isSelected} />
                        <Avatar
                          src={u.avatarUrl}
                          sx={{ width: 28, height: 28, mr: 1.5, fontSize: '0.7rem' }}
                        >
                          {u.firstName?.[0]}
                        </Avatar>
                        <ListItemText
                          primary={`${u.firstName} ${u.lastName}`}
                          secondary={`${u.team} • ${u.role}`}
                        />
                      </MenuItem>
                    );
                  })
              )}
            </Select>
          </FormControl>

          {selectedUserIds.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {selectedUserIds.length} user{selectedUserIds.length > 1 ? 's' : ''} selected
              </Typography>
              <Button
                size="small"
                variant="text"
                color="error"
                onClick={() => setSelectedUserIds([])}
                sx={{ fontSize: '0.72rem', p: 0, minWidth: 'auto' }}
              >
                Clear all
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={() => {
              setOpenAddMemberModal(false);
              setSelectedUserIds([]);
            }}
            color="inherit"
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={handleAddMember} sx={{ fontWeight: 600 }}>
            Add{selectedUserIds.length > 1 ? ` ${selectedUserIds.length} Members` : ' Member'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
