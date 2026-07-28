import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Stack,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import toast from 'react-hot-toast';

import { PageHeader } from '@/components/ui/PageHeader';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { useAuthStore } from '@/store/authStore';
import { userService } from '@/services/userService';
import { useIssuesQuery } from '@/features/issues/useIssues';
import { mockProjects } from '@/mock/projects';
import type { User } from '@/types/api';

export function ProfilePage() {
  const storeUser = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [profile, setProfile] = useState<User | null>(storeUser);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Form edit states
  const [avatarUrl, setAvatarUrl] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const { data: issues = [] } = useIssuesQuery();

  useEffect(() => {
    if (storeUser && (storeUser.id || (storeUser as unknown as { _id?: string })._id)) {
      const targetId = storeUser.id || (storeUser as unknown as { _id?: string })._id || '';
      userService
        .getUserById(targetId)
        .then((data) => {
          setProfile(data);
          setAvatarUrl(data.avatarUrl || '');
          setPhone(data.phone || '');
          setLocation(data.location || 'Hyderabad');
          setBio(data.bio || '');
        })
        .catch(() => {
          setProfile(storeUser);
        });
    }
  }, [storeUser]);

  const activeUser = profile || storeUser;

  if (!activeUser) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="text.secondary">Loading user profile...</Typography>
      </Container>
    );
  }

  const assignedProjects = mockProjects.slice(0, 3);
  const activeUserId = activeUser.id || (activeUser as unknown as { _id?: string })._id || '';
  const assignedIssues = issues.filter(
    (i) => i.assignee?.id === activeUserId || (i as unknown as { assigneeId?: string }).assigneeId === activeUserId
  ).slice(0, 5);

  const handleOpenEdit = () => {
    setAvatarUrl(activeUser.avatarUrl || '');
    setPhone(activeUser.phone || '');
    setLocation(activeUser.location || 'Hyderabad');
    setBio(activeUser.bio || '');
    setIsEditOpen(true);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const targetId = activeUser.id || (activeUser as unknown as { _id?: string })._id || '';
      const updated = await userService.updateProfile(targetId, {
        avatarUrl,
        phone,
        location,
        bio,
      });

      setProfile(updated);
      setUser({ ...activeUser, ...updated });
      toast.success('Profile updated successfully');
      setIsEditOpen(false);
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3.5}>
        <PageHeader
          title="User Profile"
          subtitle="View personal account details, employee metadata, team role, active projects, and assigned tasks."
        />

        {/* Profile Card */}
        <Card variant="outlined" sx={{ borderRadius: '14px' }}>
          <CardContent sx={{ p: 3 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}>
              <Stack direction="row" spacing={2.5} sx={{ alignItems: 'center' }}>
                <Avatar src={activeUser.avatarUrl} sx={{ width: 80, height: 80, fontSize: '1.75rem', fontWeight: 700 }}>
                  {activeUser.firstName ? activeUser.firstName[0] : 'U'}
                </Avatar>
                <Box>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>
                      {activeUser.firstName} {activeUser.lastName}
                    </Typography>
                    <Chip label={activeUser.role} color="primary" size="small" sx={{ fontWeight: 700, fontSize: '0.7rem' }} />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {activeUser.email} • Team: <strong>{activeUser.team || 'Engineering'}</strong>
                  </Typography>
                </Box>
              </Stack>
              <Button
                variant="outlined"
                startIcon={<EditOutlinedIcon />}
                onClick={handleOpenEdit}
                sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, alignSelf: { xs: 'flex-start', sm: 'center' } }}
              >
                Edit Profile
              </Button>
            </Stack>

            <Divider sx={{ my: 2.5 }} />

            {/* Employee Details Grid */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <BadgeOutlinedIcon color="action" fontSize="small" />
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Employee ID
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {activeUser.employeeId || 'EMP-1001'}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <LocationOnOutlinedIcon color="action" fontSize="small" />
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Location
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {activeUser.location || 'Hyderabad'}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <PhoneOutlinedIcon color="action" fontSize="small" />
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Phone
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {activeUser.phone || '+1 (555) 234-5678'}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <CalendarTodayOutlinedIcon color="action" fontSize="small" />
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Department
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {activeUser.department || activeUser.team || 'Engineering'}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>

            {activeUser.bio && (
              <Box sx={{ mt: 2.5, p: 2, bgcolor: 'action.hover', borderRadius: '8px' }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
                  <WorkOutlineOutlinedIcon fontSize="small" color="primary" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    About & Bio
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {activeUser.bio}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          {/* Assigned Projects */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Assigned Projects
            </Typography>
            <Stack spacing={2}>
              {assignedProjects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </Stack>
          </Grid>

          {/* Assigned Issues */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              My Assigned Issues ({assignedIssues.length})
            </Typography>
            <Card variant="outlined" sx={{ borderRadius: '14px' }}>
              <CardContent sx={{ p: 2 }}>
                {assignedIssues.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                    No assigned tasks found.
                  </Typography>
                ) : (
                  <Stack spacing={1.5}>
                    {assignedIssues.map((issue) => (
                      <Box
                        key={issue.id}
                        sx={{
                          p: 1.5,
                          borderRadius: '8px',
                          border: '1px solid',
                          borderColor: 'divider',
                          bgcolor: 'background.paper',
                        }}
                      >
                        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                            {issue.key}
                          </Typography>
                          <Chip
                            label={issue.status.replace('_', ' ')}
                            size="small"
                            sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700, bgcolor: 'action.hover' }}
                          />
                        </Stack>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {issue.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Due: {issue.dueDate} • {issue.projectName}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Edit Profile Dialog */}
        <Dialog open={isEditOpen} onClose={() => setIsEditOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 700 }}>Edit Personal Profile</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2.5} sx={{ pt: 1 }}>
              <TextField
                label="Avatar Image URL"
                fullWidth
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                helperText="Enter a valid image URL for your profile picture avatar."
              />
              <TextField
                label="Phone Number"
                fullWidth
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 234-5678"
              />
              <TextField
                label="Location / Office City"
                fullWidth
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Hyderabad, Bengaluru, San Francisco..."
              />
              <TextField
                label="Professional Bio"
                fullWidth
                multiline
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Short description of your skills and expertise..."
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setIsEditOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSaveProfile} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Container>
  );
}
