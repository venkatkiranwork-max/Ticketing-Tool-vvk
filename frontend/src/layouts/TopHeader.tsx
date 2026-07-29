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

  const isDark = mode === 'dark';
  const borderColor = isDark ? '#334155' : '#e2e8f0';
  const headerBg = isDark ? '#1e293b' : '#ffffff';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const activeColor = isDark ? '#60a5fa' : '#2563eb';
  const inputBg = isDark ? 'rgba(148, 163, 184, 0.08)' : '#f8fafc';

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

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: headerBg,
        borderBottom: `1px solid ${borderColor}`,
        zIndex: 1100,
        color: isDark ? '#f1f5f9' : '#0f172a',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <Toolbar sx={{ minHeight: '56px !important', px: { xs: 2, md: 3 }, gap: 1.5 }}>
        {/* Mobile Hamburger */}
        <IconButton
          edge="start"
          aria-label="open drawer"
          onClick={onMobileMenuToggle}
          sx={{ display: { md: 'none' }, color: textMuted }}
        >
          <MenuIcon />
        </IconButton>

        {/* Global Search */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            background: inputBg,
            border: `1px solid ${borderColor}`,
            borderRadius: '8px',
            px: 1.5,
            py: 0.5,
            width: { xs: '160px', sm: '260px', md: '320px' },
            transition: 'border-color 0.15s',
            '&:focus-within': {
              borderColor: activeColor,
            },
          }}
        >
          <SearchIcon sx={{ color: textMuted, fontSize: '1rem', mr: 1 }} />
          <InputBase
            placeholder="Search tickets, projects…"
            sx={{
              fontSize: '0.875rem',
              width: '100%',
              color: 'inherit',
              '& input': { p: 0 },
              '& input::placeholder': { color: textMuted, opacity: 1 },
            }}
          />
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Right Actions */}
        <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton
              component={RouterLink}
              to="/notifications"
              size="small"
              sx={{
                color: textMuted,
                '&:hover': { color: activeColor, bgcolor: isDark ? 'rgba(96,165,250,0.08)' : 'rgba(37,99,235,0.06)' },
              }}
            >
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsOutlinedIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Theme Toggle */}
          <Tooltip title={mode === 'light' ? 'Dark Mode' : 'Light Mode'}>
            <IconButton
              onClick={toggleMode}
              size="small"
              sx={{
                color: textMuted,
                '&:hover': { color: activeColor, bgcolor: isDark ? 'rgba(96,165,250,0.08)' : 'rgba(37,99,235,0.06)' },
              }}
            >
              {mode === 'light' ? <DarkModeOutlinedIcon fontSize="small" /> : <LightModeOutlinedIcon fontSize="small" />}
            </IconButton>
          </Tooltip>

          {/* User Profile */}
          <Box
            onClick={handleMenuOpen}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              border: `1px solid ${borderColor}`,
              borderRadius: '8px',
              pl: 0.75,
              pr: 1,
              py: 0.5,
              cursor: 'pointer',
              transition: 'all 0.15s',
              '&:hover': {
                borderColor: activeColor,
                bgcolor: isDark ? 'rgba(96,165,250,0.06)' : 'rgba(37,99,235,0.04)',
              },
            }}
          >
            <Avatar
              src={currentUser.avatarUrl}
              sx={{
                width: 28,
                height: 28,
                bgcolor: activeColor,
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              {currentUser?.firstName?.[0] || 'U'}
            </Avatar>

            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                fontSize: '0.82rem',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              {currentUser.firstName}
            </Typography>

            <KeyboardArrowDownIcon sx={{ fontSize: '1rem', color: textMuted }} />
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            slotProps={{
              paper: {
                sx: {
                  borderRadius: '10px',
                  mt: 1,
                  minWidth: 240,
                  boxShadow: isDark
                    ? '0 8px 24px rgba(0,0,0,0.5)'
                    : '0 8px 24px rgba(15,23,42,0.12)',
                  border: `1px solid ${borderColor}`,
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
                  bgcolor: isDark ? 'rgba(96,165,250,0.12)' : 'rgba(37,99,235,0.08)',
                  color: activeColor,
                }}
              />
            </Box>

            <Divider />

            {USE_MOCK_DATA && (
              <>
                <Box sx={{ px: 2, py: 1 }}>
                  <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', mb: 0.75, color: textMuted }}>
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
                        borderRadius: '6px',
                        fontSize: '0.82rem',
                        py: 0.75,
                      }}
                    >
                      {p.label}
                    </MenuItem>
                  ))}
                </Box>
                <Divider />
              </>
            )}

            <MenuItem
              component={RouterLink}
              to={ROUTES.PROFILE}
              onClick={handleMenuClose}
              sx={{ fontSize: '0.875rem' }}
            >
              Profile Settings
            </MenuItem>
            <MenuItem
              component={RouterLink}
              to={ROUTES.SETTINGS}
              onClick={handleMenuClose}
              sx={{ fontSize: '0.875rem' }}
            >
              System Settings
            </MenuItem>
            <MenuItem
              onClick={handleLogout}
              sx={{ color: '#ef4444', fontSize: '0.875rem' }}
            >
              Sign Out
            </MenuItem>
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
