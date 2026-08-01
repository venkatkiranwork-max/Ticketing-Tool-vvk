import React, { useState, useMemo } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Badge,
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
import EditIcon from '@mui/icons-material/Edit';
import FilterListIcon from '@mui/icons-material/FilterList';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import {
  mockUsers,
  saveUsersToStorage,
  type MockUser,
  type UserStatus,
  type ScreenKey,
  type FeaturePermissionKey,
  type WorkspaceRole,
  DEFAULT_MEMBER_SCREENS,
  DEFAULT_FEATURE_PERMISSIONS,
} from '@/mock/users';
import { Forbidden403Page } from '@/pages/Forbidden403Page';
import { UserDetailDrawer } from '@/components/admin/UserDetailDrawer';
import { CreateUserModal } from '@/components/admin/CreateUserModal';
import { ScreenAccessModal } from '@/components/admin/ScreenAccessModal';
import { FeaturePermissionsModal } from '@/components/admin/FeaturePermissionsModal';
import { WelcomeEmailModal } from '@/components/admin/WelcomeEmailModal';
import { mockAuditLogs, saveAuditLogsToStorage, type MockAuditLog } from '@/mock/auditLogs';
import { queryKeys } from '@/lib/queryKeys';

// ─── Tab Panel Wrapper ───────────────────────────────────────────────────────
function TabPanel({ children, value, index }: { children?: React.ReactNode; index: number; value: number }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// ─── Role colors ────────────────────────────────────────────────────────────
const ROLE_COLOR: Record<string, string> = {
  'Super Admin': '#6366f1',
  'Project Manager': '#10b981',
  'Team Lead': '#f59e0b',
  Member: '#64748b',
  Viewer: '#94a3b8',
  Guest: '#cbd5e1',
};

const STATUS_COLOR: Record<string, 'success' | 'default' | 'warning' | 'error'> = {
  Active: 'success',
  Inactive: 'default',
  Suspended: 'warning',
  Locked: 'error',
};

const ROLES: WorkspaceRole[] = ['Super Admin', 'Project Manager', 'Team Lead', 'Member', 'Viewer', 'Guest'];
const TEAMS = ['IT', 'UI/UX', 'Testing', 'Engineering', 'Product Management', 'DevOps & SRE', 'Frontend', 'Backend', 'QA Automation'];

// ─── Main Component ─────────────────────────────────────────────────────────
export const AdministrationPage: React.FC = () => {
  const currentUser = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  // ── All state at top level (hooks must not be conditional) ──
  const [activeTab, setActiveTab] = useState(0);
  // Initialize from live mockUsers so newly created users from UsersPage are visible
  const [usersList, setUsersList] = useState<MockUser[]>(() => [...mockUsers]);

  // User Management filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');

  // Audit Log filters
  const [auditSearch, setAuditSearch] = useState('');
  const [auditModuleFilter, setAuditModuleFilter] = useState('All');

  // Screen Access tab search
  const [screenSearch, setScreenSearch] = useState('');

  // Modals
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [screenAccessOpen, setScreenAccessOpen] = useState(false);
  const [featurePermissionsOpen, setFeaturePermissionsOpen] = useState(false);
  const [welcomeEmailOpen, setWelcomeEmailOpen] = useState(false);
  const [welcomeUser, setWelcomeUser] = useState<{ firstName: string; lastName: string; email: string; tempPassword?: string } | null>(null);

  // Edit User dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState<MockUser | null>(null);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState<WorkspaceRole>('Member');
  const [editTeam, setEditTeam] = useState('IT');
  const [editStatus, setEditStatus] = useState<UserStatus>('Active');
  const [editPhone, setEditPhone] = useState('');
  const [editLocation, setEditLocation] = useState('');

  // Action menu
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [targetUser, setTargetUser] = useState<MockUser | null>(null);

  // System Settings
  const [forcePasswordChange, setForcePasswordChange] = useState(true);
  const [strictRouteGuard, setStrictRouteGuard] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [emailNotify, setEmailNotify] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<MockAuditLog[]>(() => [...mockAuditLogs]);

  // ── Permission check (AFTER all hooks) ──────────────────────────────────
  const isSuperAdmin = currentUser?.role === 'Super Admin' || currentUser?.role === 'super_admin';
  if (!isSuperAdmin) return <Forbidden403Page />;

  // ─── Filtered data ────────────────────────────────────────────────────────
  const filteredUsers = useMemo(() => {
    return usersList.filter((u) => {
      const matchSearch =
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.employeeId || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Active' && u.status === 'Active') ||
        (statusFilter === 'Inactive' && u.status === 'Inactive') ||
        (statusFilter === 'Locked' && u.status === 'Locked') ||
        (statusFilter === 'Pending Verification' && u.status === 'Suspended');
      const matchRole = roleFilter === 'All' || u.role === roleFilter;
      return matchSearch && matchStatus && matchRole;
    });
  }, [usersList, searchQuery, statusFilter, roleFilter]);

  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchSearch =
        (log.userName || (log as any).actor || '').toLowerCase().includes(auditSearch.toLowerCase()) ||
        log.action.toLowerCase().includes(auditSearch.toLowerCase());
      const matchModule = auditModuleFilter === 'All' || log.module === auditModuleFilter;
      return matchSearch && matchModule;
    });
  }, [auditLogs, auditSearch, auditModuleFilter]);

  const filteredScreenUsers = useMemo(() => {
    if (!screenSearch.trim()) return usersList;
    return usersList.filter((u) =>
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(screenSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(screenSearch.toLowerCase())
    );
  }, [usersList, screenSearch]);

  const roleCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    usersList.forEach((u) => { counts[u.role] = (counts[u.role] || 0) + 1; });
    return counts;
  }, [usersList]);

  const auditModules = useMemo(() => {
    const mods = new Set(auditLogs.map((l) => l.module));
    return ['All', ...Array.from(mods)];
  }, [auditLogs]);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const addAuditLog = (action: string, module: string, status = 'SUCCESS') => {
    const newLog: MockAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: `${currentUser?.firstName} ${currentUser?.lastName}`,
      userName: `${currentUser?.firstName} ${currentUser?.lastName}`,
      role: currentUser?.role || 'Super Admin',
      userRole: currentUser?.role || 'Super Admin',
      action,
      module,
      ipAddress: '192.168.1.100',
      status: status as any,
      details: `${action} in module ${module}`,
    };
    mockAuditLogs.unshift(newLog);
    saveAuditLogsToStorage(mockAuditLogs);
    setAuditLogs([...mockAuditLogs]);
  };

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>, user: MockUser) => {
    setMenuAnchor(e.currentTarget);
    setTargetUser(user);
  };
  const handleMenuClose = () => { setMenuAnchor(null); };

  const handleCreateUser = (data: Partial<MockUser>) => {
    const newUser: MockUser = {
      id: `usr-${Date.now()}`,
      employeeId: data.employeeId || `EMP-${1000 + usersList.length + 1}`,
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      email: data.email || '',
      role: data.role || 'Member',
      team: data.team || 'Engineering',
      status: 'Active',
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      department: data.department || data.team || 'Engineering',
      phone: data.phone || '',
      location: data.location || '',
      lastLogin: 'Never',
      createdDate: new Date().toLocaleDateString(),
      online: false,
      activeProjectsCount: 0,
      completedTasksCount: 0,
      screens: { ...DEFAULT_MEMBER_SCREENS },
      permissions: { ...DEFAULT_FEATURE_PERMISSIONS },
    };
    setUsersList((prev) => [newUser, ...prev]);
    // Also push to shared mockUsers array so login works with Temp@1234
    mockUsers.unshift(newUser);
    saveUsersToStorage(mockUsers);
    // Invalidate React Query cache so Add Members dialog shows the new user
    queryClient.setQueryData(queryKeys.users, (old: MockUser[] = []) => [newUser, ...old]);
    queryClient.invalidateQueries({ queryKey: queryKeys.users });
    toast.success(`✅ User ${newUser.firstName} ${newUser.lastName} created!`);
    addAuditLog(`Created user ${newUser.firstName} ${newUser.lastName} (${newUser.email})`, 'User Management');
    setWelcomeUser({ firstName: newUser.firstName, lastName: newUser.lastName, email: newUser.email, tempPassword: 'Temp@1234' });
    setWelcomeEmailOpen(true);
  };

  const handleUpdateStatus = (user: MockUser, newStatus: UserStatus) => {
    setUsersList((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u)));
    // Sync status to shared mockUsers and invalidate query cache
    const sharedIdx = mockUsers.findIndex((u) => u.id === user.id);
    if (sharedIdx !== -1) {
      mockUsers[sharedIdx].status = newStatus;
      saveUsersToStorage(mockUsers);
    }
    queryClient.invalidateQueries({ queryKey: queryKeys.users });
    toast.success(`${user.firstName}'s status set to ${newStatus}`);
    addAuditLog(`Changed status for ${user.firstName} ${user.lastName} to ${newStatus}`, 'User Status', newStatus === 'Locked' ? 'WARNING' : 'SUCCESS');
  };

  const handleResetPassword = (user: MockUser) => {
    toast.success(`Password reset email sent to ${user.email}`);
    addAuditLog(`Reset password for ${user.firstName} ${user.lastName}`, 'User Management');
    setWelcomeUser({ firstName: user.firstName, lastName: user.lastName, email: user.email, tempPassword: 'Temp@1234' });
    setWelcomeEmailOpen(true);
  };

  const handleSaveScreenAccess = (userId: string, updatedScreens: Record<ScreenKey, boolean>) => {
    setUsersList((prev) => prev.map((u) => (u.id === userId ? { ...u, screens: updatedScreens } : u)));
    // Sync to shared mockUsers
    const sharedIdx = mockUsers.findIndex((u) => u.id === userId);
    if (sharedIdx !== -1) {
      mockUsers[sharedIdx].screens = updatedScreens;
      saveUsersToStorage(mockUsers);
    }
    queryClient.invalidateQueries({ queryKey: queryKeys.users });
    toast.success('Screen access updated');
    const u = usersList.find((x) => x.id === userId);
    if (u) addAuditLog(`Updated screen permissions for ${u.firstName} ${u.lastName}`, 'Screen Access');
  };

  const handleSaveFeaturePermissions = (userId: string, updatedPermissions: Record<FeaturePermissionKey, boolean>) => {
    setUsersList((prev) => prev.map((u) => (u.id === userId ? { ...u, permissions: updatedPermissions } : u)));
    // Sync to shared mockUsers
    const sharedIdx = mockUsers.findIndex((u) => u.id === userId);
    if (sharedIdx !== -1) {
      mockUsers[sharedIdx].permissions = updatedPermissions;
      saveUsersToStorage(mockUsers);
    }
    queryClient.invalidateQueries({ queryKey: queryKeys.users });
    toast.success('Feature permissions updated');
    const u = usersList.find((x) => x.id === userId);
    if (u) addAuditLog(`Updated feature permissions for ${u.firstName} ${u.lastName}`, 'Screen Access');
  };

  const openEditDialog = (user: MockUser) => {
    setEditUser(user);
    setEditFirstName(user.firstName);
    setEditLastName(user.lastName);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditTeam(user.team);
    setEditStatus(user.status);
    setEditPhone(user.phone || '');
    setEditLocation(user.location || '');
    setEditDialogOpen(true);
  };

  const handleSaveEditUser = () => {
    if (!editUser) return;
    const updated = { firstName: editFirstName, lastName: editLastName, email: editEmail, role: editRole as WorkspaceRole, team: editTeam, status: editStatus, phone: editPhone, location: editLocation };
    setUsersList((prev) =>
      prev.map((u) => u.id === editUser.id ? { ...u, ...updated } : u)
    );
    // Sync to shared mockUsers array for login consistency
    const sharedIdx = mockUsers.findIndex((u) => u.id === editUser.id);
    if (sharedIdx !== -1) {
      Object.assign(mockUsers[sharedIdx], updated);
      saveUsersToStorage(mockUsers);
    }
    // Invalidate query cache so the updated user appears in Add Members dialog
    queryClient.invalidateQueries({ queryKey: queryKeys.users });
    toast.success(`${editFirstName} ${editLastName}'s profile updated`);
    addAuditLog(`Edited profile for ${editFirstName} ${editLastName}`, 'User Management');
    setEditDialogOpen(false);
  };

  const getScreenLabel = (user: MockUser) => {
    if (user.role === 'Super Admin') return { label: 'Full Access', color: 'primary' as const };
    const screens = user.screens || {};
    const keys = Object.keys(screens) as ScreenKey[];
    const allTrue = keys.every((k) => screens[k] !== false);
    if (allTrue) return { label: 'Full Access', color: 'success' as const };
    const allFalse = keys.every((k) => screens[k] === false);
    if (allFalse) return { label: 'No Access', color: 'error' as const };
    return { label: 'Custom', color: 'warning' as const };
  };

  const settingToggle = (label: string, value: boolean, onChange: (v: boolean) => void, desc: string) => (
    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', py: 1.5 }}>
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{label}</Typography>
        <Typography variant="caption" color="text.secondary">{desc}</Typography>
      </Box>
      <FormControlLabel
        control={
          <Switch
            checked={value}
            onChange={(e) => {
              onChange(e.target.checked);
              toast.success(`${label}: ${e.target.checked ? 'Enabled' : 'Disabled'}`);
              addAuditLog(`${e.target.checked ? 'Enabled' : 'Disabled'} "${label}"`, 'System Settings');
            }}
            color="primary"
          />
        }
        label={<Typography variant="caption" sx={{ fontWeight: 700, color: value ? 'primary.main' : 'text.secondary' }}>{value ? 'ON' : 'OFF'}</Typography>}
        labelPlacement="start"
      />
    </Stack>
  );

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <Box sx={{ minHeight: '100%', bgcolor: 'background.default' }}>
      <Container maxWidth="xl" disableGutters sx={{ py: 2, px: { xs: 1.5, sm: 2, md: 2.5 } }}>

        {/* Page Header */}
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between', mb: 3, gap: 2 }}>
          <Box>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <AdminPanelSettingsIcon color="primary" sx={{ fontSize: 30 }} />
              <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                Administration 🔒
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
              Enterprise governance, user access management, screen security, and audit logs.
            </Typography>
          </Box>
          <Button
            variant="contained"
            disableElevation
            startIcon={<AddIcon />}
            onClick={() => setCreateUserOpen(true)}
            sx={{ borderRadius: '10px', fontWeight: 700, px: 2.5, whiteSpace: 'nowrap' }}
          >
            + Create User
          </Button>
        </Stack>

        {/* Tabs */}
        <Paper variant="outlined" sx={{ borderRadius: '12px', mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(_e, val) => setActiveTab(val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ px: 1, '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, fontSize: '0.85rem', minHeight: 52 } }}
          >
            <Tab icon={<PeopleIcon fontSize="small" />} iconPosition="start" label="User Management" />
            <Tab icon={<SecurityIcon fontSize="small" />} iconPosition="start" label="Role & Permissions" />
            <Tab icon={<VisibilityIcon fontSize="small" />} iconPosition="start" label="Screen Access" />
            <Tab icon={<ShieldIcon fontSize="small" />} iconPosition="start" label={<Badge badgeContent={auditLogs.length} color="primary" max={99}>Audit Logs</Badge>} />
            <Tab icon={<EmailIcon fontSize="small" />} iconPosition="start" label="Email Templates" />
            <Tab icon={<TuneIcon fontSize="small" />} iconPosition="start" label="System Settings" />
          </Tabs>
        </Paper>

        {/* ═══════════════════ TAB 1: USER MANAGEMENT ═══════════════════ */}
        <TabPanel value={activeTab} index={0}>
          <Paper variant="outlined" sx={{ borderRadius: '12px', overflow: 'hidden' }}>
            {/* Filters row */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', alignItems: { md: 'center' }, flexWrap: 'wrap' }}>
              <TextField
                placeholder="Search by Name, Email, Employee ID..."
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ width: { xs: '100%', sm: 300 } }}
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" color="action" /></InputAdornment> } }}
              />
              {/* Role filter */}
              <TextField
                select
                size="small"
                label="Role"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                sx={{ minWidth: 150 }}
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><FilterListIcon fontSize="small" color="action" /></InputAdornment> } }}
              >
                <MenuItem value="All">All Roles</MenuItem>
                {ROLES.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
              </TextField>
              {/* Status filter chips */}
              <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap', gap: 0.75 }}>
                {['All', 'Active', 'Inactive', 'Locked', 'Pending Verification'].map((f) => (
                  <Chip
                    key={f}
                    label={f}
                    onClick={() => setStatusFilter(f)}
                    color={statusFilter === f ? 'primary' : 'default'}
                    variant={statusFilter === f ? 'filled' : 'outlined'}
                    size="small"
                    sx={{ fontWeight: 700, cursor: 'pointer' }}
                  />
                ))}
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto', whiteSpace: 'nowrap' }}>
                {filteredUsers.length} / {usersList.length} users
              </Typography>
            </Stack>

            {/* Table */}
            <TableContainer>
              <Table sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'background.default' }}>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name & EMP ID</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Team</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last Login</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Screen Access</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => {
                    const screenBadge = getScreenLabel(user);
                    return (
                      <TableRow key={user.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                        <TableCell>
                          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                            <Badge
                              overlap="circular"
                              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                              variant="dot"
                              sx={{ '& .MuiBadge-badge': { bgcolor: user.online ? '#10b981' : '#94a3b8', width: 9, height: 9, borderRadius: '50%', border: '1.5px solid white' } }}
                            >
                              <Avatar src={user.avatarUrl} sx={{ width: 34, height: 34, fontWeight: 700, fontSize: '0.85rem', bgcolor: ROLE_COLOR[user.role] + '22', color: ROLE_COLOR[user.role] }}>
                                {user.firstName[0]}
                              </Avatar>
                            </Badge>
                            <Box>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 700, cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                                onClick={() => { setSelectedUser(user); setDrawerOpen(true); }}
                              >
                                {user.firstName} {user.lastName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">{user.employeeId || 'EMP-1000'}</Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontSize: '0.82rem' }}>{user.email}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.role}
                            size="small"
                            sx={{ fontWeight: 700, fontSize: '0.68rem', bgcolor: ROLE_COLOR[user.role] + '18', color: ROLE_COLOR[user.role], border: `1px solid ${ROLE_COLOR[user.role]}30` }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.82rem' }}>{user.team}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={user.status} size="small" color={STATUS_COLOR[user.status] || 'default'} sx={{ fontWeight: 700, fontSize: '0.68rem' }} />
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" color="text.secondary">{user.lastLogin || 'Today'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={screenBadge.label} size="small" variant="outlined" color={screenBadge.color} sx={{ fontWeight: 700, fontSize: '0.65rem' }} />
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                            <Tooltip title="View Details">
                              <IconButton size="small" onClick={() => { setSelectedUser(user); setDrawerOpen(true); }}>
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit User">
                              <IconButton size="small" color="primary" onClick={() => openEditDialog(user)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Screen Access">
                              <IconButton size="small" onClick={() => { setSelectedUser(user); setScreenAccessOpen(true); }}>
                                <TuneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <IconButton size="small" onClick={(e) => handleMenuOpen(e, user)}>
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            {filteredUsers.length === 0 && (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <Typography color="text.secondary">No users found matching filters.</Typography>
              </Box>
            )}
          </Paper>
        </TabPanel>

        {/* ═══════════════════ TAB 2: ROLE & PERMISSIONS ═══════════════════ */}
        <TabPanel value={activeTab} index={1}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: '12px' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>Workspace Role Matrix</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Default functional access levels configured across organizational roles. User counts reflect current workspace members.
            </Typography>
            <Grid container spacing={2}>
              {[
                { role: 'Super Admin', desc: 'Unrestricted full administrative rights across system & settings', perms: ['All Screens', 'User Management', 'Audit Logs', 'System Settings', 'Delete Projects/Issues'] },
                { role: 'Project Manager', desc: 'Can manage projects, sprints, members, and view reports', perms: ['Projects', 'Issues', 'Board', 'Reports', 'Team Management'] },
                { role: 'Team Lead', desc: 'Can assign issues, edit team tickets, and direct workflows', perms: ['Issues', 'Board', 'Projects (Read)', 'Team Members'] },
                { role: 'Member', desc: 'Active team contributor with issue creation, assignment, comment & report rights', perms: ['Dashboard', 'Projects', 'Issues', 'Board', 'Teams', 'Reports', 'Notifications'] },
                { role: 'Viewer', desc: 'Read-only access to projects and dashboard reports', perms: ['Dashboard (Read)', 'Projects (Read)', 'Reports (Read)'] },
              ].map((r) => {
                const count = roleCounts[r.role] || 0;
                return (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={r.role}>
                    <Card variant="outlined" sx={{ borderRadius: '10px', height: '100%', transition: 'border-color 0.2s', '&:hover': { borderColor: ROLE_COLOR[r.role] } }}>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Chip
                            label={r.role}
                            size="small"
                            sx={{ fontWeight: 700, fontSize: '0.72rem', bgcolor: ROLE_COLOR[r.role] + '18', color: ROLE_COLOR[r.role] }}
                          />
                          <Chip label={`${count} User${count !== 1 ? 's' : ''}`} size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: '0.68rem' }} />
                        </Stack>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', mb: 1.5 }}>{r.desc}</Typography>
                        <Divider sx={{ mb: 1 }} />
                        <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary', display: 'block', mb: 0.5 }}>
                          Default Access
                        </Typography>
                        <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                          {r.perms.map((p) => (
                            <Chip key={p} label={p} size="small" sx={{ height: 18, fontSize: '0.62rem', fontWeight: 600, bgcolor: 'background.default' }} />
                          ))}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Paper>
        </TabPanel>

        {/* ═══════════════════ TAB 3: SCREEN ACCESS ═══════════════════ */}
        <TabPanel value={activeTab} index={2}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: '12px' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' }, mb: 2, gap: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.25 }}>Granular Screen Access Matrix</Typography>
                <Typography variant="body2" color="text.secondary">
                  Click "Configure" on any user to toggle individual screen routes.
                </Typography>
              </Box>
              <TextField
                placeholder="Search users..."
                size="small"
                value={screenSearch}
                onChange={(e) => setScreenSearch(e.target.value)}
                sx={{ width: 220 }}
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" color="action" /></InputAdornment> } }}
              />
            </Stack>

            <Alert severity="info" sx={{ borderRadius: '10px', mb: 3, fontSize: '0.82rem' }}>
              When a screen is disabled for a user, it is hidden from their sidebar and direct URL access returns <strong>403 Forbidden</strong>.
            </Alert>

            <Grid container spacing={2}>
              {filteredScreenUsers.map((u) => {
                const screenBadge = getScreenLabel(u);
                const enabledScreens = Object.entries(u.screens || {}).filter(([, v]) => v !== false).length;
                const totalScreens = Object.keys(DEFAULT_MEMBER_SCREENS).length;
                return (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={u.id}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: '10px', transition: 'border-color 0.2s', '&:hover': { borderColor: 'primary.main' } }}>
                      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1.5 }}>
                        <Avatar src={u.avatarUrl} sx={{ width: 32, height: 32, bgcolor: ROLE_COLOR[u.role] + '22', color: ROLE_COLOR[u.role], fontSize: '0.8rem', fontWeight: 700 }}>
                          {u.firstName[0]}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="body2" sx={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {u.firstName} {u.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">{u.role} · {u.team}</Typography>
                        </Box>
                        <Chip label={screenBadge.label} size="small" color={screenBadge.color} variant="outlined" sx={{ fontWeight: 700, fontSize: '0.62rem' }} />
                      </Stack>

                      {/* Screen progress */}
                      <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">Screen access</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>{u.role === 'Super Admin' ? totalScreens : enabledScreens}/{totalScreens}</Typography>
                      </Stack>
                      <Box sx={{ height: 4, bgcolor: 'divider', borderRadius: '99px', overflow: 'hidden', mb: 1.5 }}>
                        <Box sx={{ height: '100%', width: `${u.role === 'Super Admin' ? 100 : (enabledScreens / totalScreens) * 100}%`, bgcolor: screenBadge.color === 'error' ? 'error.main' : screenBadge.color === 'warning' ? 'warning.main' : 'primary.main', borderRadius: '99px' }} />
                      </Box>

                      <Divider sx={{ mb: 1.5 }} />
                      <Button
                        fullWidth
                        variant="outlined"
                        size="small"
                        startIcon={<TuneIcon fontSize="small" />}
                        onClick={() => { setSelectedUser(u); setScreenAccessOpen(true); }}
                        sx={{ borderRadius: '8px', fontWeight: 700, textTransform: 'none' }}
                        disabled={u.role === 'Super Admin'}
                      >
                        {u.role === 'Super Admin' ? 'Full Access (Locked)' : 'Configure Screens'}
                      </Button>
                    </Paper>
                  </Grid>
                );
              })}
              {filteredScreenUsers.length === 0 && (
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ py: 4, textAlign: 'center' }}>
                    <Typography color="text.secondary">No users found.</Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Paper>
        </TabPanel>

        {/* ═══════════════════ TAB 4: AUDIT LOGS ═══════════════════ */}
        <TabPanel value={activeTab} index={3}>
          <Paper variant="outlined" sx={{ borderRadius: '12px', overflow: 'hidden' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', alignItems: { sm: 'center' } }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mr: 'auto' }}>System Audit Trail</Typography>
              <TextField
                placeholder="Search logs..."
                size="small"
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                sx={{ width: 220 }}
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" color="action" /></InputAdornment> } }}
              />
              <TextField
                select
                size="small"
                label="Module"
                value={auditModuleFilter}
                onChange={(e) => setAuditModuleFilter(e.target.value)}
                sx={{ minWidth: 160 }}
              >
                {auditModules.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
              </TextField>
              <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                {filteredAuditLogs.length} entries
              </Typography>
            </Stack>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'background.default' }}>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Timestamp</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Administrator</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Action Performed</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Module</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAuditLogs.map((log) => (
                    <TableRow key={log.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                      <TableCell sx={{ fontSize: '0.8rem', fontWeight: 600, color: 'text.secondary', whiteSpace: 'nowrap' }}>
                        {log.timestamp ? new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (log as any).time}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.82rem' }}>{log.userName || (log as any).actor}</Typography>
                        <Typography variant="caption" color="text.secondary">{log.role || log.userRole}</Typography>
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.82rem', maxWidth: 320 }}>{log.action}</TableCell>
                      <TableCell><Chip label={log.module} size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: '0.68rem' }} /></TableCell>
                      <TableCell>
                        <Chip
                          label={log.status}
                          size="small"
                          color={log.status === 'SUCCESS' ? 'success' : log.status === 'WARNING' ? 'warning' : 'error'}
                          sx={{ fontWeight: 700, fontSize: '0.68rem' }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {filteredAuditLogs.length === 0 && (
              <Box sx={{ py: 5, textAlign: 'center' }}>
                <Typography color="text.secondary">No audit logs found.</Typography>
              </Box>
            )}
          </Paper>
        </TabPanel>

        {/* ═══════════════════ TAB 5: EMAIL TEMPLATES ═══════════════════ */}
        <TabPanel value={activeTab} index={4}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: '12px' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>System Email Templates</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Preview automated welcome and security notification templates sent to users.
            </Typography>
            <Grid container spacing={2}>
              {[
                {
                  title: '1. New User Onboarding Welcome Email',
                  desc: 'Sent when a Super Admin provisions a new account directly. Includes temporary login credentials.',
                  user: { firstName: 'David', lastName: 'Kim', email: 'david.kim@abctech.io', tempPassword: 'Temp@1234' },
                },
                {
                  title: '2. Password Reset Notification',
                  desc: 'Sent when an admin triggers password reset. Contains new temporary password and login link.',
                  user: { firstName: 'Marcus', lastName: 'Vance', email: 'marcus.vance@abctech.io', tempPassword: 'Temp@1234' },
                },
                {
                  title: '3. Account Status Change Alert',
                  desc: 'Sent when an account is activated, deactivated, or locked by an administrator.',
                  user: { firstName: 'Chloe', lastName: 'Dupont', email: 'chloe.dupont@abctech.io', tempPassword: undefined },
                },
                {
                  title: '4. Security Alert - Suspicious Login',
                  desc: 'Sent automatically when a login attempt is flagged from an unknown device or location.',
                  user: { firstName: 'Alex', lastName: 'Rivera', email: 'alex.rivera@abctech.io', tempPassword: undefined },
                },
              ].map((t) => (
                <Grid size={{ xs: 12, sm: 6 }} key={t.title}>
                  <Card variant="outlined" sx={{ borderRadius: '10px', height: '100%' }}>
                    <CardContent sx={{ p: 2.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.75 }}>{t.title}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', mb: 2 }}>{t.desc}</Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<EmailIcon />}
                        onClick={() => { setWelcomeUser(t.user); setWelcomeEmailOpen(true); }}
                        sx={{ borderRadius: '8px', fontWeight: 700, textTransform: 'none' }}
                      >
                        Preview Template
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </TabPanel>

        {/* ═══════════════════ TAB 6: SYSTEM SETTINGS ═══════════════════ */}
        <TabPanel value={activeTab} index={5}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper variant="outlined" sx={{ p: 3, borderRadius: '12px' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>Authentication & Security</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Global authentication and security policy enforcement.</Typography>
                <Divider sx={{ mb: 1 }} />
                <Stack divider={<Divider />}>
                  {settingToggle('Force Password Change on Reset', forcePasswordChange, setForcePasswordChange, 'Require users with temp passwords to reset on first login.')}
                  {settingToggle('Strict Screen Route Guarding', strictRouteGuard, setStrictRouteGuard, 'Return HTTP 403 when a user navigates to an unchecked screen route.')}
                  {settingToggle('Session Timeout (30 min)', sessionTimeout, setSessionTimeout, 'Auto-logout users after 30 minutes of inactivity.')}
                  {settingToggle('Two-Factor Authentication', twoFactorAuth, setTwoFactorAuth, 'Require OTP verification on every login for all users.')}
                </Stack>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper variant="outlined" sx={{ p: 3, borderRadius: '12px' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>Notifications & Maintenance</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>System-wide notification and operational settings.</Typography>
                <Divider sx={{ mb: 1 }} />
                <Stack divider={<Divider />}>
                  {settingToggle('Email Notifications', emailNotify, setEmailNotify, 'Send automated email notifications on key system events.')}
                  {settingToggle('Maintenance Mode', maintenanceMode, setMaintenanceMode, 'Lock out all non-admin users and show maintenance page.')}
                </Stack>
                {maintenanceMode && (
                  <Alert severity="warning" sx={{ mt: 2, borderRadius: '8px', fontSize: '0.8rem' }}>
                    <strong>Maintenance Mode is ON.</strong> All non-admin users are currently locked out.
                  </Alert>
                )}
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

      </Container>

      {/* ═══ ACTION MENU ═══ */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        slotProps={{ paper: { sx: { borderRadius: '10px', minWidth: 210, boxShadow: '0 8px 24px rgba(15,23,42,0.12)' } } }}
      >
        <MenuItem onClick={() => { if (targetUser) { setSelectedUser(targetUser); setDrawerOpen(true); } handleMenuClose(); }}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} /> View Details
        </MenuItem>
        <MenuItem onClick={() => { if (targetUser) openEditDialog(targetUser); handleMenuClose(); }}>
          <EditIcon fontSize="small" sx={{ mr: 1.5, color: 'primary.main' }} /> Edit User
        </MenuItem>
        <MenuItem onClick={() => { if (targetUser) { setSelectedUser(targetUser); setScreenAccessOpen(true); } handleMenuClose(); }}>
          <TuneIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} /> Configure Screen Access
        </MenuItem>
        <MenuItem onClick={() => { if (targetUser) { setSelectedUser(targetUser); setFeaturePermissionsOpen(true); } handleMenuClose(); }}>
          <SecurityIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} /> Feature Permissions
        </MenuItem>
        <MenuItem onClick={() => { if (targetUser) handleResetPassword(targetUser); handleMenuClose(); }}>
          <LockResetIcon fontSize="small" sx={{ mr: 1.5, color: 'warning.main' }} /> Reset Password
        </MenuItem>
        <Divider />
        {targetUser?.status !== 'Active' ? (
          <MenuItem onClick={() => { if (targetUser) handleUpdateStatus(targetUser, 'Active'); handleMenuClose(); }} sx={{ color: 'success.main' }}>
            <CheckCircleIcon fontSize="small" sx={{ mr: 1.5 }} /> Activate Account
          </MenuItem>
        ) : (
          <MenuItem onClick={() => { if (targetUser) handleUpdateStatus(targetUser, 'Inactive'); handleMenuClose(); }} sx={{ color: 'warning.main' }}>
            <BlockIcon fontSize="small" sx={{ mr: 1.5 }} /> Deactivate Account
          </MenuItem>
        )}
        <MenuItem onClick={() => { if (targetUser) handleUpdateStatus(targetUser, 'Locked'); handleMenuClose(); }} sx={{ color: 'error.main' }}>
          <LockIcon fontSize="small" sx={{ mr: 1.5 }} /> Lock Account
        </MenuItem>
      </Menu>

      {/* ═══ EDIT USER DIALOG ═══ */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: '14px' } } }}>
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <EditIcon color="primary" />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Edit User</Typography>
                <Typography variant="caption" color="text.secondary">Update profile and access details</Typography>
              </Box>
            </Stack>
            <IconButton size="small" onClick={() => setEditDialogOpen(false)}><CloseIcon /></IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers sx={{ py: 2.5 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="First Name" value={editFirstName} onChange={(e) => setEditFirstName(e.target.value)} fullWidth size="small" required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Last Name" value={editLastName} onChange={(e) => setEditLastName(e.target.value)} fullWidth size="small" required />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField label="Email Address" type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} fullWidth size="small" required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField select label="Role" value={editRole} onChange={(e) => setEditRole(e.target.value as WorkspaceRole)} fullWidth size="small">
                {ROLES.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField select label="Team" value={editTeam} onChange={(e) => setEditTeam(e.target.value)} fullWidth size="small">
                {TEAMS.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField select label="Status" value={editStatus} onChange={(e) => setEditStatus(e.target.value as UserStatus)} fullWidth size="small">
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
                <MenuItem value="Locked">Locked</MenuItem>
                <MenuItem value="Suspended">Suspended</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Phone" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} fullWidth size="small" />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField label="Location" value={editLocation} onChange={(e) => setEditLocation(e.target.value)} fullWidth size="small" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setEditDialogOpen(false)} sx={{ borderRadius: '8px', fontWeight: 600 }}>Cancel</Button>
          <Button variant="contained" disableElevation startIcon={<SaveIcon />} onClick={handleSaveEditUser} sx={{ borderRadius: '8px', fontWeight: 700 }}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* ═══ CHILD MODALS & DRAWERS ═══ */}
      <UserDetailDrawer
        user={selectedUser}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onEditScreenAccess={(u) => { setSelectedUser(u); setScreenAccessOpen(true); }}
        onResetPassword={(u) => handleResetPassword(u)}
      />

      <CreateUserModal open={createUserOpen} onClose={() => setCreateUserOpen(false)} onCreate={handleCreateUser} />

      <ScreenAccessModal
        user={selectedUser}
        open={screenAccessOpen}
        onClose={() => setScreenAccessOpen(false)}
        onSave={handleSaveScreenAccess}
      />

      <FeaturePermissionsModal
        user={selectedUser}
        open={featurePermissionsOpen}
        onClose={() => setFeaturePermissionsOpen(false)}
        onSave={handleSaveFeaturePermissions}
      />

      <WelcomeEmailModal user={welcomeUser} open={welcomeEmailOpen} onClose={() => setWelcomeEmailOpen(false)} />
    </Box>
  );
};
