import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  Stack,
  Box,
  Typography,
  Chip,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  FormControl,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import BugReportOutlinedIcon from '@mui/icons-material/BugReportOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';

import { useUiStore } from '@/store/uiStore';
import { useCreateIssueMutation } from '@/features/issues/useIssues';
import { useAuthStore } from '@/store/authStore';
import { mockUsers, toMockUser } from '@/mock/users';
import { mockProjects } from '@/mock/projects';
import { useProjectsQuery } from '@/hooks/useProjectsQuery';
import { useUsersQuery } from '@/hooks/useUsersQuery';
import type { IssueType, IssueAttachmentItem } from '@/mock/issues';

const typeIcons: Record<IssueType, React.ReactNode> = {
  task: <CheckCircleOutlinedIcon fontSize="small" sx={{ color: '#3b82f6' }} />,
  bug: <BugReportOutlinedIcon fontSize="small" sx={{ color: '#ef4444' }} />,
  story: <AutoAwesomeOutlinedIcon fontSize="small" sx={{ color: '#10b981' }} />,
  improvement: <TrendingUpOutlinedIcon fontSize="small" sx={{ color: '#f59e0b' }} />,
};

export function CreateIssueModal() {
  const isCreateModalOpen = useUiStore((s) => s.isCreateModalOpen);
  const closeCreateModal = useUiStore((s) => s.closeCreateModal);

  const currentUser = toMockUser(useAuthStore((s) => s.user));
  const createMutation = useCreateIssueMutation();

  const { data: projectsData } = useProjectsQuery();
  const { data: usersData } = useUsersQuery();

  const projectsList = Array.isArray(projectsData) && projectsData.length > 0 ? projectsData : mockProjects;
  const usersList = Array.isArray(usersData) && usersData.length > 0 ? usersData : mockUsers;

  // Form states
  const [projectId, setProjectId] = useState<string>('');
  const [sprint, setSprint] = useState('Sprint 24 (Q3 Platform)');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<IssueType>('task');
  const [priority, setPriority] = useState<'critical' | 'high' | 'medium' | 'low'>('medium');
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [dueDate, setDueDate] = useState(() => new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
  const [labelsInput, setLabelsInput] = useState('Feature, Backend');
  const [storyPoints, setStoryPoints] = useState(5);
  const [attachedFiles, setAttachedFiles] = useState<IssueAttachmentItem[]>([]);

  useEffect(() => {
    if (projectsList.length > 0 && !projectId) {
      const firstId = (projectsList[0] as any)._id || projectsList[0].id;
      setProjectId(firstId);
    }
  }, [projectsList, projectId]);

  useEffect(() => {
    if (usersList.length > 0 && !assigneeId) {
      const firstId = (usersList[0] as any)._id || usersList[0].id;
      setAssigneeId(firstId);
    }
  }, [usersList, assigneeId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const files = Array.from(e.target.files);
    const newAttachments: IssueAttachmentItem[] = files.map((file, i) => ({
      id: `temp-att-${Date.now()}-${i}`,
      name: file.name,
      size: file.size,
      fileType: file.type || 'application/octet-stream',
      url: '#',
      uploadedBy: `${currentUser.firstName} ${currentUser.lastName}`,
      uploadedAt: new Date().toISOString(),
    }));
    setAttachedFiles((prev) => [...prev, ...newAttachments]);
  };

  const handleCreate = async () => {
    if (!title.trim()) return;

    const selectedProjObj =
      projectsList.find((p: any) => p.id === projectId || p._id === projectId) || projectsList[0];
    const selectedAssigneeObj =
      usersList.find((u: any) => u.id === assigneeId || u._id === assigneeId) || usersList[0];

    const targetProjectId = (selectedProjObj as any)?._id || selectedProjObj?.id || projectId;
    const targetAssigneeId = (selectedAssigneeObj as any)?._id || selectedAssigneeObj?.id || assigneeId;
    const targetWorkspaceId =
      (selectedProjObj as any)?.workspaceId || (currentUser as any)?.workspaceId;

    const labels = labelsInput.split(',').map((l) => l.trim()).filter(Boolean);

    try {
      await createMutation.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        type,
        status: 'todo',
        priority,
        assigneeId: targetAssigneeId,
        reporter: currentUser,
        projectId: targetProjectId,
        projectName: selectedProjObj?.name || 'Enterprise Core',
        workspaceId: targetWorkspaceId,
        sprint,
        dueDate,
        labels,
        storyPoints,
        attachments: attachedFiles,
      } as any);

      // Reset & Close
      setTitle('');
      setDescription('');
      setAttachedFiles([]);
      closeCreateModal();
    } catch {
      // Error toast handled in mutation onError; keep modal open for corrections
    }
  };

  return (
    <Dialog open={isCreateModalOpen} onClose={closeCreateModal} maxWidth="md" fullWidth>
      <DialogTitle sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
              Create New Issue
            </Typography>
            <Typography variant="caption" color="text.secondary">
              TicketFlow office project issue creation workflow.
            </Typography>
          </Box>
          <IconButton size="small" onClick={closeCreateModal}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* Issue Type Selection */}
          <FormControl component="fieldset">
            <FormLabel sx={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', mb: 1 }}>
              Issue Type *
            </FormLabel>
            <RadioGroup row value={type} onChange={(e) => setType(e.target.value as IssueType)}>
              {(['task', 'bug', 'story', 'improvement'] as IssueType[]).map((t) => (
                <FormControlLabel
                  key={t}
                  value={t}
                  control={<Radio size="small" />}
                  label={
                    <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
                      {typeIcons[t]}
                      <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                        {t}
                      </Typography>
                    </Stack>
                  }
                  sx={{
                    border: '1px solid',
                    borderColor: type === t ? 'primary.main' : 'divider',
                    borderRadius: '8px',
                    px: 1.5,
                    py: 0.5,
                    mr: 1.5,
                    bgcolor: type === t ? 'action.selected' : 'transparent',
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>

          {/* Basic Info: Project & Sprint */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                Project *
              </Typography>
              <Select value={projectId} onChange={(e) => setProjectId(e.target.value)} size="small" fullWidth sx={{ mt: 0.5, borderRadius: '8px' }}>
                {projectsList.map((p: any) => {
                  const idVal = p._id || p.id;
                  return (
                    <MenuItem key={idVal} value={idVal}>
                      {p.name} {p.team ? `(${p.team})` : ''}
                    </MenuItem>
                  );
                })}
              </Select>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                Sprint
              </Typography>
              <TextField
                value={sprint}
                onChange={(e) => setSprint(e.target.value)}
                size="small"
                fullWidth
                sx={{ mt: 0.5, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>
          </Stack>

          {/* Title & Description */}
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
              Issue Title *
            </Typography>
            <TextField
              placeholder="e.g. Upgrade Redis Sentinel configuration to support SSL TLS endpoints"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              size="small"
              fullWidth
              required
              sx={{ mt: 0.5, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
              Description
            </Typography>
            <TextField
              placeholder="Detailed description, reproduction steps, or acceptance criteria..."
              multiline
              minRows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              sx={{ mt: 0.5, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Box>

          {/* Assignment & Reporter */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                Assignee *
              </Typography>
              <Select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)} size="small" fullWidth sx={{ mt: 0.5, borderRadius: '8px' }}>
                {usersList.map((u: any) => {
                  const idVal = u._id || u.id;
                  return (
                    <MenuItem key={idVal} value={idVal}>
                      {u.firstName} {u.lastName} ({u.role})
                    </MenuItem>
                  );
                })}
              </Select>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                Reporter
              </Typography>
              <TextField
                value={`${currentUser.firstName} ${currentUser.lastName} (${currentUser.role})`}
                disabled
                size="small"
                fullWidth
                sx={{ mt: 0.5, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>
          </Stack>

          {/* Planning: Priority, Due Date, Labels, Points */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr 1fr' }, gap: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                Priority
              </Typography>
              <Select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'critical' | 'high' | 'medium' | 'low')}
                size="small"
                fullWidth
                sx={{ mt: 0.5, borderRadius: '8px' }}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
              </Select>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                Due Date
              </Typography>
              <TextField
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                size="small"
                fullWidth
                sx={{ mt: 0.5, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                Labels (comma separated)
              </Typography>
              <TextField
                value={labelsInput}
                onChange={(e) => setLabelsInput(e.target.value)}
                size="small"
                fullWidth
                sx={{ mt: 0.5, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                Story Points
              </Typography>
              <TextField
                type="number"
                value={storyPoints}
                onChange={(e) => setStoryPoints(Number(e.target.value))}
                size="small"
                fullWidth
                sx={{ mt: 0.5, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>
          </Box>

          {/* Files / Attachments */}
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
              Attachments (Images, PDF, Word, Excel)
            </Typography>
            <Box
              component="label"
              sx={{
                mt: 0.5,
                p: 2,
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                cursor: 'pointer',
                bgcolor: 'action.hover',
                '&:hover': { borderColor: 'primary.main' },
              }}
            >
              <CloudUploadOutlinedIcon color="primary" fontSize="small" />
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                Click to attach files
              </Typography>
              <input type="file" multiple hidden accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" onChange={handleFileChange} />
            </Box>

            {attachedFiles.length > 0 && (
              <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 1 }}>
                {attachedFiles.map((f) => (
                  <Chip
                    key={f.id}
                    label={f.name}
                    onDelete={() => setAttachedFiles((prev) => prev.filter((a) => a.id !== f.id))}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Stack>
            )}
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button onClick={closeCreateModal} color="inherit" sx={{ fontWeight: 600 }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleCreate} disabled={createMutation.isPending || !title.trim()} sx={{ fontWeight: 700, px: 3 }}>
          {createMutation.isPending ? 'Creating...' : 'Create Issue'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
