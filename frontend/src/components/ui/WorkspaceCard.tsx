import { Card, CardContent, Typography, Box, Stack, Avatar, Button, LinearProgress, Chip } from '@mui/material';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';
import { AvatarGroup } from './AvatarGroup';
import type { MockWorkspace } from '@/mock/workspaces';

export interface WorkspaceCardProps {
  workspace: MockWorkspace;
  onOpen?: (ws: MockWorkspace) => void;
  onSettings?: (ws: MockWorkspace) => void;
  onMembers?: (ws: MockWorkspace) => void;
}

export function WorkspaceCard({ workspace, onOpen, onSettings, onMembers }: WorkspaceCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: '14px',
        transition: 'all 0.2s ease-in-out',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          boxShadow: '0 12px 28px rgba(0, 0, 0, 0.08)',
          borderColor: 'primary.main',
        },
      }}
    >
      <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', '&:last-child': { pb: 3 } }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                bgcolor: `${workspace.color}15`,
                color: workspace.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                fontWeight: 700,
              }}
            >
              {workspace.logo}
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
                {workspace.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                /{workspace.slug}
              </Typography>
            </Box>
          </Stack>
          <Chip
            label={`${workspace.activeProjects} active projects`}
            size="small"
            sx={{ fontSize: '0.725rem', fontWeight: 600, bgcolor: 'action.hover' }}
          />
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, flex: 1 }}>
          {workspace.description}
        </Typography>

        <Box sx={{ mb: 2.5 }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Completion Rate
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: workspace.color }}>
              {workspace.progress}% ({workspace.completedIssues}/{workspace.totalIssues} issues)
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={workspace.progress}
            sx={{
              height: 7,
              borderRadius: 4,
              bgcolor: 'action.hover',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                bgcolor: workspace.color,
              },
            }}
          />
        </Box>

        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', pt: 2, mb: 2.5, borderTop: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Owner:
            </Typography>
            <Avatar src={workspace.owner.avatarUrl} sx={{ width: 24, height: 24 }}>
              {workspace.owner.firstName[0]}
            </Avatar>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {workspace.owner.firstName} {workspace.owner.lastName}
            </Typography>
          </Stack>
          <AvatarGroup users={workspace.members} max={4} size={26} />
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            size="small"
            startIcon={<LaunchOutlinedIcon fontSize="small" />}
            onClick={() => onOpen?.(workspace)}
            sx={{ flex: 1, borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
          >
            Open
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<PeopleOutlinedIcon fontSize="small" />}
            onClick={() => onMembers?.(workspace)}
            sx={{ borderRadius: '8px', textTransform: 'none', color: 'text.primary', borderColor: 'divider' }}
          >
            Members
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<SettingsOutlinedIcon fontSize="small" />}
            onClick={() => onSettings?.(workspace)}
            sx={{ borderRadius: '8px', textTransform: 'none', color: 'text.primary', borderColor: 'divider' }}
          >
            Settings
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
