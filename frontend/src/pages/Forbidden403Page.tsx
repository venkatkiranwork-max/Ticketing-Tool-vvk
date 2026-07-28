import { Container, Box, Typography, Button, Paper, Stack } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';

export function Forbidden403Page() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Paper
        variant="outlined"
        sx={{
          p: 5,
          borderRadius: '16px',
          textAlign: 'center',
          bgcolor: 'background.paper',
        }}
      >
        <Stack spacing={3} sx={{ alignItems: 'center' }}>
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              bgcolor: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: 36 }} />
          </Box>

          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.03em', mb: 1 }}>
              403 — Access Denied
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              You do not have permission to access this module or execute this action. Please contact your workspace
              Super Admin or Administrator to request elevated access rights.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<ArrowBackOutlinedIcon />}
            onClick={() => navigate(ROUTES.DASHBOARD)}
            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, px: 3, py: 1 }}
          >
            Return to Dashboard
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
