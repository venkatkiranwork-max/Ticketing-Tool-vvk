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
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import type { MockUser, FeaturePermissionKey } from '@/mock/users';

interface FeaturePermissionsModalProps {
  user: MockUser | null;
  open: boolean;
  onClose: () => void;
  onSave: (userId: string, updatedPermissions: Record<FeaturePermissionKey, boolean>) => void;
}

export const FeaturePermissionsModal: React.FC<FeaturePermissionsModalProps> = ({
  user,
  open,
  onClose,
  onSave,
}) => {
  const [permissions, setPermissions] = useState<Record<FeaturePermissionKey, boolean>>({
    project_create: true,
    project_edit: true,
    project_delete: false,
    project_view: true,
    issue_create: true,
    issue_edit: true,
    issue_delete: false,
    issue_comment: true,
    issue_attach_files: true,
    user_create: false,
    user_delete: false,
    user_view: true,
  });

  useEffect(() => {
    if (user?.permissions) {
      setPermissions({
        project_create: user.permissions.project_create !== false,
        project_edit: user.permissions.project_edit !== false,
        project_delete: user.permissions.project_delete === true,
        project_view: user.permissions.project_view !== false,
        issue_create: user.permissions.issue_create !== false,
        issue_edit: user.permissions.issue_edit !== false,
        issue_delete: user.permissions.issue_delete === true,
        issue_comment: user.permissions.issue_comment !== false,
        issue_attach_files: user.permissions.issue_attach_files !== false,
        user_create: user.permissions.user_create === true,
        user_delete: user.permissions.user_delete === true,
        user_view: user.permissions.user_view !== false,
      });
    }
  }, [user]);

  if (!user) return null;

  const handleToggle = (key: FeaturePermissionKey) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    onSave(user.id, permissions);
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
            <SecurityOutlinedIcon color="primary" />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                Feature Permissions – {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Fine-grained operational action controls for {user.email}
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
          Grant or revoke action-level capability rights for Projects, Issues, and User Management.
        </Alert>

        {/* Projects Permission Section */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1.5 }}>
            <FolderOutlinedIcon color="primary" fontSize="small" />
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              Projects Operations
            </Typography>
          </Stack>
          <Grid container spacing={1.5}>
            {[
              { key: 'project_create', label: 'Create Projects' },
              { key: 'project_edit', label: 'Edit Projects' },
              { key: 'project_delete', label: 'Delete Projects' },
              { key: 'project_view', label: 'View Projects' },
            ].map((item) => (
              <Grid size={{ xs: 6, sm: 3 }} key={item.key}>
                <Paper
                  variant="outlined"
                  onClick={() => handleToggle(item.key as FeaturePermissionKey)}
                  sx={{
                    p: 1,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    bgcolor: permissions[item.key as FeaturePermissionKey] ? 'action.hover' : 'transparent',
                    borderColor: permissions[item.key as FeaturePermissionKey] ? 'primary.main' : 'divider',
                  }}
                >
                  <Stack direction="row" sx={{ alignItems: 'center' }}>
                    <Checkbox
                      checked={permissions[item.key as FeaturePermissionKey]}
                      size="small"
                    />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {item.label}
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Issues Permission Section */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1.5 }}>
            <AssignmentOutlinedIcon color="secondary" fontSize="small" />
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              Issues Operations
            </Typography>
          </Stack>
          <Grid container spacing={1.5}>
            {[
              { key: 'issue_create', label: 'Create Issues' },
              { key: 'issue_edit', label: 'Edit Issues' },
              { key: 'issue_delete', label: 'Delete Issues' },
              { key: 'issue_comment', label: 'Comment on Issues' },
              { key: 'issue_attach_files', label: 'Attach Files' },
            ].map((item) => (
              <Grid size={{ xs: 6, sm: 4 }} key={item.key}>
                <Paper
                  variant="outlined"
                  onClick={() => handleToggle(item.key as FeaturePermissionKey)}
                  sx={{
                    p: 1,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    bgcolor: permissions[item.key as FeaturePermissionKey] ? 'action.hover' : 'transparent',
                    borderColor: permissions[item.key as FeaturePermissionKey] ? 'secondary.main' : 'divider',
                  }}
                >
                  <Stack direction="row" sx={{ alignItems: 'center' }}>
                    <Checkbox
                      checked={permissions[item.key as FeaturePermissionKey]}
                      size="small"
                      color="secondary"
                    />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {item.label}
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Users Permission Section */}
        <Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1.5 }}>
            <PeopleOutlinedIcon color="info" fontSize="small" />
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              Users Operations
            </Typography>
          </Stack>
          <Grid container spacing={1.5}>
            {[
              { key: 'user_create', label: 'Create Users' },
              { key: 'user_delete', label: 'Delete Users' },
              { key: 'user_view', label: 'View Users' },
            ].map((item) => (
              <Grid size={{ xs: 6, sm: 4 }} key={item.key}>
                <Paper
                  variant="outlined"
                  onClick={() => handleToggle(item.key as FeaturePermissionKey)}
                  sx={{
                    p: 1,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    bgcolor: permissions[item.key as FeaturePermissionKey] ? 'action.hover' : 'transparent',
                    borderColor: permissions[item.key as FeaturePermissionKey] ? 'info.main' : 'divider',
                  }}
                >
                  <Stack direction="row" sx={{ alignItems: 'center' }}>
                    <Checkbox
                      checked={permissions[item.key as FeaturePermissionKey]}
                      size="small"
                      color="info"
                    />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {item.label}
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
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
          Save Feature Permissions
        </Button>
      </DialogActions>
    </Dialog>
  );
};
