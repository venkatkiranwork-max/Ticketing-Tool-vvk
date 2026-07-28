import { Link as RouterLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Box, Button, Chip, Container, Stack, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { fetchHealth } from '@/api/health';
import { APP_NAME, APP_TAGLINE, QUERY_KEYS, ROUTES } from '@/constants';

export function HomePage() {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: QUERY_KEYS.HEALTH,
    queryFn: fetchHealth,
    retry: false,
  });

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: 'calc(100vh - 64px)',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'radial-gradient(ellipse 80% 60% at 50% -10%, #1a3329 0%, #0c1612 55%)'
            : 'radial-gradient(ellipse 80% 60% at 50% -10%, #d8efe6 0%, #f4f7f5 55%)',
      }}
    >
      <Container maxWidth="md" sx={{ py: { xs: 8, md: 12 } }}>
        <Stack spacing={3} sx={{ alignItems: 'flex-start' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontSize: { xs: '2.4rem', md: '3.5rem' },
                fontWeight: 700,
                letterSpacing: '-0.04em',
                lineHeight: 1.1,
                color: 'primary.main',
              }}
            >
              {APP_NAME}
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
          >
            <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 520, fontWeight: 500 }}>
              {APP_TAGLINE}. Track issues, run boards, and keep teams aligned.
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.16 }}
          >
            <Stack direction="row" spacing={1.5} useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
              <Button component={RouterLink} to={ROUTES.REGISTER} variant="contained">
                Get started
              </Button>
              <Button component={RouterLink} to={ROUTES.LOGIN} variant="outlined">
                Sign in
              </Button>
            </Stack>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
          >
            <Stack direction="row" spacing={1.5} useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
              <Chip
                label={
                  isLoading
                    ? 'Checking API…'
                    : isError
                      ? 'API offline'
                      : `API ${data?.status ?? 'ok'}`
                }
                color={isError ? 'error' : 'success'}
                variant="outlined"
                size="small"
              />
              {data && (
                <Typography variant="caption" color="text.secondary">
                  {data.environment} · uptime {Math.floor(data.uptime)}s
                </Typography>
              )}
              <Button size="small" onClick={() => refetch()} disabled={isFetching}>
                Retry health
              </Button>
            </Stack>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.28 }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Phase 2 complete — register, sign in, JWT refresh, password reset, and protected routes are live.
            </Typography>
          </motion.div>
        </Stack>
      </Container>
    </Box>
  );
}
