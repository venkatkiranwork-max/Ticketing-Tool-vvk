import { Card, CardContent, Typography, Box, Stack, Chip, LinearProgress, Button } from '@mui/material';
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { AvatarGroup } from './AvatarGroup';
import type { MockProject } from '@/mock/projects';

export interface ProjectCardProps {
  project: MockProject;
  onOpen?: (project: MockProject) => void;
  onEdit?: (project: MockProject) => void;
}

export function ProjectCard({ project, onOpen, onEdit }: ProjectCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: '12px',
        transition: 'all 0.2s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
          borderColor: 'primary.main',
        },
      }}
    >
      <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', flex: 1, '&:last-child': { pb: 2.5 } }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, fontSize: '1.05rem', letterSpacing: '-0.02em', cursor: 'pointer' }}
              onClick={() => onOpen?.(project)}
            >
              {project.name}
            </Typography>
            <Chip
              label={project.team}
              size="small"
              sx={{ height: 18, fontSize: '0.675rem', fontWeight: 600, bgcolor: 'action.hover', mt: 0.5 }}
            />
          </Box>
          <Chip
            label={`${project.openIssuesCount} open issues`}
            size="small"
            sx={{ fontSize: '0.725rem', fontWeight: 700, bgcolor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}
          />
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1, lineHeight: 1.45 }}>
          {project.description}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Progress
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {project.completionRate}%
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={project.completionRate}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: 'action.hover',
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                bgcolor: project.completionRate > 80 ? '#10b981' : 'primary.main',
              },
            }}
          />
        </Box>

        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', pt: 1.5, mb: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            Members:
          </Typography>
          <AvatarGroup
            users={(project.members || []).map((m: any) =>
              m.user || {
                id: m.userId,
                firstName: m.userName?.split(' ')[0] || 'User',
                lastName: m.userName?.split(' ')[1] || '',
                email: m.userEmail,
                role: m.projectRole,
              }
            )}
            max={4}
            size={24}
          />
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            size="small"
            startIcon={<LaunchOutlinedIcon fontSize="small" />}
            onClick={() => onOpen?.(project)}
            sx={{ flex: 1, borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
          >
            Open
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<EditOutlinedIcon fontSize="small" />}
            onClick={() => onEdit?.(project)}
            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
          >
            Edit
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
