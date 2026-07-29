import { useState } from 'react';
import {
  Container,
  Stack,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/ui/PageHeader';
import { TeamCard } from '@/components/ui/TeamCard';
import { mockTeams } from '@/mock/teams';
import type { MockTeam } from '@/mock/teams';
import { mockUsers } from '@/mock/users';
import { useAuthStore } from '@/store/authStore';
import { hasPermission } from '@/features/auth/permissions';
import { useUsersQuery } from '@/hooks/useUsersQuery';

export function TeamsPage() {
  const currentUser = useAuthStore((s) => s.user) || mockUsers[0];
  const canManageTeams = hasPermission(currentUser, 'manage_teams');
  const { data: allUsers = [] } = useUsersQuery();

  const [teams, setTeams] = useState<MockTeam[]>(mockTeams);
  const [openModal, setOpenModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<MockTeam | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [teamLeadId, setTeamLeadId] = useState(mockUsers[0].id);
  const [color, setColor] = useState('#6366f1');

  const handleOpenCreateModal = () => {
    setEditingTeam(null);
    setName('');
    setDescription('');
    setTeamLeadId(mockUsers[0].id);
    setColor('#6366f1');
    setOpenModal(true);
  };

  const handleOpenEditModal = (team: MockTeam) => {
    setEditingTeam(team);
    setName(team.name);
    setDescription(team.description);
    setTeamLeadId(team.teamLeadId);
    setColor(team.color);
    setOpenModal(true);
  };

  const handleSaveTeam = () => {
    if (!name.trim()) {
      toast.error('Please enter team name');
      return;
    }

    const leadUser = mockUsers.find((u) => u.id === teamLeadId) || mockUsers[0];

    if (editingTeam) {
      setTeams((prev) =>
        prev.map((t) =>
          t.id === editingTeam.id
            ? {
                ...t,
                name,
                description,
                teamLeadId: leadUser.id,
                teamLeadName: `${leadUser.firstName} ${leadUser.lastName}`,
                teamLeadAvatar: leadUser.avatarUrl,
                color,
              }
            : t
        )
      );
      toast.success('Team updated successfully!');
    } else {
      const newTeam: MockTeam = {
        id: `team-${Date.now()}`,
        name,
        description,
        teamLeadId: leadUser.id,
        teamLeadName: `${leadUser.firstName} ${leadUser.lastName}`,
        teamLeadAvatar: leadUser.avatarUrl,
        memberCount: 3,
        projectCount: 1,
        openIssuesCount: 4,
        velocity: 25,
        currentSprint: 'Sprint 24 (Q3 Platform)',
        color,
        createdAt: new Date().toISOString(),
      };
      setTeams([newTeam, ...teams]);
      toast.success('Team created successfully!');
    }

    setOpenModal(false);
  };

  const handleDeleteTeam = (id: string) => {
    setTeams((prev) => prev.filter((t) => t.id !== id));
    toast.success('Team deleted');
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={3.5}>
        <PageHeader
          title="Functional Teams"
          subtitle="Manage workspace teams, assigned leads, velocity metrics, and project allocations."
          actionText={canManageTeams ? 'Create Team' : undefined}
          actionIcon={<AddIcon />}
          onAction={handleOpenCreateModal}
        />

        {/* Teams Grid */}
        <Grid container spacing={3}>
          {teams.map((t) => (
            <Grid key={t.id} size={{ xs: 12, md: 6, lg: 4 }}>
              <TeamCard team={t} onEdit={handleOpenEditModal} onDelete={handleDeleteTeam} />
            </Grid>
          ))}
        </Grid>
      </Stack>

      {/* Create / Edit Team Dialog */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>{editingTeam ? 'Edit Team' : 'Create New Team'}</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: 1 }}>
          <TextField label="Team Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth required />
          <TextField
            label="Description"
            multiline
            minRows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
          />
          <Select label="Team Lead" value={teamLeadId} onChange={(e) => setTeamLeadId(e.target.value)} fullWidth>
            {allUsers.map((u) => (
              <MenuItem key={u.id} value={u.id}>
                {u.firstName} {u.lastName} ({u.team})
              </MenuItem>
            ))}
          </Select>
          <Select label="Theme Color" value={color} onChange={(e) => setColor(e.target.value)} fullWidth>
            <MenuItem value="#6366f1">Indigo (#6366f1)</MenuItem>
            <MenuItem value="#10b981">Emerald (#10b981)</MenuItem>
            <MenuItem value="#ec4899">Pink (#ec4899)</MenuItem>
            <MenuItem value="#f59e0b">Amber (#f59e0b)</MenuItem>
            <MenuItem value="#3b82f6">Blue (#3b82f6)</MenuItem>
            <MenuItem value="#8b5cf6">Purple (#8b5cf6)</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenModal(false)} color="inherit">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSaveTeam} sx={{ fontWeight: 600 }}>
            {editingTeam ? 'Save Changes' : 'Create Team'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
