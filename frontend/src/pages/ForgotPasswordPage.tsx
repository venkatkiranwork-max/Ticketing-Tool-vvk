import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Alert, Button, Link, Stack, TextField, Typography } from '@mui/material';
import toast from 'react-hot-toast';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/features/auth/schemas';
import { forgotPasswordRequest } from '@/features/auth/api';
import { getApiErrorMessage } from '@/api/client';
import { ROUTES } from '@/constants';

export function ForgotPasswordPage() {
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await forgotPasswordRequest(values.email);
      setSubmitted(true);
      toast.success('Check your email for reset instructions');
    } catch (error) {
      setFormError(getApiErrorMessage(error, 'Request failed'));
    }
  });

  return (
    <AuthLayout
      title="Forgot password"
      subtitle="We will email you a link to reset your password."
      footer={
        <Link component={RouterLink} to={ROUTES.LOGIN} underline="hover" variant="body2">
          Back to sign in
        </Link>
      }
    >
      {submitted ? (
        <Typography variant="body2" color="text.secondary">
          If an account exists for that email, you will receive reset instructions shortly. In local
          development, check the API server console for the reset link when SMTP is not configured.
        </Typography>
      ) : (
        <Stack component="form" spacing={2.5} onSubmit={onSubmit}>
          {formError && <Alert severity="error">{formError}</Alert>}
          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            {...register('email')}
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            fullWidth
          />
          <Button type="submit" variant="contained" size="large" disabled={isSubmitting} fullWidth>
            {isSubmitting ? 'Sending…' : 'Send reset link'}
          </Button>
        </Stack>
      )}
    </AuthLayout>
  );
}
