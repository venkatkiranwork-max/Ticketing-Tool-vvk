import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  Stack,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import type { MockUser, WorkspaceRole } from '@/mock/users';

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (user: Partial<MockUser>) => void;
}

const ROLES: WorkspaceRole[] = [
  'Super Admin',
  'Admin',
  'Project Manager',
  'Team Lead',
  'Member',
  'Viewer',
  'Guest',
];

const TEAMS = [
  'Engineering',
  'Product Management',
  'UI/UX Design',
  'QA Automation',
  'DevOps & SRE',
  'Frontend',
  'Backend',
];

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  open,
  onClose,
  onCreate,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [employeeId, setEmployeeId] = useState(`EMP-${1000 + Math.floor(Math.random() * 9000)}`);
  const [department, setDepartment] = useState('Engineering');
  const [team, setTeam] = useState('Engineering');
  const [role, setRole] = useState<WorkspaceRole>('Member');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [location, setLocation] = useState('San Francisco, CA');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email) return;

    onCreate({
      firstName,
      lastName,
      email,
      employeeId,
      department,
      team,
      role,
      phone,
      location,
      status: 'Active',
      avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 100)}?w=150&auto=format&fit=crop&q=80`,
    });

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
            <PersonAddOutlinedIcon color="primary" />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                Create New User Account
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Directly provision user account and generate welcome email
              </Typography>
            </Box>
          </Stack>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ py: 3 }}>
          <Alert severity="info" sx={{ mb: 3, borderRadius: '12px', fontSize: '0.85rem' }}>
            A temporary password (<code>Temp@1234</code>) will be created. A Welcome Email with login instructions will be queued automatically.
          </Alert>

          <Grid container spacing={2.5}>
            {/* First Name & Last Name */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                fullWidth
                size="small"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonAddOutlinedIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                fullWidth
                size="small"
              />
            </Grid>

            {/* Email & Employee ID */}
            <Grid size={{ xs: 12, sm: 7 }}>
              <TextField
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                size="small"
                placeholder="user@company.com"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 5 }}>
              <TextField
                label="Employee ID"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                required
                fullWidth
                size="small"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeOutlinedIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            {/* Department & Team */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
                fullWidth
                size="small"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessOutlinedIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                label="Team"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                required
                fullWidth
                size="small"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <GroupsOutlinedIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
              >
                {TEAMS.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Role */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                label="Workspace Role"
                value={role}
                onChange={(e) => setRole(e.target.value as WorkspaceRole)}
                required
                fullWidth
                size="small"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SecurityOutlinedIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
              >
                {ROLES.map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Phone & Location */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                fullWidth
                size="small"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneOutlinedIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Office Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                fullWidth
                size="small"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnOutlinedIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disableElevation
            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700, px: 3 }}
          >
            Create User & Send Welcome Email
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
