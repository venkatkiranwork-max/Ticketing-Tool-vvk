import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Stack,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  MenuItem,
  IconButton,
  Tooltip,
  Divider,
  Grid,
  Card,
  CardContent,
  Menu,
  Switch,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LockResetIcon from '@mui/icons-material/LockReset';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SecurityIcon from '@mui/icons-material/Security';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import ShieldIcon from '@mui/icons-material/Shield';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PeopleIcon from '@mui/icons-material/People';
import TuneIcon from '@mui/icons-material/Tune';

import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { mockUsers as initialMockUsers, type MockUser, type UserStatus, type ScreenKey, type FeaturePermissionKey } from '@/mock/users';
import { Forbidden403Page } from '@/pages/Forbidden403Page';
import { UserDetailDrawer } from '@/components/admin/UserDetailDrawer';
import { CreateUserModal } from '@/components/admin/CreateUserModal';
import { ScreenAccessModal } from '@/components/admin/ScreenAccessModal';
import { FeaturePermissionsModal } from '@/components/admin/FeaturePermissionsModal';
import { WelcomeEmailModal } from '@/components/admin/WelcomeEmailModal';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export const AdministrationPage: React.FC = () => {
  const currentUser = useAuthStore((s) => s.user);

  // Super Admin Check
  const isSuperAdmin = currentUser?.role === 'Super Admin' || currentUser?.role === 'super_admin';
  if (!isSuperAdmin) {
    return <Forbidden403Page />;
  }

  const [activeTab, setActiveTab] = useState(0);
  const [usersList, setUsersList] = useState<MockUser[]>(initialMockUsers);

  // Filter and Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modal / Drawer States
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [screenAccessOpen, setScreenAccessOpen] = useState(false);
  const [featurePermissionsOpen, setFeaturePermissionsOpen] = useState(false);
  const [welcomeEmailOpen, setWelcomeEmailOpen] = useState(false);
  const [welcomeUser, setWelcomeUser] = useState<{ firstName: string; lastName: string; email: string; tempPassword?: string } | null>(null);

  // Action Menu state
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [targetUser, setTargetUser] = useState<MockUser | null>(null);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState([
    { id: '1', time: '10:30 AM', actor: 'Alex Rivera', role: 'Super Admin', action: 'Granted Reports access to David Kim', module: 'Screen Access', status: 'SUCCESS' },
    { id: '2', time: '10:45 AM', actor: 'Alex Rivera', role: 'Super Admin', action: 'Locked Chloe Dupont account', module: 'User Status', status: 'WARNING' },
    { id: '3', time: '11:10 AM', actor: 'Sarah Chen', role: 'Admin', action: 'Created Employee Portal project', module: 'Projects', status: 'SUCCESS' },
    { id: '4', time: '01:15 PM', actor: 'Alex Rivera', role: 'Super Admin', action: 'Reset password for Marcus Vance', module: 'User Management', status: 'SUCCESS' },
  ]);

  // Handlers for User Actions
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: MockUser) => {
    setMenuAnchor(event.currentTarget);
    setTargetUser(user);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleCreateUser = (newUserPartial: Partial<MockUser>) => {
    const newUser: MockUser = {
      id: `usr-${usersList.length + 1}`,
      employeeId: newUserPartial.employeeId || `EMP-${1000 + usersList.length + 1}`,
      firstName: newUserPartial.firstName || '',
      lastName: newUserPartial.lastName || '',
      email: newUserPartial.email || '',
      role: newUserPartial.role || 'Member',
      team: newUserPartial.team || 'Engineering',
      status: 'Active',
      avatarUrl: newUserPartial.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      department: newUserPartial.department || 'Engineering',
      phone: newUserPartial.phone || '',
      location: newUserPartial.location || 'San Francisco, CA',
      lastLogin: 'Never',
      createdDate: 'Today',
      online: false,
      activeProjectsCount: 0,
      completedTasksCount: 0,
      screens: {
        dashboard: true,
        projects: true,
        issues: true,
        board: true,
        teams: true,
        users: true,
        reports: true,
        auditLogs: false,
        administration: false,
        notifications: true,
        profile: true,
        settings: true,
      },
    };

    setUsersList([newUser, ...usersList]);
    toast.success(`User ${newUser.firstName} ${newUser.lastName} created successfully!`);

    // Record audit log
    setAuditLogs([
      {
        id: Date.now().toString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actor: `${currentUser.firstName} ${currentUser.lastName}`,
        role: currentUser.role,
        action: `Created user ${newUser.firstName} ${newUser.lastName} (${newUser.email})`,
        module: 'User Management',
        status: 'SUCCESS',
      },
      ...auditLogs,
    ]);

    // Trigger Welcome Email preview
    setWelcomeUser({
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      tempPassword: 'Temp@1234',
    });
    setWelcomeEmailOpen(true);
  };

  const handleUpdateStatus = (user: MockUser, newStatus: UserStatus) => {
    setUsersList(usersList.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u)));
    toast.success(`User ${user.firstName}'s account status set to ${newStatus}`);

    setAuditLogs([
      {
        id: Date.now().toString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actor: `${currentUser.firstName} ${currentUser.lastName}`,
        role: currentUser.role,
        action: `Changed status for ${user.firstName} ${user.lastName} to ${newStatus}`,
        module: 'User Status',
        status: newStatus === 'Locked' ? 'WARNING' : 'SUCCESS',
      },
      ...auditLogs,
    ]);
  };

  const handleResetPassword = (user: MockUser) => {
    toast.success(`Reset password token generated and emailed to ${user.email}`);

    setAuditLogs([
      {
        id: Date.now().toString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actor: `${currentUser.firstName} ${currentUser.lastName}`,
        role: currentUser.role,
        action: `Reset password for ${user.firstName} ${user.lastName}`,
        module: 'User Management',
        status: 'SUCCESS',
      },
      ...auditLogs,
    ]);

    setWelcomeUser({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      tempPassword: 'Temp@1234',
    });
    setWelcomeEmailOpen(true);
  };

  const handleSaveScreenAccess = (userId: string, updatedScreens: Record<ScreenKey, boolean>) => {
    setUsersList(
      usersList.map((u) => (u.id === userId ? { ...u, screens: updatedScreens } : u))
    );
    toast.success('Screen access rights saved');

    const u = usersList.find((x) => x.id === userId);
    if (u) {
      setAuditLogs([
        {
          id: Date.now().toString(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actor: `${currentUser.firstName} ${currentUser.lastName}`,
          role: currentUser.role,
          action: `Updated screen permissions for ${u.firstName} ${u.lastName}`,
          module: 'Screen Access',
          status: 'SUCCESS',
        },
        ...auditLogs,
      ]);
    }
  };

  const handleSaveFeaturePermissions = (userId: string, updatedPermissions: Record<FeaturePermissionKey, boolean>) => {
    setUsersList(
      usersList.map((u) => (u.id === userId ? { ...u, permissions: updatedPermissions } : u))
    );
    toast.success('Feature permissions updated');
  };

  // Filtered Users List
  const filteredUsers = usersList.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.employeeId && user.employeeId.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Active' && user.status === 'Active') ||
      (statusFilter === 'Inactive' && user.status === 'Inactive') ||
      (statusFilter === 'Locked' && user.status === 'Locked') ||
      (statusFilter === 'Pending Verification' && user.status === 'Suspended');

    return matchesSearch && matchesStatus;
  });

  const getStatusChipColor = (status: UserStatus) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'default';
      case 'Suspended':
        return 'warning';
      case 'Locked':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ py: 4, minHeight: 'calc(100vh - 64px)', bgcolor: 'background.default' }}>
      <Container maxWidth="xl">
        {/* Page Header */}
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <AdminPanelSettingsIcon color="primary" sx={{ fontSize: 32 }} />
              <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.03em' }}>
                Administration 🔒
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Enterprise governance, user access management, screen security, and audit logs.
            </Typography>
          </Box>
          <Button
            variant="contained"
            disableElevation
            startIcon={<AddIcon />}
            onClick={() => setCreateUserOpen(true)}
            sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, px: 2.5, py: 1, mt: { xs: 2, sm: 0 } }}
          >
            Create User
          </Button>
        </Stack>

        {/* Administration Suite Tabs */}
        <Paper variant="outlined" sx={{ borderRadius: '14px', mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(_e, val) => setActiveTab(val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              px: 2,
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.9rem',
                minHeight: 56,
              },
            }}
          >
            <Tab icon={<PeopleIcon fontSize="small" />} iconPosition="start" label="User Management" />
            <Tab icon={<SecurityIcon fontSize="small" />} iconPosition="start" label="Role & Permissions" />
            <Tab icon={<VisibilityIcon fontSize="small" />} iconPosition="start" label="Screen Access" />
            <Tab icon={<ShieldIcon fontSize="small" />} iconPosition="start" label="Audit Logs" />
            <Tab icon={<EmailIcon fontSize="small" />} iconPosition="start" label="Email Templates" />
            <Tab icon={<TuneIcon fontSize="small" />} iconPosition="start" label="System Settings" />
          </Tabs>
        </Paper>

        {/* 1. USER MANAGEMENT TAB */}
        <CustomTabPanel value={activeTab} index={0}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: '16px' }}>
            {/* Filter and Search Bar */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', mb: 3 }}>
              <TextField
                placeholder="Search by Name, Email, Employee ID..."
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ width: { xs: '100%', sm: 340 } }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Stack direction="row" spacing={1} sx={{ overflow: 'auto' }}>
                {['All', 'Active', 'Inactive', 'Locked', 'Pending Verification'].map((f) => (
                  <Chip
                    key={f}
                    label={f}
                    onClick={() => setStatusFilter(f)}
                    color={statusFilter === f ? 'primary' : 'default'}
                    variant={statusFilter === f ? 'filled' : 'outlined'}
                    sx={{ fontWeight: 700, cursor: 'pointer' }}
                  />
                ))}
              </Stack>
            </Stack>

            {/* Users Table */}
            <TableContainer>
              <Table sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Name & EMP ID</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Team</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Last Login</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Screen Access</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      hover
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>
                        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                          <Avatar src={user.avatarUrl} sx={{ width: 36, height: 36, fontWeight: 700 }}>
                            {user.firstName[0]}
                          </Avatar>
                          <Box>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 700, cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                              onClick={() => {
                                setSelectedUser(user);
                                setDrawerOpen(true);
                              }}
                            >
                              {user.firstName} {user.lastName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {user.employeeId || 'EMP-1000'}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                          {user.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={user.role} size="small" color={user.role === 'Super Admin' ? 'primary' : 'default'} sx={{ fontWeight: 700, fontSize: '0.7rem' }} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                          {user.team}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.status}
                          size="small"
                          color={getStatusChipColor(user.status)}
                          sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {user.lastLogin || 'Today'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.role === 'Super Admin' ? 'Full Access' : user.screens?.reports === false ? 'Limited' : 'Custom'}
                          size="small"
                          variant="outlined"
                          color={user.screens?.reports === false ? 'warning' : 'success'}
                          sx={{ fontWeight: 700, fontSize: '0.68rem' }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                          <Tooltip title="View User Details">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedUser(user);
                                setDrawerOpen(true);
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Configure Screen Access">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => {
                                setSelectedUser(user);
                                setScreenAccessOpen(true);
                              }}
                            >
                              <TuneIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <IconButton size="small" onClick={(e) => handleMenuOpen(e, user)}>
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {filteredUsers.length === 0 && (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <Typography variant="subtitle1" color="text.secondary">
                  No users found matching filters.
                </Typography>
              </Box>
            )}
          </Paper>
        </CustomTabPanel>

        {/* 2. ROLE & PERMISSIONS TAB */}
        <CustomTabPanel value={activeTab} index={1}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: '16px' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              Workspace Default Role Matrix
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Default functional access levels configured across organizational roles.
            </Typography>

            <Grid container spacing={2}>
              {[
                { role: 'Super Admin', desc: 'Unrestricted full administrative rights across system & settings', usersCount: 1 },
                { role: 'Admin', desc: 'Can manage workspace, projects, teams, and users', usersCount: 2 },
                { role: 'Project Manager', desc: 'Can manage projects, sprints, members, and view reports', usersCount: 3 },
                { role: 'Team Lead', desc: 'Can assign issues, edit team tickets, and direct workflows', usersCount: 4 },
                { role: 'Member', desc: 'Standard team contributor with issue creation & comment rights', usersCount: 15 },
                { role: 'Viewer', desc: 'Read-only access to projects and dashboard reports', usersCount: 3 },
              ].map((r) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={r.role}>
                  <Card variant="outlined" sx={{ borderRadius: '12px' }}>
                    <CardContent>
                      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                          {r.role}
                        </Typography>
                        <Chip label={`${r.usersCount} Users`} size="small" color="primary" variant="outlined" sx={{ fontWeight: 700 }} />
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.825rem' }}>
                        {r.desc}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </CustomTabPanel>

        {/* 3. SCREEN ACCESS TAB */}
        <CustomTabPanel value={activeTab} index={2}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: '16px' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              Granular Screen Access Matrix
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Select any user in the list above to toggle individual screen routes or customize permission models.
            </Typography>

            <Alert severity="info" sx={{ borderRadius: '12px', mb: 3 }}>
              When a screen is disabled for a user, its entry is hidden from their sidebar and direct URL access returns <strong>403 Forbidden</strong>.
            </Alert>

            <Grid container spacing={2}>
              {usersList.slice(0, 6).map((u) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={u.id}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: '12px' }}>
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1.5 }}>
                      <Avatar src={u.avatarUrl} sx={{ width: 32, height: 32 }}>{u.firstName[0]}</Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {u.firstName} {u.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">{u.role}</Typography>
                      </Box>
                    </Stack>
                    <Divider sx={{ my: 1 }} />
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      startIcon={<TuneIcon />}
                      onClick={() => {
                        setSelectedUser(u);
                        setScreenAccessOpen(true);
                      }}
                      sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700 }}
                    >
                      Configure Screens
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </CustomTabPanel>

        {/* 4. AUDIT LOGS TAB */}
        <CustomTabPanel value={activeTab} index={3}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: '16px' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              System Audit Trail
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Log of administrative actions, access modifications, and user state transitions.
            </Typography>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Timestamp</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Administrator</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Action Performed</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Module</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell sx={{ fontSize: '0.85rem', fontWeight: 600 }}>{log.time}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{log.actor}</Typography>
                        <Typography variant="caption" color="text.secondary">{log.role}</Typography>
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.85rem' }}>{log.action}</TableCell>
                      <TableCell><Chip label={log.module} size="small" variant="outlined" sx={{ fontWeight: 600 }} /></TableCell>
                      <TableCell>
                        <Chip label={log.status} size="small" color={log.status === 'SUCCESS' ? 'success' : 'warning'} sx={{ fontWeight: 700 }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </CustomTabPanel>

        {/* 5. EMAIL TEMPLATES TAB */}
        <CustomTabPanel value={activeTab} index={4}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: '16px' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              System Email Templates
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Preview automated welcome and security notification templates.
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Card variant="outlined" sx={{ borderRadius: '12px', p: 1 }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
                      1. New User Onboarding Welcome Email
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Sent when a Super Admin provisions a new account directly. Includes temporary login credentials.
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EmailIcon />}
                      onClick={() => {
                        setWelcomeUser({
                          firstName: 'David',
                          lastName: 'Kim',
                          email: 'david.kim@abctech.io',
                          tempPassword: 'Temp@1234',
                        });
                        setWelcomeEmailOpen(true);
                      }}
                      sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700 }}
                    >
                      Preview Email Template
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Card variant="outlined" sx={{ borderRadius: '12px', p: 1 }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
                      2. Password Reset Notification
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Sent when an admin triggers password reset. Contains new temporary password and login link.
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EmailIcon />}
                      onClick={() => {
                        setWelcomeUser({
                          firstName: 'Marcus',
                          lastName: 'Vance',
                          email: 'marcus.vance@abctech.io',
                          tempPassword: 'Temp@1234',
                        });
                        setWelcomeEmailOpen(true);
                      }}
                      sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700 }}
                    >
                      Preview Email Template
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </CustomTabPanel>

        {/* 6. SYSTEM SETTINGS TAB */}
        <CustomTabPanel value={activeTab} index={5}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: '16px' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              System Governance Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Global authentication and security policy enforcement.
            </Typography>

            <Stack spacing={2} sx={{ maxWidth: 'md' }}>
              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Force Password Change on Admin Reset
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Require users with temporary passwords to reset password upon initial login.
                  </Typography>
                </Box>
                <Switch defaultChecked color="primary" />
              </Stack>
              <Divider />
              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Enable Strict Screen Access Route Guarding
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Return HTTP 403 Forbidden when a user navigates to an unchecked screen route.
                  </Typography>
                </Box>
                <Switch defaultChecked color="primary" />
              </Stack>
            </Stack>
          </Paper>
        </CustomTabPanel>
      </Container>

      {/* Target User Actions Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        slotProps={{
          paper: { sx: { borderRadius: '12px', minWidth: 200 } },
        }}
      >
        <MenuItem
          onClick={() => {
            if (targetUser) {
              setSelectedUser(targetUser);
              setDrawerOpen(true);
            }
            handleMenuClose();
          }}
        >
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} /> View Details Drawer
        </MenuItem>

        <MenuItem
          onClick={() => {
            if (targetUser) {
              setSelectedUser(targetUser);
              setScreenAccessOpen(true);
            }
            handleMenuClose();
          }}
        >
          <TuneIcon fontSize="small" sx={{ mr: 1 }} /> Edit Screen Access
        </MenuItem>

        <MenuItem
          onClick={() => {
            if (targetUser) {
              setSelectedUser(targetUser);
              setFeaturePermissionsOpen(true);
            }
            handleMenuClose();
          }}
        >
          <SecurityIcon fontSize="small" sx={{ mr: 1 }} /> Edit Feature Permissions
        </MenuItem>

        <MenuItem
          onClick={() => {
            if (targetUser) {
              handleResetPassword(targetUser);
            }
            handleMenuClose();
          }}
        >
          <LockResetIcon fontSize="small" sx={{ mr: 1 }} /> Reset Password
        </MenuItem>

        <Divider />

        {targetUser?.status === 'Active' ? (
          <MenuItem
            onClick={() => {
              if (targetUser) handleUpdateStatus(targetUser, 'Inactive');
              handleMenuClose();
            }}
            sx={{ color: 'warning.main' }}
          >
            <BlockIcon fontSize="small" sx={{ mr: 1 }} /> Deactivate Account
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              if (targetUser) handleUpdateStatus(targetUser, 'Active');
              handleMenuClose();
            }}
            sx={{ color: 'success.main' }}
          >
            <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} /> Activate Account
          </MenuItem>
        )}

        <MenuItem
          onClick={() => {
            if (targetUser) handleUpdateStatus(targetUser, 'Locked');
            handleMenuClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <LockIcon fontSize="small" sx={{ mr: 1 }} /> Lock Account
        </MenuItem>
      </Menu>

      {/* User Details Drawer */}
      <UserDetailDrawer
        user={selectedUser}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onEditScreenAccess={(u) => {
          setSelectedUser(u);
          setScreenAccessOpen(true);
        }}
        onResetPassword={(u) => handleResetPassword(u)}
      />

      {/* Create User Modal */}
      <CreateUserModal
        open={createUserOpen}
        onClose={() => setCreateUserOpen(false)}
        onCreate={handleCreateUser}
      />

      {/* Screen Access Modal */}
      <ScreenAccessModal
        user={selectedUser}
        open={screenAccessOpen}
        onClose={() => setScreenAccessOpen(false)}
        onSave={handleSaveScreenAccess}
      />

      {/* Feature Permissions Modal */}
      <FeaturePermissionsModal
        user={selectedUser}
        open={featurePermissionsOpen}
        onClose={() => setFeaturePermissionsOpen(false)}
        onSave={handleSaveFeaturePermissions}
      />

      {/* Welcome Email Modal */}
      <WelcomeEmailModal
        user={welcomeUser}
        open={welcomeEmailOpen}
        onClose={() => setWelcomeEmailOpen(false)}
      />
    </Box>
  );
};
