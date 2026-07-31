import { Card, CardContent, Typography, Box, Stack, Avatar, AvatarGroup } from '@mui/material';
import WebOutlinedIcon from '@mui/icons-material/WebOutlined';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import ApiOutlinedIcon from '@mui/icons-material/ApiOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';

interface ProjectOverviewCardProps {
  project: {
    _id: string;
    name: string;
    progress: number;
    completedIssues: number;
    totalIssues: number;
    membersCount: number;
    members: Array<{ userName: string }>;
  };
}

// Deterministic icon/color based on project name hash or predefined map
function getProjectStyles(name: string) {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('web')) return { icon: <WebOutlinedIcon />, color: '#6366f1', bgcolor: '#e0e7ff' };
  if (lowerName.includes('mobile') || lowerName.includes('app')) return { icon: <PhoneIphoneOutlinedIcon />, color: '#10b981', bgcolor: '#dcfce7' };
  if (lowerName.includes('api')) return { icon: <ApiOutlinedIcon />, color: '#f59e0b', bgcolor: '#fef3c7' };
  if (lowerName.includes('user')) return { icon: <PeopleAltOutlinedIcon />, color: '#3b82f6', bgcolor: '#dbeafe' };
  if (lowerName.includes('report')) return { icon: <BarChartOutlinedIcon />, color: '#ef4444', bgcolor: '#fee2e2' };
  return { icon: <FolderOutlinedIcon />, color: '#8b5cf6', bgcolor: '#f3e8ff' };
}

function stringAvatar(name: string) {
  const parts = name.split(' ');
  return {
    children: parts.length > 1 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name[0]?.toUpperCase(),
  };
}

export function ProjectOverviewCard({ project }: ProjectOverviewCardProps) {
  const { icon, color, bgcolor } = getProjectStyles(project.name);

  return (
    <Card sx={{ borderRadius: '12px', boxShadow: '0px 2px 8px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', height: '100%' }}>
      <CardContent sx={{ p: '24px !important', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 3 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              bgcolor,
              color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              '& svg': { fontSize: '1.5rem' }
            }}
          >
            {icon}
          </Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }}>
            {project.name}
          </Typography>
        </Stack>

        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" sx={{ alignItems: 'flex-end', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ width: '100%', mr: 2 }}>
            <Box sx={{ width: '100%', height: 6, bgcolor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
              <Box sx={{ width: `${project.progress}%`, height: '100%', bgcolor: color, borderRadius: '4px' }} />
            </Box>
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1 }}>
            {project.progress}%
          </Typography>
        </Stack>

        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            {project.completedIssues} / {project.totalIssues} issues
          </Typography>
          
          <AvatarGroup
            max={4}
            sx={{
              '& .MuiAvatar-root': {
                width: 24,
                height: 24,
                fontSize: '0.65rem',
                border: '2px solid #fff',
              }
            }}
          >
            {project.members.map((member, i) => (
              <Avatar key={i} {...stringAvatar(member.userName)} />
            ))}
            {/* If there are more members than what we received from API (top 3), we could use a dummy item but AvatarGroup handles max={4} assuming we have the full array. Since API returns 3, the +X won't be perfectly accurate to full count unless we pass the raw membersCount as well and render a custom extra avatar. Let's do that. */}
            {project.membersCount > project.members.length && (
              <Avatar sx={{ bgcolor: '#f1f5f9', color: '#64748b' }}>+{project.membersCount - project.members.length}</Avatar>
            )}
          </AvatarGroup>
        </Stack>
      </CardContent>
    </Card>
  );
}
