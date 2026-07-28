import { useState } from 'react';
import { Container, Stack, Typography, Card, CardContent, Button, TextField, Divider } from '@mui/material';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/ui/PageHeader';
import { mockWorkspaces } from '@/mock/workspaces';

export function WorkspacePage() {
  const currentWs = mockWorkspaces[0];
  const [name, setName] = useState(currentWs.name);
  const [slug, setSlug] = useState(currentWs.slug);
  const [description, setDescription] = useState(currentWs.description);

  const handleSave = () => {
    toast.success('Workspace updated!');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3.5}>
        <PageHeader
          title="Workspace Settings"
          subtitle="Configure core workspace details, company slug, and primary description."
        />

        <Card variant="outlined" sx={{ borderRadius: '14px' }}>
          <CardContent sx={{ p: 3 }}>
            <Stack spacing={2.5} sx={{ maxWidth: 600 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Company Workspace Profile
              </Typography>
              <TextField
                label="Workspace Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
              />
              <TextField
                label="Workspace Slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                fullWidth
              />
              <TextField
                label="Description"
                multiline
                minRows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
              />
              <Divider />
              <Button
                variant="contained"
                startIcon={<SaveOutlinedIcon />}
                onClick={handleSave}
                sx={{ width: 'fit-content', borderRadius: '8px', fontWeight: 600 }}
              >
                Save Workspace
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
