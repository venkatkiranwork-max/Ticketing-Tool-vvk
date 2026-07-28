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

  const demoPersonas = [
    { label: 'Suresh Kumar (Super Admin)', user: mockUsers[0] },
    { label: 'Ravi Sharma (Admin)', user: mockUsers[1] },
    { label: 'Mani Verma (Project Manager)', user: mockUsers[2] },
  ];

  return (
    <Box
      sx={{
        width: collapsed ? 72 : 260,
        height: '100vh',
        position: 'relative',
        background: 'linear-gradient(180deg, #0f0b2a 0%, #0d1225 50%, #080d1e 100%)',
        color: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        borderRight: '1px solid rgba(139, 92, 246, 0.15)',
        boxShadow: '4px 0 32px rgba(0, 0, 0, 0.4)',
        zIndex: 1200,
        overflowX: 'hidden',
        userSelect: 'none',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(ellipse at 50% 0%, rgba(124, 58, 237, 0.12) 0%, transparent 60%)',
          pointerEvents: 'none',
        },
      }}
    >
      {/* 1. Brand Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          minHeight: 64,
          borderBottom: '1px solid rgba(139, 92, 246, 0.12)',
          position: 'relative',
          zIndex: 1,
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
              width: 36,
              height: 36,
              background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(124, 58, 237, 0.5)',
              flexShrink: 0,
            }}
          >
            <ConfirmationNumberOutlinedIcon sx={{ fontSize: 20, color: '#ffffff' }} />
          </Box>

          {!collapsed && (
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 800,
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  background: 'linear-gradient(135deg, #ffffff 0%, #c4b5fd 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {APP_NAME}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(167, 139, 250, 0.8)', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.04em' }}>
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
                color: 'rgba(148, 163, 184, 0.7)',
                '&:hover': {
                  color: '#ffffff',
                  bgcolor: 'rgba(139, 92, 246, 0.15)',
                },
              }}
            >
              <ChevronLeftIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* 2. Navigation */}
      <Box sx={{ flex: 1, overflowY: 'auto', py: 2, px: collapsed ? 1 : 1.5, position: 'relative', zIndex: 1, '&::-webkit-scrollbar': { width: '3px' }, '&::-webkit-scrollbar-track': { background: 'transparent' }, '&::-webkit-scrollbar-thumb': { background: 'rgba(139, 92, 246, 0.3)', borderRadius: '4px' } }}>
        <List component="nav" disablePadding sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
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
                    borderRadius: '12px',
                    minHeight: 44,
                    px: collapsed ? 1.5 : 1.75,
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    position: 'relative',
                    overflow: 'hidden',
                    bgcolor: isActive
                      ? 'rgba(124, 58, 237, 0.22)'
                      : 'transparent',
                    color: isActive ? '#e2d9f3' : 'rgba(148, 163, 184, 0.8)',
                    border: isActive
                      ? '1px solid rgba(167, 139, 250, 0.35)'
                      : '1px solid transparent',
                    transition: 'all 0.18s ease',
                    '&:hover': {
                      bgcolor: isActive
                        ? 'rgba(124, 58, 237, 0.28)'
                        : 'rgba(139, 92, 246, 0.1)',
                      color: '#ffffff',
                      border: '1px solid rgba(167, 139, 250, 0.2)',
                    },
                    '&::before': isActive
                      ? {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          top: '20%',
                          bottom: '20%',
                          width: '3px',
                          borderRadius: '0 3px 3px 0',
                          background: 'linear-gradient(180deg, #a78bfa 0%, #7c3aed 100%)',
                          boxShadow: '0 0 12px rgba(167, 139, 250, 0.8)',
                        }
                      : {},
                    '&::after': isActive
                      ? {
                          content: '""',
                          position: 'absolute',
                          inset: 0,
                          background: 'radial-gradient(ellipse at 20% 50%, rgba(124, 58, 237, 0.12) 0%, transparent 70%)',
                          pointerEvents: 'none',
                        }
                      : {},
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: collapsed ? 0 : 34,
                      color: isActive ? '#c4b5fd' : 'rgba(148, 163, 184, 0.7)',
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
                            fontWeight: isActive ? 700 : 500,
                            letterSpacing: isActive ? '-0.01em' : '0',
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
          position: 'relative',
          zIndex: 1,
          borderTop: '1px solid rgba(139, 92, 246, 0.12)',
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {!collapsed ? (
          <Stack spacing={1} sx={{ p: 1.5 }}>
            {/* User Profile Card */}
            <Box
              onClick={(e) => setPersonaAnchorEl(e.currentTarget)}
              sx={{
                p: 1.25,
                borderRadius: '12px',
                background: 'rgba(139, 92, 246, 0.08)',
                border: '1px solid rgba(139, 92, 246, 0.18)',
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  background: 'rgba(124, 58, 237, 0.18)',
                  borderColor: 'rgba(167, 139, 250, 0.4)',
                  boxShadow: '0 4px 16px rgba(124, 58, 237, 0.15)',
                },
              }}
            >
              <Avatar
                src={currentUser.avatarUrl}
                sx={{
                  width: 34,
                  height: 34,
                  background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  boxShadow: '0 2px 8px rgba(124, 58, 237, 0.4)',
                  flexShrink: 0,
                }}
              >
                {currentUser?.firstName?.[0] || 'U'}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: '#ffffff',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    lineHeight: 1.2,
                    fontSize: '0.82rem',
                  }}
                >
                  {currentUser.firstName} {currentUser.lastName}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#a78bfa',
                    display: 'block',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    fontWeight: 600,
                    fontSize: '0.68rem',
                  }}
                >
                  {currentUser.role}
                </Typography>
              </Box>
              <SwapHorizOutlinedIcon fontSize="small" sx={{ color: 'rgba(148, 163, 184, 0.6)', flexShrink: 0 }} />
            </Box>

            {/* Quick Actions */}
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', px: 0.5 }}>
              <Tooltip title={mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
                <IconButton
                  size="small"
                  onClick={toggleMode}
                  sx={{
                    color: 'rgba(148, 163, 184, 0.7)',
                    borderRadius: '8px',
                    '&:hover': { color: '#c4b5fd', bgcolor: 'rgba(139, 92, 246, 0.15)' },
                  }}
                >
                  {mode === 'light' ? <DarkModeOutlinedIcon fontSize="small" /> : <LightModeOutlinedIcon fontSize="small" />}
                </IconButton>
              </Tooltip>

              <Box sx={{ flex: 1, textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: 'rgba(100, 116, 139, 0.7)', fontSize: '0.6rem' }}>
                  v2.4
                </Typography>
              </Box>

              <Tooltip title="Sign Out">
                <IconButton
                  size="small"
                  onClick={handleLogout}
                  sx={{
                    color: 'rgba(248, 113, 113, 0.8)',
                    borderRadius: '8px',
                    '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.15)', color: '#f87171' },
                  }}
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
                sx={{ color: 'rgba(148, 163, 184, 0.7)', '&:hover': { color: '#c4b5fd', bgcolor: 'rgba(139, 92, 246, 0.15)' } }}
              >
                <ChevronRightIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={`${currentUser.firstName} ${currentUser.lastName}`} placement="right">
              <IconButton size="small" onClick={(e) => setPersonaAnchorEl(e.currentTarget)}>
                <Avatar
                  src={currentUser.avatarUrl}
                  sx={{
                    width: 30,
                    height: 30,
                    fontSize: '0.75rem',
                    background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
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
              borderRadius: '16px',
              mt: -1,
              ml: 1,
              minWidth: 268,
              background: 'linear-gradient(145deg, #12172e 0%, #0f1428 100%)',
              boxShadow: '0 16px 48px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(139, 92, 246, 0.2)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              color: '#f8fafc',
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#ffffff' }}>
            {currentUser.firstName} {currentUser.lastName}
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(148, 163, 184, 0.8)', display: 'block' }}>
            {currentUser.email}
          </Typography>
          <Chip
            label={currentUser.role}
            size="small"
            sx={{
              mt: 0.75,
              height: 20,
              fontSize: '0.65rem',
              fontWeight: 700,
              background: 'rgba(124, 58, 237, 0.25)',
              color: '#c4b5fd',
              border: '1px solid rgba(167, 139, 250, 0.3)',
            }}
          />
        </Box>

        {USE_MOCK_DATA && (
          <>
            <Divider sx={{ borderColor: 'rgba(139, 92, 246, 0.15)' }} />
            <Box sx={{ px: 2, py: 1 }}>
              <Typography
                variant="caption"
                sx={{ color: '#a78bfa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}
              >
                Switch Demo Persona
              </Typography>
              {demoPersonas.map((p) => (
                <MenuItem
                  key={p.user.id}
                  onClick={() => handleSwitchPersona(p.user)}
                  selected={currentUser.id === p.user.id}
                  sx={{
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    py: 1,
                    my: 0.25,
                    color: currentUser.id === p.user.id ? '#c4b5fd' : 'rgba(203, 213, 225, 0.9)',
                    '&.Mui-selected': { bgcolor: 'rgba(124, 58, 237, 0.2)' },
                    '&:hover': { bgcolor: 'rgba(139, 92, 246, 0.15)' },
                  }}
                >
                  {p.label}
                </MenuItem>
              ))}
            </Box>
          </>
        )}

        <Divider sx={{ borderColor: 'rgba(139, 92, 246, 0.15)' }} />
        <MenuItem
          component={RouterLink}
          to={ROUTES.PROFILE}
          onClick={() => setPersonaAnchorEl(null)}
          sx={{ color: 'rgba(203, 213, 225, 0.9)', '&:hover': { bgcolor: 'rgba(139, 92, 246, 0.15)' } }}
        >
          Profile Settings
        </MenuItem>
        <MenuItem
          onClick={handleLogout}
          sx={{ color: '#f87171', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }}
        >
          Sign Out
        </MenuItem>
      </Menu>
    </Box>
  );
}
