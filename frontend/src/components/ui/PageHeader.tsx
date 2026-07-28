import React from 'react';
import { Box, Typography, Stack, Button } from '@mui/material';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  actionIcon?: React.ReactNode;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
}

export function PageHeader({
  title,
  subtitle,
  actionText,
  actionIcon,
  onAction,
  secondaryActionText,
  onSecondaryAction,
}: PageHeaderProps) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' }, mb: 3.5 }}
    >
      <Box>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, letterSpacing: '-0.03em', color: 'text.primary' }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5, fontSize: '0.95rem' }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {(actionText || secondaryActionText) && (
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          {secondaryActionText && (
            <Button
              variant="outlined"
              color="inherit"
              onClick={onSecondaryAction}
              sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
            >
              {secondaryActionText}
            </Button>
          )}
          {actionText && (
            <Button
              variant="contained"
              startIcon={actionIcon}
              onClick={onAction}
              sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, px: 2.5 }}
            >
              {actionText}
            </Button>
          )}
        </Stack>
      )}
    </Stack>
  );
}
