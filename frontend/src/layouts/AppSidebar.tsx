import React, { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Stack,
  Avatar,
  IconButton,
  Tooltip,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Chip,
  Badge,
  Divider,
} from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import ViewKanbanOutlinedIcon from '@mui/icons-material/ViewKanbanOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';

import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { APP_NAME, ROUTES } from '@/constants';
import { mockNotifications } from '@/mock/notifications';
import { mockUsers, type MockUser } from '@/mock/users';
import { getNavigationForUser } from '@/features/auth/permissions';
import { USE_MOCK_DATA } from '@/mock/config';
import toast from 'react-hot-toast';

interface AppSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onMobileClose?: () => void;
}

export function AppSidebar({ collapsed, onToggleCollapse, onMobileClose }: AppSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const mode = useThemeStore((s) => s.mode);
  const toggleMode = useThemeStore((s) => s.toggleMode);

  const currentUser = useAuthStore((s) => s.user) || mockUsers[0];
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const unreadCount = mockNotifications.filter((n) => !n.isRead).length;
  const userNavDefs = getNavigationForUser(currentUser as any);

  const [personaAnchorEl, setPersonaAnchorEl] = useState<null | HTMLElement>(null);

  const isDark = mode === 'dark';

  const sidebarBg = isDark ? '#1e293b' : '#ffffff';
  const sidebarBorder = isDark ? '#334155' : '#e2e8f0';
  const textPrimary = isDark ? '#f1f5f9' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const activeColor = isDark ? '#60a5fa' : '#2563eb';
  const activeBg = isDark ? 'rgba(96, 165, 250, 0.12)' : 'rgba(37, 99, 235, 0.08)';
  const hoverBg = isDark ? 'rgba(148, 163, 184, 0.08)' : 'rgba(15, 23, 42, 0.04)';

  const handleSwitchPersona = (selectedUser: MockUser) => {
    if (selectedUser.status === 'Locked' || selectedUser.status === 'Inactive' || selectedUser.status === 'Suspended') {
      toast.error(`Account status is ${selectedUser.status}. Cannot switch.`);
      setPersonaAnchorEl(null);
      return;
    }

    setAuth(
      {
        id: selectedUser.id,
        email: selectedUser.email,
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        employeeId: selectedUser.employeeId,
        role: selectedUser.role,
        department: selectedUser.department,
        avatarUrl: selectedUser.avatarUrl,
        screens: selectedUser.screens as any,
        permissions: selectedUser.permissions as any,
        status: selectedUser.status,
      },
      'mock-access-token-jwt',
      'mock-refresh-token-jwt'
    );
    toast.success(`Switched to ${selectedUser.firstName} (${selectedUser.role})`);
    setPersonaAnchorEl(null);
    navigate(ROUTES.DASHBOARD);
  };

  const handleLogout = () => {
    clearAuth();
    toast.success('Signed out');
    navigate(ROUTES.HOME);
  };

  const iconMap: Record<string, React.ReactNode> = {
    Dashboard: <DashboardOutlinedIcon fontSize="small" />,
    Projects: <FolderOutlinedIcon fontSize="small" />,
    Board: <ViewKanbanOutlinedIcon fontSize="small" />,
    Issues: <AssignmentOutlinedIcon fontSize="small" />,
    Teams: <GroupsOutlinedIcon fontSize="small" />,
    Users: <PeopleOutlinedIcon fontSize="small" />,
    Reports: <BarChartOutlinedIcon fontSize="small" />,
    AuditLogs: <ShieldOutlinedIcon fontSize="small" />,
    Administration: <AdminPanelSettingsOutlinedIcon fontSize="small" />,
    Notifications: <NotificationsOutlinedIcon fontSize="small" />,
    Settings: <SettingsOutlinedIcon fontSize="small" />,
  };

  const demoPersonas = mockUsers
    .filter((u) => u.status === 'Active')
    .map((u) => ({
      label: `${u.firstName} ${u.lastName} (${u.role})`,
      user: u,
    }));

  return (
    <Box
      sx={{
        width: collapsed ? 64 : 240,
        height: '100%',
        position: 'relative',
        background: sidebarBg,
        color: textPrimary,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s ease',
        flexShrink: 0,
        borderRight: `1px solid ${sidebarBorder}`,
        zIndex: 1200,
        overflowX: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* 1. Brand Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          minHeight: 60,
          borderBottom: `1px solid ${sidebarBorder}`,
        }}
      >
        <Stack
          direction="row"
          spacing={1.5}
          sx={{ alignItems: 'center', cursor: 'pointer', flex: collapsed ? 'none' : 1 }}
          onClick={() => navigate(ROUTES.DASHBOARD)}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              background: activeColor,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ConfirmationNumberOutlinedIcon sx={{ fontSize: 18, color: '#ffffff' }} />
          </Box>

          {!collapsed && (
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  lineHeight: 1.2,
                  color: textPrimary,
                  fontSize: '0.9rem',
                }}
              >
                {APP_NAME}
              </Typography>
              <Typography variant="caption" sx={{ color: textMuted, fontSize: '0.7rem' }}>
                Enterprise Portal
              </Typography>
            </Box>
          )}
        </Stack>

        {!collapsed && (
          <Tooltip title="Collapse sidebar">
            <IconButton
              size="small"
              onClick={onToggleCollapse}
              sx={{
                color: textMuted,
                '&:hover': {
                  color: textPrimary,
                  bgcolor: hoverBg,
                },
              }}
            >
              <ChevronLeftIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* 2. Navigation */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          py: 1.5,
          px: collapsed ? 0.75 : 1.25,
          '&::-webkit-scrollbar': { width: '3px' },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': { background: sidebarBorder, borderRadius: '4px' },
        }}
      >
        <List component="nav" disablePadding sx={{ gap: 0.25, display: 'flex', flexDirection: 'column' }}>
          {userNavDefs.map((item) => {
            const isActive = location.pathname === item.route;
            const icon = iconMap[item.iconName] || <DashboardOutlinedIcon fontSize="small" />;

            return (
              <Tooltip key={item.route} title={collapsed ? item.label : ''} placement="right">
                <ListItemButton
                  component={RouterLink}
                  to={item.route}
                  onClick={onMobileClose}
                  sx={{
                    borderRadius: '8px',
                    minHeight: 40,
                    px: collapsed ? 1.25 : 1.5,
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    bgcolor: isActive ? activeBg : 'transparent',
                    color: isActive ? activeColor : textMuted,
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      bgcolor: isActive ? activeBg : hoverBg,
                      color: isActive ? activeColor : textPrimary,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: collapsed ? 0 : 32,
                      color: 'inherit',
                      justifyContent: 'center',
                    }}
                  >
                    {item.screenKey === 'notifications' && unreadCount > 0 ? (
                      <Badge badgeContent={unreadCount} color="error">
                        {icon}
                      </Badge>
                    ) : (
                      icon
                    )}
                  </ListItemIcon>

                  {!collapsed && (
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: '0.875rem',
                            fontWeight: isActive ? 600 : 500,
                            color: 'inherit',
                          }}
                        >
                          {item.label}
                        </Typography>
                      }
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            );
          })}
        </List>
      </Box>

      {/* 3. Footer */}
      <Box
        sx={{
          borderTop: `1px solid ${sidebarBorder}`,
        }}
      >
        {!collapsed ? (
          <Stack spacing={0} sx={{ p: 1.25 }}>
            {/* User Profile Row */}
            <Box
              onClick={(e) => setPersonaAnchorEl(e.currentTarget)}
              sx={{
                p: 1,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
                transition: 'background 0.15s',
                '&:hover': { bgcolor: hoverBg },
              }}
            >
              <Avatar
                src={currentUser.avatarUrl}
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: activeColor,
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {currentUser?.firstName?.[0] || 'U'}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: textPrimary,
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    fontSize: '0.8rem',
                  }}
                >
                  {currentUser.firstName} {currentUser.lastName}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: textMuted,
                    display: 'block',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    fontSize: '0.7rem',
                  }}
                >
                  {currentUser.role}
                </Typography>
              </Box>
              <SwapHorizOutlinedIcon fontSize="small" sx={{ color: textMuted, flexShrink: 0, fontSize: '1rem' }} />
            </Box>

            {/* Quick Actions */}
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', px: 0.5, pt: 0.5 }}>
              <Tooltip title={mode === 'light' ? 'Dark Mode' : 'Light Mode'}>
                <IconButton
                  size="small"
                  onClick={toggleMode}
                  sx={{ color: textMuted, '&:hover': { color: textPrimary, bgcolor: hoverBg } }}
                >
                  {mode === 'light' ? <DarkModeOutlinedIcon fontSize="small" /> : <LightModeOutlinedIcon fontSize="small" />}
                </IconButton>
              </Tooltip>

              <Typography variant="caption" sx={{ color: textMuted, fontSize: '0.65rem' }}>
                v2.4
              </Typography>

              <Tooltip title="Sign Out">
                <IconButton
                  size="small"
                  onClick={handleLogout}
                  sx={{ color: textMuted, '&:hover': { color: '#ef4444', bgcolor: 'rgba(239, 68, 68, 0.08)' } }}
                >
                  <LogoutOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        ) : (
          <Stack spacing={1} sx={{ alignItems: 'center', p: 1 }}>
            <Tooltip title="Expand Sidebar" placement="right">
              <IconButton
                size="small"
                onClick={onToggleCollapse}
                sx={{ color: textMuted, '&:hover': { color: textPrimary, bgcolor: hoverBg } }}
              >
                <ChevronRightIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={`${currentUser.firstName} ${currentUser.lastName}`} placement="right">
              <IconButton size="small" onClick={(e) => setPersonaAnchorEl(e.currentTarget)}>
                <Avatar
                  src={currentUser.avatarUrl}
                  sx={{
                    width: 28,
                    height: 28,
                    fontSize: '0.72rem',
                    bgcolor: activeColor,
                  }}
                >
                  {currentUser?.firstName?.[0] || 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      </Box>

      {/* Persona Switcher Menu */}
      <Menu
        anchorEl={personaAnchorEl}
        open={Boolean(personaAnchorEl)}
        onClose={() => setPersonaAnchorEl(null)}
        slotProps={{
          paper: {
            sx: {
              borderRadius: '10px',
              mt: -1,
              ml: 1,
              minWidth: 256,
              boxShadow: isDark
                ? '0 8px 24px rgba(0,0,0,0.5)'
                : '0 8px 24px rgba(15,23,42,0.12)',
              border: `1px solid ${sidebarBorder}`,
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {currentUser.firstName} {currentUser.lastName}
          </Typography>
          <Typography variant="caption" sx={{ color: textMuted, display: 'block' }}>
            {currentUser.email}
          </Typography>
          <Chip
            label={currentUser.role}
            size="small"
            sx={{
              mt: 0.75,
              height: 20,
              fontSize: '0.65rem',
              fontWeight: 600,
              bgcolor: activeBg,
              color: activeColor,
              border: `1px solid ${activeColor}22`,
            }}
          />
        </Box>

        {USE_MOCK_DATA && (
          <>
            <Divider />
            <Box sx={{ px: 2, py: 1 }}>
              <Typography
                variant="caption"
                sx={{ color: textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}
              >
                Switch Demo Persona
              </Typography>
              {demoPersonas.map((p) => (
                <MenuItem
                  key={p.user.id}
                  onClick={() => handleSwitchPersona(p.user)}
                  selected={currentUser.id === p.user.id}
                  sx={{
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    py: 0.75,
                    my: 0.25,
                    '&.Mui-selected': { bgcolor: activeBg, color: activeColor },
                  }}
                >
                  {p.label}
                </MenuItem>
              ))}
            </Box>
          </>
        )}

        <Divider />
        <MenuItem
          component={RouterLink}
          to={ROUTES.PROFILE}
          onClick={() => setPersonaAnchorEl(null)}
          sx={{ fontSize: '0.875rem' }}
        >
          Profile Settings
        </MenuItem>
        <MenuItem
          onClick={handleLogout}
          sx={{ color: '#ef4444', fontSize: '0.875rem' }}
        >
          Sign Out
        </MenuItem>
      </Menu>
    </Box>
  );
}
