import { useState, useMemo } from 'react';
import {
  Container,
  Stack,
  Box,
  Typography,
  Button,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined';
import toast from 'react-hot-toast';

import { PageHeader } from '@/components/ui/PageHeader';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import type { UserRole, MockUser } from '@/mock/users';
import { mockTeams } from '@/mock/teams';
import { mockProjects } from '@/mock/projects';
import { useAuthStore } from '@/store/authStore';
import { hasPermission } from '@/features/auth/permissions';
import { useUsersQuery } from '@/hooks/useUsersQuery';

export function UsersPage() {
  const currentUser = useAuthStore((s) => s.user) || { id: 'usr-1', role: 'Super Admin' };
  const canManageUsers = hasPermission(currentUser, 'manage_users');
  const canInviteUsers = hasPermission(currentUser, 'invite_users');
  const canCreateDirect = hasPermission(currentUser, 'create_user_direct');

  const {
    data: users = [],
    isLoading,
    isError,
    inviteUser,
    createUserDirect,
    toggleUserStatus,
    adminUpdateUser,
  } = useUsersQuery();

  const [search, setSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  const [openModal, setOpenModal] = useState(false);
  const [onboardingTab, setOnboardingTab] = useState<'invite' | 'direct'>('invite');

  // Method 1: Invite User Form
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('Member');
  const [inviteTeam, setInviteTeam] = useState('IT');
  const [inviteProject, setInviteProject] = useState('Enterprise Platform Core');

  // Method 2: Direct Create User Form
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [directEmail, setDirectEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('IT');
  const [directRole, setDirectRole] = useState<UserRole>('Member');
  const [directTeam, setDirectTeam] = useState('IT');
  const [tempPassword, setTempPassword] = useState('Welcome@2026');

  // Admin Edit User State (including password reset/update)
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<MockUser | null>(null);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState<UserRole>('Member');
  const [editTeam, setEditTeam] = useState('IT');
  const [editStatus, setEditStatus] = useState<'Active' | 'Inactive'>('Active');
  const [editPhone, setEditPhone] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editPassword, setEditPassword] = useState('');

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        (u.firstName || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.lastName || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(search.toLowerCase());
      const matchesTeam = teamFilter === 'all' || u.team === teamFilter;
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      return matchesSearch && matchesTeam && matchesRole;
    });
  }, [users, search, teamFilter, roleFilter]);

  // Method 1 Execution: Invite User
  const handleSendInvite = async () => {
    if (!inviteEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }
    await inviteUser({ email: inviteEmail, role: inviteRole, team: inviteTeam, project: inviteProject });
    setInviteEmail('');
    setOpenModal(false);
    toast.success(`Invitation email sent to ${inviteEmail}!`);
  };

  // Method 2 Execution: Create User Directly
  const handleCreateDirectUser = async () => {
    if (!firstName.trim() || !lastName.trim() || !directEmail.trim()) {
      toast.error('Please fill in required fields (Name & Email)');
      return;
    }
    await createUserDirect({
      firstName,
      lastName,
      email: directEmail,
      phone,
      department,
      role: directRole,
      team: directTeam,
    });
    setFirstName('');
    setLastName('');
    setDirectEmail('');
    setPhone('');
    setOpenModal(false);
    toast.success(`User ${firstName} ${lastName} created & activated immediately!`);
  };

  const handleToggleStatus = async (id: string) => {
    if (!canManageUsers) {
      toast.error('Only Super Admin can deactivate users');
      return;
    }
    await toggleUserStatus(id);
    toast.success('User status updated');
  };

  const handleOpenEditUser = (user: MockUser) => {
    setEditingUser(user);
    setEditFirstName(user.firstName || '');
    setEditLastName(user.lastName || '');
    setEditEmail(user.email || '');
    setEditRole((user.role as UserRole) || 'Member');
    setEditTeam(user.team || 'IT');
    setEditStatus((user.status as any) || 'Active');
    setEditPhone(user.phone || '');
    setEditLocation(user.location || '');
    setEditPassword('');
    setOpenEditModal(true);
  };

  const handleSaveEditUser = async () => {
    if (!editingUser) return;
    const targetId = editingUser.id || (editingUser as any)._id;
    try {
      await adminUpdateUser({
        id: targetId,
        updates: {
          firstName: editFirstName.trim(),
          lastName: editLastName.trim(),
          email: editEmail.trim(),
          role: editRole,
          team: editTeam,
          status: editStatus as any,
          phone: editPhone.trim(),
          location: editLocation.trim(),
          ...(editPassword.trim() ? { password: editPassword.trim() } : {}),
        },
      });

      setOpenEditModal(false);
      toast.success(`User ${editFirstName} ${editLastName} updated successfully!`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to update user');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={3.5}>
        <PageHeader
          title="User Management Directory"
          subtitle="Manage workspace user accounts, assign workspace roles, team rosters, and update user credentials/passwords."
          actionText={canInviteUsers || canCreateDirect ? 'Add New User' : undefined}
          actionIcon={<PersonAddOutlinedIcon />}
          onAction={() => setOpenModal(true)}
        />

        {/* Search & Filter Toolbar */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: 'center' }}>
          <SearchBar placeholder="Search users by name or email..." value={search} onChange={setSearch} />
          <Stack direction="row" spacing={1.5}>
            <FilterDropdown
              value={teamFilter}
              onChange={setTeamFilter}
              options={[
                { label: 'All Teams', value: 'all' },
                ...mockTeams.map((t) => ({ label: t.name, value: t.name })),
              ]}
            />
            <FilterDropdown
              value={roleFilter}
              onChange={setRoleFilter}
              options={[
                { label: 'All Roles', value: 'all' },
                { label: 'Super Admin', value: 'Super Admin' },
                { label: 'Project Manager', value: 'Project Manager' },
                { label: 'Team Lead', value: 'Team Lead' },
                { label: 'Member', value: 'Member' },
                { label: 'Viewer', value: 'Viewer' },
                { label: 'Guest', value: 'Guest' },
              ]}
            />
          </Stack>
        </Stack>

        {/* Loading / Error States */}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={36} />
          </Box>
        )}

        {isError && (
          <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderRadius: '14px', color: 'error.main' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Failed to load user directory. Please try again.
            </Typography>
          </Paper>
        )}

        {/* User Management Table */}
        {!isLoading && !isError && (
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '14px', overflow: 'hidden' }}>
            <Table sx={{ minWidth: 700 }}>
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Workspace Role</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Team</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  {canManageUsers && (
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      Actions
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id || (user as any)._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                        <Avatar src={user.avatarUrl} sx={{ width: 34, height: 34, fontSize: '0.8rem', fontWeight: 700 }}>
                          {user.firstName ? user.firstName[0] : 'U'}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {user.firstName} {user.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {user.department || user.team}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.725rem',
                          bgcolor:
                            user.role === 'Super Admin'
                              ? 'rgba(99, 102, 241, 0.15)'
                              : 'action.hover',
                          color:
                            user.role === 'Super Admin'
                              ? '#6366f1'
                              : 'text.primary',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip label={user.team} size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: '0.725rem' }} />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.675rem',
                          bgcolor: user.status === 'Active' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(148, 163, 184, 0.12)',
                          color: user.status === 'Active' ? '#10b981' : '#64748b',
                          border: 'none',
                        }}
                      />
                    </TableCell>
                    {canManageUsers && (
                      <TableCell align="right">
                        <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                          <Tooltip title="Edit User Details & Password">
                            <IconButton size="small" onClick={() => handleOpenEditUser(user)}>
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={user.status === 'Active' ? 'Deactivate User' : 'Activate User'}>
                            <IconButton size="small" onClick={() => handleToggleStatus(user.id || (user as any)._id)} color={user.status === 'Active' ? 'error' : 'success'}>
                              {user.status === 'Active' ? <BlockOutlinedIcon fontSize="small" /> : <CheckCircleOutlinedIcon fontSize="small" />}
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Stack>

      {/* Onboarding Dialog: Method 1 (Invite) vs Method 2 (Direct Create) */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1, fontWeight: 700 }}>Add User to Workspace</DialogTitle>
        <Tabs
          value={onboardingTab}
          onChange={(_, val) => setOnboardingTab(val)}
          sx={{ px: 3, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<MailOutlineOutlinedIcon />} iconPosition="start" value="invite" label="Method 1: Invite User" sx={{ textTransform: 'none', fontWeight: 600 }} />
          <Tab icon={<AddCircleOutlineOutlinedIcon />} iconPosition="start" value="direct" label="Method 2: Create Directly" sx={{ textTransform: 'none', fontWeight: 600 }} />
        </Tabs>

        <DialogContent sx={{ display: 'grid', gap: 2, pt: 2.5 }}>
          {onboardingTab === 'invite' ? (
            /* Method 1: Invite User Form */
            <>
              <Typography variant="body2" color="text.secondary">
                Send an invitation email to onboard a new employee. The user will set their password upon receiving the email.
              </Typography>
              <TextField
                label="Email Address"
                type="email"
                placeholder="colleague@gmail.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                fullWidth
                required
              />
              <Select label="Workspace Role" value={inviteRole} onChange={(e) => setInviteRole(e.target.value as UserRole)} fullWidth>
                <MenuItem value="Super Admin">Super Admin</MenuItem>
                <MenuItem value="Project Manager">Project Manager</MenuItem>
                <MenuItem value="Team Lead">Team Lead</MenuItem>
                <MenuItem value="Member">Member</MenuItem>
                <MenuItem value="Viewer">Viewer</MenuItem>
                <MenuItem value="Guest">Guest</MenuItem>
              </Select>
              <Select label="Assign Team" value={inviteTeam} onChange={(e) => setInviteTeam(e.target.value)} fullWidth>
                {mockTeams.map((t) => (
                  <MenuItem key={t.id} value={t.name}>
                    {t.name}
                  </MenuItem>
                ))}
              </Select>
              <Select label="Initial Project (Optional)" value={inviteProject} onChange={(e) => setInviteProject(e.target.value)} fullWidth>
                {mockProjects.map((p) => (
                  <MenuItem key={p.id} value={p.name}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
            </>
          ) : (
            /* Method 2: Direct Create User Form */
            <>
              <Typography variant="body2" color="text.secondary">
                Directly create and activate a user account with a temporary password.
              </Typography>
              <Stack direction="row" spacing={2}>
                <TextField label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} fullWidth required />
                <TextField label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} fullWidth required />
              </Stack>
              <TextField label="Email Address" type="email" value={directEmail} onChange={(e) => setDirectEmail(e.target.value)} fullWidth required />
              <Stack direction="row" spacing={2}>
                <TextField label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth />
                <TextField label="Department" value={department} onChange={(e) => setDepartment(e.target.value)} fullWidth />
              </Stack>
              <Stack direction="row" spacing={2}>
                <Select label="Role" value={directRole} onChange={(e) => setDirectRole(e.target.value as UserRole)} fullWidth>
                  <MenuItem value="Super Admin">Super Admin</MenuItem>
                  <MenuItem value="Project Manager">Project Manager</MenuItem>
                  <MenuItem value="Team Lead">Team Lead</MenuItem>
                  <MenuItem value="Member">Member</MenuItem>
                  <MenuItem value="Viewer">Viewer</MenuItem>
                  <MenuItem value="Guest">Guest</MenuItem>
                </Select>
                <Select label="Team" value={directTeam} onChange={(e) => setDirectTeam(e.target.value)} fullWidth>
                  {mockTeams.map((t) => (
                    <MenuItem key={t.id} value={t.name}>
                      {t.name}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
              <TextField label="Temporary Password" type="password" value={tempPassword} onChange={(e) => setTempPassword(e.target.value)} fullWidth />
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenModal(false)} color="inherit">
            Cancel
          </Button>
          {onboardingTab === 'invite' ? (
            <Button variant="contained" onClick={handleSendInvite} sx={{ fontWeight: 600 }}>
              Send Invitation Email
            </Button>
          ) : (
            <Button variant="contained" onClick={handleCreateDirectUser} sx={{ fontWeight: 600 }}>
              Create Account Immediately
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Admin Edit User & Change Password Dialog Modal */}
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1, fontWeight: 700 }}>
          Edit User Profile & Credentials
        </DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Update user profile details, role assignment, team membership, or directly change their account password.
          </Typography>
          <Stack direction="row" spacing={2}>
            <TextField label="First Name" value={editFirstName} onChange={(e) => setEditFirstName(e.target.value)} fullWidth required />
            <TextField label="Last Name" value={editLastName} onChange={(e) => setEditLastName(e.target.value)} fullWidth required />
          </Stack>
          <TextField label="Email Address" type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} fullWidth required />
          
          <Stack direction="row" spacing={2}>
            <Select label="Workspace Role" value={editRole} onChange={(e) => setEditRole(e.target.value as UserRole)} fullWidth>
              <MenuItem value="Super Admin">Super Admin</MenuItem>
              <MenuItem value="Project Manager">Project Manager</MenuItem>
              <MenuItem value="Team Lead">Team Lead</MenuItem>
              <MenuItem value="Member">Member</MenuItem>
              <MenuItem value="Viewer">Viewer</MenuItem>
              <MenuItem value="Guest">Guest</MenuItem>
            </Select>
            <Select label="Assign Team" value={editTeam} onChange={(e) => setEditTeam(e.target.value)} fullWidth>
              {mockTeams.map((t) => (
                <MenuItem key={t.id} value={t.name}>
                  {t.name}
                </MenuItem>
              ))}
            </Select>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Select label="Account Status" value={editStatus} onChange={(e) => setEditStatus(e.target.value as any)} fullWidth>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
            <TextField label="Phone" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} fullWidth />
          </Stack>

          <TextField label="Location" value={editLocation} onChange={(e) => setEditLocation(e.target.value)} fullWidth />

          {/* New Password Reset Section */}
          <Paper variant="outlined" sx={{ p: 2, borderRadius: '10px', bgcolor: 'action.hover', borderStyle: 'dashed' }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
              <LockResetOutlinedIcon color="primary" fontSize="small" />
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Reset User Password (Optional)
              </Typography>
            </Stack>
            <TextField
              label="New Password"
              type="password"
              placeholder="Leave blank to keep current password"
              value={editPassword}
              onChange={(e) => setEditPassword(e.target.value)}
              fullWidth
              helperText="Entering a value will immediately hash and update this user's password."
            />
          </Paper>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenEditModal(false)} color="inherit">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSaveEditUser} sx={{ fontWeight: 600 }}>
            Save User Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
