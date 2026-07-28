import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  InputBase,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Divider,
  Chip,
  Tooltip,
  Stack,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/constants';
import { mockNotifications } from '@/mock/notifications';
import { mockUsers, type MockUser } from '@/mock/users';
import { USE_MOCK_DATA } from '@/mock/config';
import toast from 'react-hot-toast';

interface TopHeaderProps {
  onMobileMenuToggle: () => void;
}

export function TopHeader({ onMobileMenuToggle }: TopHeaderProps) {
  const navigate = useNavigate();
  const mode = useThemeStore((s) => s.mode);
  const toggleMode = useThemeStore((s) => s.toggleMode);

  const currentUser = useAuthStore((s) => s.user) || mockUsers[0];
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const unreadCount = mockNotifications.filter((n) => !n.isRead).length;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSwitchPersona = (selectedUser: MockUser) => {
    if (selectedUser.status === 'Locked' || selectedUser.status === 'Inactive' || selectedUser.status === 'Suspended') {
      toast.error(`Account status is ${selectedUser.status}. Cannot switch.`);
      handleMenuClose();
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
    handleMenuClose();
    navigate(ROUTES.DASHBOARD);
  };

  const handleLogout = () => {
    clearAuth();
    toast.success('Signed out');
    navigate(ROUTES.HOME);
  };

  const demoPersonas = [
    { label: 'Suresh Kumar (Super Admin)', user: mockUsers[0] },
    { label: 'Ravi Sharma (Admin)', user: mockUsers[1] },
    { label: 'Mani Verma (Project Manager)', user: mockUsers[2] },
  ];

  const headerBg =
    mode === 'dark'
      ? 'linear-gradient(90deg, #0d1225 0%, #0f1428 100%)'
      : 'linear-gradient(90deg, #0f0b2a 0%, #1e1b4b 100%)';

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: headerBg,
        borderBottom: '1px solid rgba(139, 92, 246, 0.18)',
        zIndex: 1100,
        backdropFilter: 'blur(12px)',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)',
      }}
    >
      <Toolbar sx={{ minHeight: '60px !important', px: { xs: 2, md: 3 }, gap: 2 }}>
        {/* Mobile Hamburger */}
        <IconButton
          edge="start"
          aria-label="open drawer"
          onClick={onMobileMenuToggle}
          sx={{ display: { md: 'none' }, color: '#a78bfa' }}
        >
          <MenuIcon />
        </IconButton>

        {/* Global Search */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(139, 92, 246, 0.08)',
            border: '1px solid rgba(139, 92, 246, 0.18)',
            borderRadius: '12px',
            px: 2,
            py: 0.6,
            width: { xs: '180px', sm: '300px', md: '360px' },
            transition: 'all 0.2s ease',
            '&:focus-within': {
              background: 'rgba(124, 58, 237, 0.15)',
              borderColor: 'rgba(167, 139, 250, 0.5)',
              boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.15)',
            },
          }}
        >
          <SearchIcon sx={{ color: 'rgba(167, 139, 250, 0.7)', fontSize: '1.1rem', mr: 1 }} />
          <InputBase
            placeholder="Search tickets, projects…"
            sx={{
              fontSize: '0.875rem',
              width: '100%',
              color: '#e2d9f3',
              '& input': { p: 0 },
              '& input::placeholder': { color: 'rgba(148, 163, 184, 0.5)', opacity: 1 },
            }}
          />
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Right Actions */}
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton
              component={RouterLink}
              to="/notifications"
              sx={{
                background: 'rgba(139, 92, 246, 0.08)',
                border: '1px solid rgba(139, 92, 246, 0.15)',
                borderRadius: '10px',
                p: 1,
                color: 'rgba(167, 139, 250, 0.9)',
                '&:hover': {
                  background: 'rgba(124, 58, 237, 0.18)',
                  borderColor: 'rgba(167, 139, 250, 0.4)',
                },
              }}
            >
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsOutlinedIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Theme Toggle */}
          <Tooltip title={mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
            <IconButton
              onClick={toggleMode}
              sx={{
                background: 'rgba(139, 92, 246, 0.08)',
                border: '1px solid rgba(139, 92, 246, 0.15)',
                borderRadius: '10px',
                p: 1,
                color: 'rgba(167, 139, 250, 0.9)',
                '&:hover': {
                  background: 'rgba(124, 58, 237, 0.18)',
                  borderColor: 'rgba(167, 139, 250, 0.4)',
                },
              }}
            >
              {mode === 'light' ? (
                <DarkModeOutlinedIcon fontSize="small" />
              ) : (
                <LightModeOutlinedIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>

          {/* User Profile Pill */}
          <Box
            onClick={handleMenuOpen}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              background: 'rgba(124, 58, 237, 0.12)',
              border: '1px solid rgba(139, 92, 246, 0.25)',
              borderRadius: '12px',
              pl: 0.75,
              pr: 1.25,
              py: 0.5,
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                background: 'rgba(124, 58, 237, 0.22)',
                borderColor: 'rgba(167, 139, 250, 0.5)',
                boxShadow: '0 4px 16px rgba(124, 58, 237, 0.2)',
              },
            }}
          >
            <Avatar
              src={currentUser.avatarUrl}
              sx={{
                width: 30,
                height: 30,
                background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                fontSize: '0.8rem',
                fontWeight: 800,
                boxShadow: '0 2px 8px rgba(124, 58, 237, 0.4)',
              }}
            >
              {currentUser?.firstName?.[0] || 'U'}
            </Avatar>

            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                fontSize: '0.85rem',
                color: '#e2d9f3',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              {currentUser.firstName}
            </Typography>

            <KeyboardArrowDownIcon fontSize="small" sx={{ color: 'rgba(167, 139, 250, 0.7)', fontSize: '1rem' }} />
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            slotProps={{
              paper: {
                sx: {
                  borderRadius: '16px',
                  mt: 1,
                  minWidth: 248,
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

            <Divider sx={{ borderColor: 'rgba(139, 92, 246, 0.15)' }} />

            {USE_MOCK_DATA && (
              <>
                <Box sx={{ px: 2, py: 1 }}>
                  <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', mb: 0.75, color: '#a78bfa' }}>
                    <SwapHorizOutlinedIcon fontSize="small" />
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}
                    >
                      Persona Switcher
                    </Typography>
                  </Stack>
                  {demoPersonas.map((p) => (
                    <MenuItem
                      key={p.user.id}
                      onClick={() => handleSwitchPersona(p.user)}
                      selected={currentUser.id === p.user.id}
                      sx={{
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        py: 0.75,
                        color: currentUser.id === p.user.id ? '#c4b5fd' : 'rgba(203, 213, 225, 0.9)',
                        '&.Mui-selected': { bgcolor: 'rgba(124, 58, 237, 0.2)' },
                        '&:hover': { bgcolor: 'rgba(139, 92, 246, 0.15)' },
                      }}
                    >
                      {p.label}
                    </MenuItem>
                  ))}
                </Box>
                <Divider sx={{ borderColor: 'rgba(139, 92, 246, 0.15)' }} />
              </>
            )}

            <MenuItem
              component={RouterLink}
              to={ROUTES.PROFILE}
              onClick={handleMenuClose}
              sx={{ color: 'rgba(203, 213, 225, 0.9)', '&:hover': { bgcolor: 'rgba(139, 92, 246, 0.15)' } }}
            >
              Profile Settings
            </MenuItem>
            <MenuItem
              component={RouterLink}
              to={ROUTES.SETTINGS}
              onClick={handleMenuClose}
              sx={{ color: 'rgba(203, 213, 225, 0.9)', '&:hover': { bgcolor: 'rgba(139, 92, 246, 0.15)' } }}
            >
              System Settings
            </MenuItem>
            <MenuItem
              onClick={handleLogout}
              sx={{ color: '#f87171', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }}
            >
              Sign Out
            </MenuItem>
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
