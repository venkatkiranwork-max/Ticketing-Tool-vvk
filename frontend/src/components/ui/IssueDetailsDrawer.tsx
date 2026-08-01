import { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  Stack,
  IconButton,
  Chip,
  Select,
  MenuItem,
  TextField,
  Button,
  Divider,
  Tabs,
  Tab,
  Avatar,
  Checkbox,
  LinearProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import BugReportOutlinedIcon from '@mui/icons-material/BugReportOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import toast from 'react-hot-toast';
import LinkIcon from '@mui/icons-material/Link';
import InsertLinkOutlinedIcon from '@mui/icons-material/InsertLinkOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';

import { useUiStore, type DrawerTab } from '@/store/uiStore';
import {
  useIssueDetailsQuery,
  useUpdateIssueMutation,
  useCommentMutations,
  useAttachmentMutations,
  useChecklistMutations,
} from '@/features/issues/useIssues';
import { mockUsers, toMockUser } from '@/mock/users';
import { useAuthStore } from '@/store/authStore';
import { hasPermission } from '@/features/auth/permissions';
import { useUsersQuery } from '@/hooks/useUsersQuery';
import type { IssueStatus, IssuePriority, IssueType } from '@/mock/issues';

const typeIcons: Record<IssueType, React.ReactNode> = {
  task: <CheckCircleOutlinedIcon fontSize="small" sx={{ color: '#3b82f6' }} />,
  bug: <BugReportOutlinedIcon fontSize="small" sx={{ color: '#ef4444' }} />,
  story: <AutoAwesomeOutlinedIcon fontSize="small" sx={{ color: '#10b981' }} />,
  improvement: <TrendingUpOutlinedIcon fontSize="small" sx={{ color: '#f59e0b' }} />,
};

export function IssueDetailsDrawer() {
  const selectedIssueId = useUiStore((s) => s.selectedIssueId);
  const isDrawerOpen = useUiStore((s) => s.isDrawerOpen);
  const activeTab = useUiStore((s) => s.activeDrawerTab);
  const setDrawerTab = useUiStore((s) => s.setDrawerTab);
  const closeDrawer = useUiStore((s) => s.closeDrawer);

  const currentUser = toMockUser(useAuthStore((s) => s.user));

  const { data: issue } = useIssueDetailsQuery(selectedIssueId);
  const updateMutation = useUpdateIssueMutation();

  const { addComment, editComment, deleteComment } = useCommentMutations(selectedIssueId);
  const { addAttachment, removeAttachment } = useAttachmentMutations(selectedIssueId);
  const { data: allUsers = [] } = useUsersQuery();
  const usersForAssigneeSelect = allUsers.length > 0 ? allUsers : mockUsers;
  const { addChecklistItem, toggleChecklistItem, deleteChecklistItem } = useChecklistMutations(selectedIssueId);

  // Local state
  const [newCommentText, setNewCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [newChecklistText, setNewChecklistText] = useState('');

  const [localStatus, setLocalStatus] = useState<IssueStatus>('todo');
  const [localPriority, setLocalPriority] = useState<IssuePriority>('medium');
  const [localAssigneeId, setLocalAssigneeId] = useState<string>('');
  const [localDueDate, setLocalDueDate] = useState<string>('');
  const [localDescription, setLocalDescription] = useState<string>('');

  useEffect(() => {
    if (issue) {
      setLocalStatus(issue.status);
      setLocalPriority(issue.priority);
      setLocalAssigneeId(issue.assignee?.id || '');
      setLocalDueDate(issue.dueDate || '');
      setLocalDescription(issue.description || '');
    }
  }, [issue?.id, issue?.status, issue?.priority, issue?.assignee?.id, issue?.dueDate, issue?.description]);

  const handleSaveAll = () => {
    if (!issue) return;
    const matchedAssignee = usersForAssigneeSelect.find(u => u.id === localAssigneeId) || mockUsers.find(u => u.id === localAssigneeId) || mockUsers[0];
    
    updateMutation.mutate({
      issueId: issue.id,
      updates: {
        status: localStatus,
        priority: localPriority,
        assignee: matchedAssignee as any,
        dueDate: localDueDate,
        description: localDescription,
      },
      actor: currentUser,
    }, {
      onSuccess: () => {
        toast.success('Issue details saved successfully!');
      },
      onError: () => {
        toast.error('Failed to save issue details.');
      }
    });
  };

  if (!isDrawerOpen || !issue) {
    return null;
  }

  // Permission Checks
  const isAssignedToMe = issue.assignee?.id === currentUser.id;
  const canEditAllFields = hasPermission(currentUser, 'edit_all_issues') || hasPermission(currentUser, 'assign_issues');
  const canEditStatus = canEditAllFields || (hasPermission(currentUser, 'edit_assigned_issues') && isAssignedToMe);

  // Checklist calculations
  const checklist = issue.checklist || [];
  const completedChecklistCount = checklist.filter((c) => c.isCompleted).length;
  const checklistPercentage = checklist.length ? Math.round((completedChecklistCount / checklist.length) * 100) : 0;

  const handleAddCommentSubmit = () => {
    if (!newCommentText.trim()) return;
    addComment.mutate({ text: newCommentText, actor: currentUser });
    setNewCommentText('');
  };

  const handleSaveEditedComment = (commentId: string) => {
    if (!editingCommentText.trim()) return;
    editComment.mutate({ commentId, newText: editingCommentText });
    setEditingCommentId(null);
    setEditingCommentText('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    addAttachment.mutate({ file, actor: currentUser });
  };

  const handleAddChecklistSubmit = () => {
    if (!newChecklistText.trim()) return;
    addChecklistItem.mutate(newChecklistText);
    setNewChecklistText('');
  };

  return (
    <Drawer anchor="right" open={isDrawerOpen} onClose={closeDrawer} slotProps={{ paper: { sx: { width: { xs: '100%', sm: 580 }, p: 0 } } }}>
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Drawer Header */}
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'action.hover' }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Chip label={issue.key} color="primary" size="small" sx={{ fontWeight: 800, fontSize: '0.75rem' }} />
              <Chip
                icon={(typeIcons[issue.type as IssueType] || typeIcons.task) as React.ReactElement}
                label={(issue.type || 'task').toUpperCase()}
                size="small"
                variant="outlined"
                sx={{ fontWeight: 700, fontSize: '0.7rem' }}
              />
              <Chip label={issue.projectName} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
            </Stack>
            <IconButton onClick={closeDrawer} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
          <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.35 }}>
            {issue.title}
          </Typography>
        </Box>

        {/* 4 Tabs Header: Details | Comments | Attachments | Activity */}
        <Tabs
          value={activeTab}
          onChange={(_, val: DrawerTab) => setDrawerTab(val)}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}
        >
          <Tab icon={<DescriptionOutlinedIcon fontSize="small" />} label="Details" value="details" sx={{ textTransform: 'none', fontWeight: 700 }} />
          <Tab icon={<ChatBubbleOutlineOutlinedIcon fontSize="small" />} label={`Comments (${issue.comments?.length || 0})`} value="comments" sx={{ textTransform: 'none', fontWeight: 700 }} />
          <Tab icon={<AttachFileOutlinedIcon fontSize="small" />} label={`Files (${issue.attachments?.length || 0})`} value="attachments" sx={{ textTransform: 'none', fontWeight: 700 }} />
          <Tab icon={<HistoryOutlinedIcon fontSize="small" />} label="Activity" value="activity" sx={{ textTransform: 'none', fontWeight: 700 }} />
        </Tabs>

        {/* Tab Body Contents */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
          {/* TAB 1: DETAILS */}
          {activeTab === 'details' && (
            <Stack spacing={3}>
              {/* Description */}
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                  Description
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={localDescription}
                  onChange={(e) => setLocalDescription(e.target.value)}
                  disabled={!canEditAllFields}
                  placeholder="Enter work item description..."
                  sx={{
                    mt: 1,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                    }
                  }}
                />
              </Box>

              <Divider />

              {/* Action Buttons Bar */}
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AccountTreeOutlinedIcon />}
                  onClick={() => toast.success('Sub-work item creation is ready!')}
                  sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 600, borderColor: 'divider', color: 'text.primary' }}
                >
                  Add sub-work item
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<LinkIcon />}
                  onClick={() => toast.success('Relation linkage is ready!')}
                  sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 600, borderColor: 'divider', color: 'text.primary' }}
                >
                  Add relation
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<InsertLinkOutlinedIcon />}
                  onClick={() => toast.success('External link attachment is ready!')}
                  sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 600, borderColor: 'divider', color: 'text.primary' }}
                >
                  Add link
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AttachFileOutlinedIcon />}
                  onClick={() => {
                    const tabEl = document.querySelector('[value="attachments"]') as HTMLElement;
                    tabEl?.click();
                  }}
                  sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 600, borderColor: 'divider', color: 'text.primary' }}
                >
                  Attach
                </Button>
              </Stack>

              <Divider />

              {/* Properties Section */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2 }}>
                  Properties
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: 2, alignItems: 'center' }}>
                  
                  {/* State */}
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>State</Typography>
                  <Select
                    value={localStatus}
                    onChange={(e) => setLocalStatus(e.target.value as IssueStatus)}
                    disabled={!canEditStatus}
                    size="small"
                    sx={{
                      borderRadius: '8px',
                      maxWidth: 220,
                      bgcolor:
                        localStatus === 'done'
                          ? 'rgba(16, 185, 129, 0.08)'
                          : localStatus === 'in_progress'
                          ? 'rgba(245, 158, 11, 0.08)'
                          : localStatus === 'review'
                          ? 'rgba(139, 92, 246, 0.08)'
                          : 'rgba(100, 116, 139, 0.08)',
                      color:
                        localStatus === 'done'
                          ? '#10b981'
                          : localStatus === 'in_progress'
                          ? '#f59e0b'
                          : localStatus === 'review'
                          ? '#8b5cf6'
                          : 'text.primary',
                      fontWeight: 700,
                    }}
                  >
                    <MenuItem value="backlog">Backlog</MenuItem>
                    <MenuItem value="todo">To Do</MenuItem>
                    <MenuItem value="in_progress">In Progress</MenuItem>
                    <MenuItem value="review">In Review</MenuItem>
                    <MenuItem value="done">Done</MenuItem>
                  </Select>

                  {/* Assignees */}
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Assignees</Typography>
                  <Select
                    value={localAssigneeId}
                    onChange={(e) => setLocalAssigneeId(e.target.value)}
                    disabled={!canEditAllFields}
                    size="small"
                    sx={{ borderRadius: '8px', maxWidth: 220 }}
                  >
                    {usersForAssigneeSelect.map((u) => (
                      <MenuItem key={u.id} value={u.id}>
                        {u.firstName} {u.lastName}
                      </MenuItem>
                    ))}
                  </Select>

                  {/* Priority */}
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Priority</Typography>
                  <Select
                    value={localPriority}
                    onChange={(e) => setLocalPriority(e.target.value as IssuePriority)}
                    disabled={!canEditAllFields}
                    size="small"
                    sx={{
                      borderRadius: '8px',
                      maxWidth: 220,
                      bgcolor:
                        localPriority === 'critical'
                          ? 'rgba(239, 68, 68, 0.08)'
                          : localPriority === 'high'
                          ? 'rgba(249, 115, 22, 0.08)'
                          : localPriority === 'medium'
                          ? 'rgba(234, 179, 8, 0.08)'
                          : 'rgba(59, 130, 246, 0.08)',
                      color:
                        localPriority === 'critical'
                          ? '#ef4444'
                          : localPriority === 'high'
                          ? '#f97316'
                          : localPriority === 'medium'
                          ? '#eab308'
                          : '#3b82f6',
                      fontWeight: 700,
                    }}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="critical">Critical</MenuItem>
                  </Select>

                  {/* Created by */}
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Created by</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {issue.reporter ? `${issue.reporter.firstName} ${issue.reporter.lastName}` : 'Suresh Kumar'}
                  </Typography>

                  {/* Start Date */}
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Start date</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {issue.key === 'APIDE-1' ? 'Jul 10, 2026' : 'Jul 22, 2026'}
                  </Typography>

                  {/* Due Date */}
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Due date</Typography>
                  <TextField
                    type="date"
                    value={localDueDate}
                    disabled={!canEditAllFields}
                    onChange={(e) => setLocalDueDate(e.target.value)}
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' }, maxWidth: 220 }}
                  />

                  {/* Modules */}
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Modules</Typography>
                  <Chip
                    label={issue.key === 'APIDE-1' ? 'GST_API' : 'None'}
                    size="small"
                    variant="outlined"
                    sx={{
                      width: 'fit-content',
                      fontWeight: 700,
                      bgcolor: issue.key === 'APIDE-1' ? 'rgba(15, 23, 42, 0.05)' : 'transparent',
                      borderRadius: '6px'
                    }}
                  />

                  {/* Cycle */}
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Cycle</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {issue.key === 'APIDE-1' ? 'No cycle' : issue.sprint || 'Sprint 1'}
                  </Typography>

                  {/* Parent */}
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Parent</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    Add parent work item
                  </Typography>

                  {/* Labels */}
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Labels</Typography>
                  <Stack direction="row" spacing={0.5}>
                    {issue.labels && issue.labels.length > 0 ? (
                      issue.labels.map(l => <Chip key={l} label={l} size="small" />)
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>Select label</Typography>
                    )}
                  </Stack>
                </Box>
              </Box>

              <Divider />
              
              {/* SAVE BUTTON FOR PROPERTIES */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
                <Button
                  variant="contained"
                  onClick={handleSaveAll}
                  disabled={updateMutation.isPending}
                  sx={{
                    borderRadius: '8px',
                    px: 3.5,
                    py: 1,
                    fontWeight: 700,
                    textTransform: 'none',
                    bgcolor: '#2563eb',
                    '&:hover': { bgcolor: '#1d4ed8' },
                    boxShadow: 'none',
                  }}
                >
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>

              <Divider />

              {/* ISSUE CHECKLIST FEATURE */}
              <Box>
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <CheckBoxOutlinedIcon fontSize="small" color="primary" />
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      Issue Checklist
                    </Typography>
                  </Stack>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                    {completedChecklistCount} / {checklist.length} Complete
                  </Typography>
                </Stack>

                {checklist.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <LinearProgress variant="determinate" value={checklistPercentage} sx={{ height: 6, borderRadius: 3 }} />
                  </Box>
                )}

                <Stack spacing={0.5} sx={{ mb: 2 }}>
                  {checklist.map((item) => (
                    <Stack
                      key={item.id}
                      direction="row"
                      spacing={1}
                      sx={{
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 0.75,
                        borderRadius: '6px',
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                    >
                      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <Checkbox
                          size="small"
                          checked={item.isCompleted}
                          onChange={() => toggleChecklistItem.mutate(item.id)}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            textDecoration: item.isCompleted ? 'line-through' : 'none',
                            color: item.isCompleted ? 'text.secondary' : 'text.primary',
                            fontWeight: 500,
                          }}
                        >
                          {item.text}
                        </Typography>
                      </Stack>
                      <IconButton size="small" onClick={() => deleteChecklistItem.mutate(item.id)}>
                        <DeleteOutlinedIcon fontSize="small" sx={{ fontSize: '0.9rem', color: 'text.disabled' }} />
                      </IconButton>
                    </Stack>
                  ))}
                </Stack>

                <Stack direction="row" spacing={1}>
                  <TextField
                    placeholder="Add checklist task (e.g. Write Tests, Review PR)..."
                    value={newChecklistText}
                    onChange={(e) => setNewChecklistText(e.target.value)}
                    size="small"
                    fullWidth
                    onKeyDown={(e) => e.key === 'Enter' && handleAddChecklistSubmit()}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  />
                  <Button variant="outlined" size="small" onClick={handleAddChecklistSubmit} sx={{ borderRadius: '8px', fontWeight: 600 }}>
                    Add
                  </Button>
                </Stack>
              </Box>
            </Stack>
          )}

          {/* TAB 2: COMMENTS */}
          {activeTab === 'comments' && (
            <Stack spacing={2.5}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                Discussion Conversation
              </Typography>

              {/* Add Comment Input */}
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
                <Avatar src={currentUser.avatarUrl} sx={{ width: 32, height: 32, mt: 0.5 }}>
                  {currentUser.firstName ? currentUser.firstName[0] : 'U'}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    placeholder="Write a comment..."
                    multiline
                    minRows={2}
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    fullWidth
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  />
                  <Stack direction="row" sx={{ justifyContent: 'flex-end', mt: 1 }}>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<SendIcon fontSize="small" />}
                      onClick={handleAddCommentSubmit}
                      disabled={!newCommentText.trim() || addComment.isPending}
                      sx={{ borderRadius: '8px', fontWeight: 600 }}
                    >
                      Post Comment
                    </Button>
                  </Stack>
                </Box>
              </Stack>

              <Divider />

              {/* Comment List — Newest First */}
              <Stack spacing={2}>
                {(issue.comments || []).length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                    No comments yet. Be the first to start the discussion!
                  </Typography>
                ) : (
                  issue.comments?.map((c) => {
                    const commentUser = typeof c.user === 'object' ? c.user : null;
                    const isOwnComment = commentUser?.id === currentUser.id;
                    const isEditing = editingCommentId === c.id;

                    return (
                      <Box key={c.id} sx={{ p: 2, borderRadius: '10px', bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider' }}>
                        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                            <Avatar src={commentUser?.avatarUrl} sx={{ width: 28, height: 28 }}>
                              {commentUser?.firstName ? commentUser.firstName[0] : 'U'}
                            </Avatar>
                            <Box>
                              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                {commentUser?.firstName || 'User'} {commentUser?.lastName || ''}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.7rem' }}>
                                {new Date(c.createdAt).toLocaleString()}
                              </Typography>
                            </Box>
                          </Stack>

                          {isOwnComment && !isEditing && (
                            <Stack direction="row" spacing={0.5}>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setEditingCommentId(c.id);
                                  setEditingCommentText(c.text);
                                }}
                              >
                                <EditOutlinedIcon fontSize="small" sx={{ fontSize: '1rem' }} />
                              </IconButton>
                              <IconButton size="small" color="error" onClick={() => deleteComment.mutate(c.id)}>
                                <DeleteOutlinedIcon fontSize="small" sx={{ fontSize: '1rem' }} />
                              </IconButton>
                            </Stack>
                          )}
                        </Stack>

                        {isEditing ? (
                          <Box sx={{ mt: 1 }}>
                            <TextField
                              value={editingCommentText}
                              onChange={(e) => setEditingCommentText(e.target.value)}
                              multiline
                              fullWidth
                              size="small"
                            />
                            <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end', mt: 1 }}>
                              <Button size="small" onClick={() => setEditingCommentId(null)}>
                                Cancel
                              </Button>
                              <Button variant="contained" size="small" onClick={() => handleSaveEditedComment(c.id)}>
                                Save
                              </Button>
                            </Stack>
                          </Box>
                        ) : (
                          <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.5 }}>
                            {c.text}
                          </Typography>
                        )}
                      </Box>
                    );
                  })
                )}
              </Stack>
            </Stack>
          )}

          {/* TAB 3: ATTACHMENTS */}
          {activeTab === 'attachments' && (
            <Stack spacing={2.5}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                Uploaded File Attachments
              </Typography>

              {/* Upload Dropzone */}
              <Box
                component="label"
                sx={{
                  p: 3,
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  cursor: 'pointer',
                  bgcolor: 'action.hover',
                  '&:hover': { borderColor: 'primary.main' },
                }}
              >
                <CloudUploadOutlinedIcon color="primary" fontSize="medium" />
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  Upload Images, PDF, Word, or Excel files
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Max file size 25MB.
                </Typography>
                <input type="file" hidden accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" onChange={handleFileUpload} />
              </Box>

              <Divider />

              {/* Attachment List */}
              <Stack spacing={1.5}>
                {(issue.attachments || []).length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                    No files attached yet.
                  </Typography>
                ) : (
                  issue.attachments?.map((att) => (
                    <Box
                      key={att.id}
                      sx={{
                        p: 1.5,
                        borderRadius: '8px',
                        border: '1px solid',
                        borderColor: 'divider',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                        <AttachFileOutlinedIcon color="primary" />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {att.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {(att.size / 1024).toFixed(1)} KB • Uploaded by {att.uploadedBy}
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" spacing={1}>
                        <IconButton size="small" component="a" href={att.url} download={att.name} color="primary">
                          <DownloadOutlinedIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => removeAttachment.mutate(att.id)}>
                          <DeleteOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Box>
                  ))
                )}
              </Stack>
            </Stack>
          )}

          {/* TAB 4: READ-ONLY ACTIVITY TIMELINE */}
          {activeTab === 'activity' && (
            <Stack spacing={2}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                Automated Audit & Event Log
              </Typography>

              <Stack spacing={2} sx={{ pl: 1, borderLeft: '2px solid', borderColor: 'primary.main', ml: 1 }}>
                {(issue.history || []).map((entry) => (
                  <Box key={entry.id} sx={{ pl: 2, position: 'relative' }}>
                    <Box
                      sx={{
                        position: 'absolute',
                        left: -13,
                        top: 2,
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                      }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {entry.actor?.firstName ? `${entry.actor.firstName} ${entry.actor.lastName}` : 'System'} — {entry.details}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                      {entry.timeAgo} ({new Date(entry.timestamp).toLocaleTimeString()})
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Stack>
          )}
        </Box>
      </Box>
    </Drawer>
  );
}
