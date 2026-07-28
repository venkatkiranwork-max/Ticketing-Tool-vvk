import { Link as RouterLink } from 'react-router-dom';
import { Box, Link, Paper, Stack, Typography, Chip } from '@mui/material';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import { APP_NAME, ROUTES } from '@/constants';
import type { ReactNode } from 'react';

type AuthLayoutProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        px: 2,
        py: { xs: 2, sm: 3 },
        boxSizing: 'border-box',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'radial-gradient(circle at 50% 0%, #1e1b4b 0%, #0f172a 50%, #090d16 100%)'
            : 'radial-gradient(circle at 50% 0%, #e0e7ff 0%, #f1f5f9 50%, #f8fafc 100%)',
      }}
    >
      {/* Decorative Background Ambient Glow Orbs */}
      <Box
        sx={{
          position: 'absolute',
          top: '-15%',
          left: '20%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.22) 0%, rgba(124, 58, 237, 0) 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-10%',
          right: '15%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.18) 0%, rgba(56, 189, 248, 0) 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      {/* Main Glassmorphic Card */}
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 440,
          p: { xs: 2.5, sm: 3.5 },
          borderRadius: '20px',
          backdropFilter: 'blur(20px)',
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'rgba(17, 24, 39, 0.8)'
              : 'rgba(255, 255, 255, 0.9)',
          border: '1px solid',
          borderColor: (theme) =>
            theme.palette.mode === 'dark'
              ? 'rgba(139, 92, 246, 0.25)'
              : 'rgba(99, 102, 241, 0.2)',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 16px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              : '0 16px 40px rgba(99, 102, 241, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        }}
      >
        <Stack spacing={2.5}>
          {/* Header & Logo */}
          <Stack spacing={1} sx={{ alignItems: 'flex-start' }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 1.5,
                py: 0.5,
                borderRadius: '10px',
                background: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(124, 58, 237, 0.2)'
                    : 'rgba(99, 102, 241, 0.1)',
                border: '1px solid',
                borderColor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(167, 139, 250, 0.3)'
                    : 'rgba(99, 102, 241, 0.2)',
              }}
            >
              <ConfirmationNumberOutlinedIcon sx={{ fontSize: 18, color: 'primary.main' }} />
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: '0.05em' }}>
                {APP_NAME}
              </Typography>
              <Chip label="v2.4" size="small" color="primary" variant="outlined" sx={{ height: 16, fontSize: '0.6rem', fontWeight: 800 }} />
            </Box>

            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: 800,
                letterSpacing: '-0.03em',
                background: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #ffffff 0%, #c4b5fd 100%)'
                    : 'linear-gradient(135deg, #0f172a 0%, #4338ca 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.4, fontSize: '0.85rem' }}>
                {subtitle}
              </Typography>
            )}
          </Stack>

          {/* Form Content */}
          {children}

          {/* Footer Navigation */}
          {footer ?? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: '0.825rem' }}>
              <Link component={RouterLink} to={ROUTES.HOME} underline="hover" sx={{ fontWeight: 600 }}>
                Back to home
              </Link>
            </Typography>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}
