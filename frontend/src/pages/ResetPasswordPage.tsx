import { useState } from 'react';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Alert, Button, Stack, TextField, Typography } from '@mui/material';
import toast from 'react-hot-toast';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { resetPasswordSchema, type ResetPasswordFormValues } from '@/features/auth/schemas';
import { resetPasswordRequest } from '@/features/auth/api';
import { getApiErrorMessage } from '@/api/client';
import { ROUTES } from '@/constants';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    if (!token) {
      setFormError('Reset token is missing. Request a new link from the forgot password page.');
      return;
    }
    setFormError(null);
    try {
      await resetPasswordRequest(token, values.password);
      toast.success('Password updated. You can sign in now.');
      navigate(ROUTES.LOGIN, { replace: true });
    } catch (error) {
      setFormError(getApiErrorMessage(error, 'Reset failed'));
    }
  });

  if (!token) {
    return (
      <AuthLayout title="Invalid reset link" subtitle="This password reset link is not valid.">
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Request a new link and try again.
        </Typography>
        <Button component={RouterLink} to={ROUTES.FORGOT_PASSWORD} variant="contained">
          Request new link
        </Button>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Set new password" subtitle="Choose a strong password for your account.">
      <Stack component="form" spacing={2.5} onSubmit={onSubmit}>
        {formError && <Alert severity="error">{formError}</Alert>}
        <TextField
          label="New password"
          type="password"
          autoComplete="new-password"
          {...register('password')}
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
          fullWidth
        />
        <TextField
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          {...register('confirmPassword')}
          error={Boolean(errors.confirmPassword)}
          helperText={errors.confirmPassword?.message}
          fullWidth
        />
        <Button type="submit" variant="contained" size="large" disabled={isSubmitting} fullWidth>
          {isSubmitting ? 'Updating…' : 'Update password'}
        </Button>
      </Stack>
    </AuthLayout>
  );
}
