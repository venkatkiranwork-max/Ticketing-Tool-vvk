import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Alert, Button, Link, Stack, TextField, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import toast from 'react-hot-toast';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { registerSchema, type RegisterFormValues } from '@/features/auth/schemas';
import { registerRequest } from '@/features/auth/api';
import { getApiErrorMessage } from '@/api/client';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/constants';

export function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      const result = await registerRequest({
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
      });

      const userObj = result?.user || {
        id: `usr-${Date.now()}`,
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        role: 'Member',
      };

      setAuth(userObj, result?.accessToken || 'access-token-jwt', result?.refreshToken || 'refresh-token-jwt');
      toast.success('Account created!');
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (error) {
      setFormError(getApiErrorMessage(error, 'Registration failed'));
    }
  });

  return (
    <AuthLayout
      title="Create account"
      subtitle="Start managing tickets with your team."
      footer={
        <Stack spacing={1} sx={{ alignItems: 'center' }}>
          <Link component={RouterLink} to={ROUTES.LOGIN} underline="hover" variant="body2">
            Already have an account? Sign in
          </Link>
          <Link component={RouterLink} to={ROUTES.HOME} underline="hover" variant="body2" color="text.secondary">
            Back to home
          </Link>
        </Stack>
      }
    >
      <Stack component="form" spacing={2.5} onSubmit={onSubmit}>
        {formError && <Alert severity="error">{formError}</Alert>}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label="First name"
            {...register('firstName')}
            error={Boolean(errors.firstName)}
            helperText={errors.firstName?.message}
            fullWidth
          />
          <TextField
            label="Last name"
            {...register('lastName')}
            error={Boolean(errors.lastName)}
            helperText={errors.lastName?.message}
            fullWidth
          />
        </Stack>
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          {...register('email')}
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
          fullWidth
        />
        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          {...register('password')}
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
          fullWidth
          slotProps={{
            input: {
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
        <TextField
          label="Confirm password"
          type={showConfirmPassword ? 'text' : 'password'}
          autoComplete="new-password"
          {...register('confirmPassword')}
          error={Boolean(errors.confirmPassword)}
          helperText={errors.confirmPassword?.message}
          fullWidth
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={() => setShowConfirmPassword((show) => !show)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                    size="small"
                  >
                    {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <Button type="submit" variant="contained" size="large" disabled={isSubmitting} fullWidth>
          {isSubmitting ? 'Creating…' : 'Create account'}
        </Button>
      </Stack>
    </AuthLayout>
  );
}
