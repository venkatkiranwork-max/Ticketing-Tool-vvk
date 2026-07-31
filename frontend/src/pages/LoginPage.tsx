import { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Alert,
  Button,
  Link,
  Stack,
  TextField,
  Typography,
  Chip,
  Paper,
  InputAdornment,
  IconButton,
  Avatar,
  Box,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import toast from 'react-hot-toast';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { loginSchema, type LoginFormValues } from '@/features/auth/schemas';
import { loginRequest } from '@/features/auth/api';
import { getApiErrorMessage } from '@/api/client';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/constants';
import { mockUsers } from '@/mock/users';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const from = (location.state as { from?: string } | null)?.from ?? ROUTES.DASHBOARD;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'suresh@gmail.com', password: 'Password123!' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      const result = await loginRequest(values);
      const matchedMockUser = mockUsers.find((u) => u.email.toLowerCase() === values.email.toLowerCase());

      const userObj = result?.user || matchedMockUser || {
        id: `usr-${Date.now()}`,
        email: values.email,
        firstName: values.email.split('@')[0],
        lastName: 'User',
        role: 'Member',
      };

      setAuth(userObj as any, result?.accessToken || 'access-token-jwt', result?.refreshToken || 'refresh-token-jwt');
      toast.success(`Welcome back, ${userObj.firstName}!`);
      navigate(from, { replace: true });
    } catch (error) {
      const message = getApiErrorMessage(error, 'Login failed');
      setFormError(message);
    }
  });

  const handleAutoFill = (email: string) => {
    setValue('email', email);
    setValue('password', 'Password123!');
    toast.success(`Credentials selected: ${email}`);
  };

  return (
    <AuthLayout
      title="Sign in to TicketFlow"
      subtitle="Enter your enterprise credentials to access your workspace."
      footer={
        <Stack spacing={0.5} sx={{ alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Don't have an account?{' '}
            <Link component={RouterLink} to={ROUTES.REGISTER} underline="hover" sx={{ fontWeight: 700, color: 'primary.main' }}>
              Create an account
            </Link>
          </Typography>
          <Link component={RouterLink} to={ROUTES.HOME} underline="hover" variant="caption" color="text.secondary" sx={{ fontSize: '0.725rem' }}>
            ← Return to portal homepage
          </Link>
        </Stack>
      }
    >
      <Stack component="form" spacing={2} onSubmit={onSubmit}>
        {formError && <Alert severity="error" sx={{ borderRadius: '10px', py: 0.25 }}>{formError}</Alert>}

        {/* Quick Demo Credentials Panel */}
        <Paper
          variant="outlined"
          sx={{
            p: 1.5,
            borderRadius: '14px',
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(30, 41, 59, 0.5)'
                : 'rgba(241, 245, 249, 0.7)',
            border: '1px dashed',
            borderColor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(139, 92, 246, 0.3)'
                : 'rgba(99, 102, 241, 0.3)',
          }}
        >
          <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', mb: 1 }}>
            <KeyOutlinedIcon sx={{ fontSize: 16, color: 'primary.main' }} />
            <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '0.675rem' }}>
              Demo Accounts — Pass: <code style={{ background: 'rgba(124, 58, 237, 0.15)', padding: '1px 5px', borderRadius: '4px', fontFamily: 'monospace', color: '#a78bfa' }}>Password123!</code>{' '}
              | New users: <code style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '1px 5px', borderRadius: '4px', fontFamily: 'monospace', color: '#10b981' }}>Temp@1234</code>
            </Typography>
          </Stack>

          <Stack spacing={0.75}>
            {/* Account 1: Suresh (Super Admin) */}
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleAutoFill('suresh@gmail.com')}
              sx={{
                p: 0.75,
                px: 1.25,
                textTransform: 'none',
                justify: 'space-between',
                borderRadius: '10px',
                borderColor: 'rgba(124, 58, 237, 0.25)',
                background: 'rgba(124, 58, 237, 0.05)',
                '&:hover': {
                  borderColor: 'primary.main',
                  background: 'rgba(124, 58, 237, 0.15)',
                },
              }}
            >
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem', bgcolor: '#7c3aed', fontWeight: 800 }}>S</Avatar>
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', lineHeight: 1.1 }}>
                    Suresh Kumar
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.675rem', lineHeight: 1 }}>
                    suresh@gmail.com
                  </Typography>
                </Box>
              </Stack>
              <Chip label="Super Admin" size="small" color="primary" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 800 }} />
            </Button>

            {/* Account 2: Ravi (Project Manager) */}
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleAutoFill('ravi@gmail.com')}
              sx={{
                p: 0.75,
                px: 1.25,
                textTransform: 'none',
                justify: 'space-between',
                borderRadius: '10px',
                borderColor: 'rgba(16, 185, 129, 0.25)',
                background: 'rgba(16, 185, 129, 0.05)',
                '&:hover': {
                  borderColor: 'success.main',
                  background: 'rgba(16, 185, 129, 0.15)',
                },
              }}
            >
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem', bgcolor: '#10b981', fontWeight: 800 }}>R</Avatar>
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', lineHeight: 1.1 }}>
                    Ravi Sharma
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.675rem', lineHeight: 1 }}>
                    ravi@gmail.com
                  </Typography>
                </Box>
              </Stack>
              <Chip label="Project Manager" size="small" color="success" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 800 }} />
            </Button>

            {/* Account 3: Mani (PM) */}
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleAutoFill('mani@gmail.com')}
              sx={{
                p: 0.75,
                px: 1.25,
                textTransform: 'none',
                justify: 'space-between',
                borderRadius: '10px',
                borderColor: 'rgba(16, 185, 129, 0.25)',
                background: 'rgba(16, 185, 129, 0.05)',
                '&:hover': {
                  borderColor: 'success.main',
                  background: 'rgba(16, 185, 129, 0.15)',
                },
              }}
            >
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem', bgcolor: '#10b981', fontWeight: 800 }}>M</Avatar>
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', lineHeight: 1.1 }}>
                    Mani Verma
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.675rem', lineHeight: 1 }}>
                    mani@gmail.com
                  </Typography>
                </Box>
              </Stack>
              <Chip label="Project Manager" size="small" color="success" variant="outlined" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 800 }} />
            </Button>
          </Stack>
        </Paper>

        <TextField
          label="Email Address"
          type="email"
          size="small"
          autoComplete="email"
          {...register('email')}
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
          fullWidth
          slotProps={{
            input: {
              sx: { borderRadius: '10px' },
            },
          }}
        />

        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          size="small"
          autoComplete="current-password"
          {...register('password')}
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
          fullWidth
          slotProps={{
            input: {
              sx: { borderRadius: '10px' },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((show) => !show)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <Link
          component={RouterLink}
          to={ROUTES.FORGOT_PASSWORD}
          variant="caption"
          sx={{ alignSelf: 'flex-end', fontWeight: 600, color: 'text.secondary', mt: -1 }}
        >
          Forgot password?
        </Link>

        <Button
          type="submit"
          variant="contained"
          size="medium"
          disabled={isSubmitting}
          endIcon={<ArrowForwardOutlinedIcon />}
          fullWidth
          sx={{
            borderRadius: '10px',
            py: 1.1,
            fontWeight: 800,
            fontSize: '0.9rem',
            background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
            boxShadow: '0 6px 20px rgba(124, 58, 237, 0.35)',
            '&:hover': {
              background: 'linear-gradient(135deg, #6d28d9 0%, #4338ca 100%)',
              boxShadow: '0 8px 24px rgba(124, 58, 237, 0.45)',
            },
          }}
        >
          {isSubmitting ? 'Authenticating…' : 'Sign In to Workspace'}
        </Button>
      </Stack>
    </AuthLayout>
  );
}
