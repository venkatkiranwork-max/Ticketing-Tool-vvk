import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  Typography,
  Stack,
  IconButton,
  Alert,
  Grid,
  Paper,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import ViewKanbanOutlinedIcon from '@mui/icons-material/ViewKanbanOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import type { MockUser, ScreenKey } from '@/mock/users';

interface ScreenAccessModalProps {
  user: MockUser | null;
  open: boolean;
  onClose: () => void;
  onSave: (userId: string, updatedScreens: Record<ScreenKey, boolean>) => void;
}

const SCREENS_LIST: { key: ScreenKey; label: string; icon: React.ReactNode; description: string }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: <DashboardOutlinedIcon fontSize="small" />, description: 'Metrics, recent activity & widgets' },
  { key: 'projects', label: 'Projects', icon: <FolderOutlinedIcon fontSize="small" />, description: 'Project overview & workspace repositories' },
  { key: 'issues', label: 'Issues', icon: <AssignmentOutlinedIcon fontSize="small" />, description: 'Issue tracker list view & filters' },
  { key: 'board', label: 'Kanban Board', icon: <ViewKanbanOutlinedIcon fontSize="small" />, description: 'Interactive drag & drop agile board' },
  { key: 'teams', label: 'Teams', icon: <GroupsOutlinedIcon fontSize="small" />, description: 'Department & team directory' },
  { key: 'users', label: 'Users', icon: <PeopleOutlinedIcon fontSize="small" />, description: 'Workspace member list' },
  { key: 'reports', label: 'Reports', icon: <BarChartOutlinedIcon fontSize="small" />, description: 'Velocity, burndown & analytics' },
  { key: 'auditLogs', label: 'Audit Logs', icon: <ShieldOutlinedIcon fontSize="small" />, description: 'System security audit trail' },
  { key: 'administration', label: 'Administration 🔒', icon: <AdminPanelSettingsOutlinedIcon fontSize="small" />, description: 'Super Admin control panel' },
  { key: 'notifications', label: 'Notifications', icon: <NotificationsOutlinedIcon fontSize="small" />, description: 'Alert center & updates' },
  { key: 'profile', label: 'Profile', icon: <PersonOutlinedIcon fontSize="small" />, description: 'Personal user settings' },
  { key: 'settings', label: 'Settings', icon: <SettingsOutlinedIcon fontSize="small" />, description: 'Workspace configuration' },
];

export const ScreenAccessModal: React.FC<ScreenAccessModalProps> = ({
  user,
  open,
  onClose,
  onSave,
}) => {
  const [screens, setScreens] = useState<Record<ScreenKey, boolean>>({
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
  });

  useEffect(() => {
    if (user?.screens) {
      setScreens({
        dashboard: user.screens.dashboard !== false,
        projects: user.screens.projects !== false,
        issues: user.screens.issues !== false,
        board: user.screens.board !== false,
        teams: user.screens.teams !== false,
        users: user.screens.users !== false,
        reports: user.screens.reports !== false,
        auditLogs: user.screens.auditLogs === true,
        administration: user.screens.administration === true,
        notifications: user.screens.notifications !== false,
        profile: user.screens.profile !== false,
        settings: user.screens.settings !== false,
      });
    }
  }, [user]);

  if (!user) return null;

  const handleToggle = (key: ScreenKey) => {
    setScreens((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    onSave(user.id, screens);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: { sx: { borderRadius: '18px', p: 1 } },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <VisibilityOutlinedIcon color="primary" />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                Screen Access Management – {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Configure individual page visibility and route permissions for {user.email}
              </Typography>
            </Box>
          </Stack>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        <Alert severity="info" sx={{ mb: 3, borderRadius: '12px', fontSize: '0.85rem' }}>
          Unchecking a screen will immediately hide its menu item from the navigation bar and deny direct URL route access (rendering 403 Forbidden).
        </Alert>

        <Grid container spacing={2}>
          {SCREENS_LIST.map((item) => {
            const isChecked = screens[item.key] ?? false;
            return (
              <Grid size={{ xs: 12, sm: 6 }} key={item.key}>
                <Paper
                  variant="outlined"
                  onClick={() => handleToggle(item.key)}
                  sx={{
                    p: 1.5,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    borderColor: isChecked ? 'primary.main' : 'divider',
                    bgcolor: isChecked ? 'action.hover' : 'transparent',
                    transition: 'all 0.15s ease-in-out',
                    '&:hover': {
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                    <Checkbox
                      checked={isChecked}
                      onChange={() => handleToggle(item.key)}
                      color="primary"
                    />
                    <Box sx={{ color: isChecked ? 'primary.main' : 'text.secondary' }}>
                      {item.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {item.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.725rem' }}>
                        {item.description}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disableElevation
          sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700, px: 3 }}
        >
          Save Screen Permissions
        </Button>
      </DialogActions>
    </Dialog>
  );
};
