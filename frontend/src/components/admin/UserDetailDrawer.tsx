import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Avatar,
  Chip,
  Divider,
  Stack,
  Paper,
  Grid,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WorkIcon from '@mui/icons-material/Work';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FolderIcon from '@mui/icons-material/Folder';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SecurityIcon from '@mui/icons-material/Security';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LockResetIcon from '@mui/icons-material/LockReset';
import VisibilityIcon from '@mui/icons-material/Visibility';
import type { MockUser } from '@/mock/users';

interface UserDetailDrawerProps {
  user: MockUser | null;
  open: boolean;
  onClose: () => void;
  onEditScreenAccess?: (user: MockUser) => void;
  onResetPassword?: (user: MockUser) => void;
}

export const UserDetailDrawer: React.FC<UserDetailDrawerProps> = ({
  user,
  open,
  onClose,
  onEditScreenAccess,
  onResetPassword,
}) => {
  if (!user) return null;

  const getStatusColor = (status: string) => {
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
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: { sx: { backdropFilter: 'blur(3px)' } },
        paper: {
          sx: {
            width: { xs: '100%', sm: 460 },
            p: 3,
            boxSizing: 'border-box',
          },
        },
      }}
    >
      {/* Header */}
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
          User Details
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {/* User Header Profile */}
      <Stack direction="row" spacing={2.5} sx={{ alignItems: 'center', mb: 3 }}>
        <Avatar
          src={user.avatarUrl}
          sx={{ width: 72, height: 72, fontSize: '1.8rem', fontWeight: 800, boxShadow: '0 4px 14px rgba(0,0,0,0.12)' }}
        >
          {user.firstName[0]}
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
            {user.firstName} {user.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mt: 0.5 }}>
            {user.employeeId || 'EMP-1000'}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 1 }}>
            <Chip label={user.role} size="small" color="primary" sx={{ fontWeight: 700, fontSize: '0.7rem' }} />
            <Chip label={user.status} size="small" color={getStatusColor(user.status)} sx={{ fontWeight: 700, fontSize: '0.7rem' }} />
          </Stack>
        </Box>
      </Stack>

      {/* Primary Info Cards */}
      <Grid container spacing={1.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6 }}>
          <Paper variant="outlined" sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'background.default' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <WorkIcon fontSize="inherit" /> Department
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 0.5 }}>
              {user.department || user.team}
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Paper variant="outlined" sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'background.default' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationOnIcon fontSize="inherit" /> Location
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 0.5 }}>
              {user.location || 'San Francisco, CA'}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
        {onEditScreenAccess && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<VisibilityIcon />}
            onClick={() => onEditScreenAccess(user)}
            sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 700, flex: 1 }}
          >
            Screen Access
          </Button>
        )}
        {onResetPassword && (
          <Button
            variant="outlined"
            color="warning"
            size="small"
            startIcon={<LockResetIcon />}
            onClick={() => onResetPassword(user)}
            sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 700 }}
          >
            Reset Password
          </Button>
        )}
      </Stack>

      {/* Meta Details List */}
      <Stack spacing={2} sx={{ mb: 3 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <EmailIcon color="action" fontSize="small" />
          <Box>
            <Typography variant="caption" color="text.secondary">Email Address</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{user.email}</Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <PhoneIcon color="action" fontSize="small" />
          <Box>
            <Typography variant="caption" color="text.secondary">Phone</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{user.phone || '+1 (555) 000-0000'}</Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <AccessTimeIcon color="action" fontSize="small" />
          <Box>
            <Typography variant="caption" color="text.secondary">Last Login</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{user.lastLogin || 'Today'}</Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <CalendarTodayIcon color="action" fontSize="small" />
          <Box>
            <Typography variant="caption" color="text.secondary">Created Date</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{user.createdDate || '2024-01-15'}</Typography>
          </Box>
        </Stack>
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* Accordion sections for Projects, Issues, and Permissions */}
      <Accordion defaultExpanded elevation={0} variant="outlined" sx={{ borderRadius: '12px !important', mb: 1.5, overflow: 'hidden' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <FolderIcon color="primary" fontSize="small" />
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Projects ({user.activeProjectsCount || 3})
            </Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0 }}>
          <Stack spacing={1}>
            <Paper variant="outlined" sx={{ p: 1, borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600 }}>
              🚀 Enterprise Infrastructure Migration
            </Paper>
            <Paper variant="outlined" sx={{ p: 1, borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600 }}>
              ⚡ Payment Gateway Integration
            </Paper>
            <Paper variant="outlined" sx={{ p: 1, borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600 }}>
              🛡️ Security & Compliance Audit
            </Paper>
          </Stack>
        </AccordionDetails>
      </Accordion>

      <Accordion elevation={0} variant="outlined" sx={{ borderRadius: '12px !important', mb: 1.5, overflow: 'hidden' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <AssignmentIcon color="secondary" fontSize="small" />
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Assigned Issues ({user.completedTasksCount || 12})
            </Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.825rem' }}>
            User has <strong>{user.completedTasksCount}</strong> total tasks resolved and 3 active open tickets across assigned projects.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion elevation={0} variant="outlined" sx={{ borderRadius: '12px !important', overflow: 'hidden' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <SecurityIcon color="info" fontSize="small" />
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Active Permissions & Screen Access
            </Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0 }}>
          <Box sx={{ mb: 1.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', mb: 0.5 }}>
              Screen Access Status
            </Typography>
            <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 0.5 }}>
              {['Dashboard', 'Projects', 'Issues', 'Board', 'Teams', 'Users', 'Reports', 'Settings'].map((screen) => (
                <Chip
                  key={screen}
                  label={screen}
                  size="small"
                  variant="outlined"
                  color={user.screens?.[screen.toLowerCase() as keyof typeof user.screens] !== false ? 'success' : 'default'}
                  sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }}
                />
              ))}
            </Stack>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Drawer>
  );
};
