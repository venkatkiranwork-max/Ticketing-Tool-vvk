import { useState } from 'react';
import {
  Container,
  Stack,
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import WorkspacesOutlinedIcon from '@mui/icons-material/WorkspacesOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import toast from 'react-hot-toast';

import { PageHeader } from '@/components/ui/PageHeader';
import { useThemeStore } from '@/store/themeStore';
import { mockUsers } from '@/mock/users';
import { mockWorkspaces } from '@/mock/workspaces';

export function SettingsPage() {
  const mode = useThemeStore((s) => s.mode);
  const toggleMode = useThemeStore((s) => s.toggleMode);
  const [tab, setTab] = useState(0);

  // Form states
  const currentWs = mockWorkspaces[0];
  const [wsName, setWsName] = useState(currentWs.name);
  const [wsSlug, setWsSlug] = useState(currentWs.slug);

  const currentUser = mockUsers[0];
  const [firstName, setFirstName] = useState(currentUser.firstName);
  const [lastName, setLastName] = useState(currentUser.lastName);
  const [email, setEmail] = useState(currentUser.email);

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [desktopPush, setDesktopPush] = useState(true);

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3.5}>
        <PageHeader
          title="Settings"
          subtitle="Configure company workspace parameters, users, roles, notification triggers, and theme appearance."
        />

        <Card variant="outlined" sx={{ borderRadius: '14px' }}>
          <Tabs
            value={tab}
            onChange={(_, val) => setTab(val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ px: 2, borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab icon={<WorkspacesOutlinedIcon />} iconPosition="start" label="Workspace" sx={{ textTransform: 'none', fontWeight: 600 }} />
            <Tab icon={<PeopleOutlinedIcon />} iconPosition="start" label="Users" sx={{ textTransform: 'none', fontWeight: 600 }} />
            <Tab icon={<ShieldOutlinedIcon />} iconPosition="start" label="Roles" sx={{ textTransform: 'none', fontWeight: 600 }} />
            <Tab icon={<NotificationsActiveOutlinedIcon />} iconPosition="start" label="Notifications" sx={{ textTransform: 'none', fontWeight: 600 }} />
            <Tab icon={<PaletteOutlinedIcon />} iconPosition="start" label="Appearance" sx={{ textTransform: 'none', fontWeight: 600 }} />
            <Tab icon={<PersonOutlineOutlinedIcon />} iconPosition="start" label="Profile" sx={{ textTransform: 'none', fontWeight: 600 }} />
          </Tabs>

          <CardContent sx={{ p: 3 }}>
            {/* Tab 0: Workspace */}
            {tab === 0 && (
              <Stack spacing={2.5} sx={{ maxWidth: 600 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Workspace Settings
                </Typography>
                <TextField label="Workspace Name" value={wsName} onChange={(e) => setWsName(e.target.value)} fullWidth />
                <TextField label="Workspace Slug" value={wsSlug} onChange={(e) => setWsSlug(e.target.value)} fullWidth />
                <Button variant="contained" startIcon={<SaveOutlinedIcon />} onClick={handleSave} sx={{ width: 'fit-content', borderRadius: '8px', fontWeight: 600 }}>
                  Save Workspace
                </Button>
              </Stack>
            )}

            {/* Tab 1: Users */}
            {tab === 1 && (
              <Stack spacing={2.5} sx={{ maxWidth: 600 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  User Management Preferences
                </Typography>
                <FormControlLabel control={<Switch defaultChecked />} label="Allow members to invite guests to projects" />
                <FormControlLabel control={<Switch defaultChecked />} label="Require admin approval for new user registrations" />
                <Button variant="contained" startIcon={<SaveOutlinedIcon />} onClick={handleSave} sx={{ width: 'fit-content', borderRadius: '8px', fontWeight: 600 }}>
                  Save Settings
                </Button>
              </Stack>
            )}

            {/* Tab 2: Roles */}
            {tab === 2 && (
              <Stack spacing={2.5} sx={{ maxWidth: 600 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  System Role Matrix
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active workspace roles: <strong>Admin</strong>, <strong>Project Admin</strong>, <strong>Member</strong>, <strong>Viewer</strong>, <strong>Guest</strong>.
                </Typography>
                <Divider />
                <FormControlLabel control={<Switch defaultChecked />} label="Restrict project deletion rights to Admin role only" />
                <Button variant="contained" startIcon={<SaveOutlinedIcon />} onClick={handleSave} sx={{ width: 'fit-content', borderRadius: '8px', fontWeight: 600 }}>
                  Save Role Policy
                </Button>
              </Stack>
            )}

            {/* Tab 3: Notifications */}
            {tab === 3 && (
              <Stack spacing={2.5} sx={{ maxWidth: 600 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Notifications
                </Typography>
                <FormControlLabel
                  control={<Switch checked={emailNotifications} onChange={(e) => setEmailNotifications(e.target.checked)} />}
                  label="Daily Email Summary Digest (08:00 UTC)"
                />
                <FormControlLabel
                  control={<Switch checked={desktopPush} onChange={(e) => setDesktopPush(e.target.checked)} />}
                  label="Desktop Push Notifications on Issue Assignment"
                />
                <Button variant="contained" startIcon={<SaveOutlinedIcon />} onClick={handleSave} sx={{ width: 'fit-content', borderRadius: '8px', fontWeight: 600 }}>
                  Save Notifications
                </Button>
              </Stack>
            )}

            {/* Tab 4: Appearance */}
            {tab === 4 && (
              <Stack spacing={2.5} sx={{ maxWidth: 600 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Appearance & Theme
                </Typography>
                <Box sx={{ p: 2, borderRadius: '12px', border: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Theme Mode
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Current: <strong>{mode.toUpperCase()}</strong>
                    </Typography>
                  </Box>
                  <Tooltip title="Toggle theme">
                    <IconButton onClick={toggleMode} color="primary" sx={{ bgcolor: 'action.hover' }}>
                      {mode === 'light' ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
                    </IconButton>
                  </Tooltip>
                </Box>
                <Button variant="contained" startIcon={<SaveOutlinedIcon />} onClick={handleSave} sx={{ width: 'fit-content', borderRadius: '8px', fontWeight: 600 }}>
                  Save Appearance
                </Button>
              </Stack>
            )}

            {/* Tab 5: Profile */}
            {tab === 5 && (
              <Stack spacing={2.5} sx={{ maxWidth: 600 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  My Profile Details
                </Typography>
                <Stack direction="row" spacing={2}>
                  <TextField label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} fullWidth />
                  <TextField label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} fullWidth />
                </Stack>
                <TextField label="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
                <Button variant="contained" startIcon={<SaveOutlinedIcon />} onClick={handleSave} sx={{ width: 'fit-content', borderRadius: '8px', fontWeight: 600 }}>
                  Save Profile
                </Button>
              </Stack>
            )}
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
