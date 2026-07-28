import { Card, CardContent, Typography, Box, Stack, Avatar, Button, Chip } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';

import type { MockTeam } from '@/mock/teams';
import { useAuthStore } from '@/store/authStore';
import { hasPermission } from '@/features/auth/permissions';
import { mockUsers } from '@/mock/users';

export interface TeamCardProps {
  team: MockTeam;
  onEdit?: (team: MockTeam) => void;
  onDelete?: (id: string) => void;
}

export function TeamCard({ team, onEdit, onDelete }: TeamCardProps) {
  const currentUser = useAuthStore((s) => s.user) || mockUsers[0];
  const canManageTeams = hasPermission(currentUser, 'manage_teams');

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
        {/* Header */}
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: '10px',
                bgcolor: `${team.color}15`,
                color: team.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: 800,
              }}
            >
              {team.name[0]}
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem', letterSpacing: '-0.02em' }}>
                {team.name}
              </Typography>
              <Chip
                label={`${team.memberCount} members`}
                size="small"
                sx={{ height: 18, fontSize: '0.675rem', fontWeight: 600, bgcolor: 'action.hover', mt: 0.25 }}
              />
            </Box>
          </Stack>
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, flex: 1, lineHeight: 1.5 }}>
          {team.description}
        </Typography>

        {/* Enriched Stats Grid */}
        <Stack direction="row" spacing={2} sx={{ mb: 2.5, p: 1.5, borderRadius: '10px', bgcolor: 'action.hover' }}>
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', color: 'text.secondary', mb: 0.25 }}>
              <FolderOutlinedIcon sx={{ fontSize: 13 }} />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                Projects
              </Typography>
            </Stack>
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
              {team.projectCount}
            </Typography>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', color: 'text.secondary', mb: 0.25 }}>
              <AssignmentOutlinedIcon sx={{ fontSize: 13 }} />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                Open Issues
              </Typography>
            </Stack>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#3b82f6' }}>
              {team.openIssuesCount}
            </Typography>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', color: 'text.secondary', mb: 0.25 }}>
              <SpeedOutlinedIcon sx={{ fontSize: 13 }} />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                Velocity
              </Typography>
            </Stack>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#10b981' }}>
              {team.velocity} pts
            </Typography>
          </Box>
        </Stack>

        {/* Team Lead & Sprint */}
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', pt: 2, mb: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Avatar src={team.teamLeadAvatar} sx={{ width: 26, height: 26, fontSize: '0.7rem' }}>
              {team.teamLeadName ? team.teamLeadName[0] : 'L'}
            </Avatar>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.1 }}>
                Team Lead
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                {team.teamLeadName || 'Unassigned'}
              </Typography>
            </Box>
          </Stack>
          <Chip label={team.currentSprint} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600 }} />
        </Stack>

        {/* Action Buttons (Permission Gated) */}
        {canManageTeams && (
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<EditOutlinedIcon fontSize="small" />}
              onClick={() => onEdit?.(team)}
              sx={{ flex: 1, borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<DeleteOutlinedIcon fontSize="small" />}
              onClick={() => onDelete?.(team.id)}
              sx={{ borderRadius: '8px', textTransform: 'none' }}
            >
              Delete
            </Button>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
