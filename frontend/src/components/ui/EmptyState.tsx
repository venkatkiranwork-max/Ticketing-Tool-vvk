import React from 'react';
import { Box, Typography, Button, Stack, Paper } from '@mui/material';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
}

export function EmptyState({
  title = 'No items found',
  description = 'There are no items matching your request. Try adjusting your filters or create a new entry.',
  icon = <InboxOutlinedIcon sx={{ fontSize: 44, color: 'text.secondary' }} />,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
}: EmptyStateProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 6,
        borderRadius: '16px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.paper',
        borderColor: 'divider',
      }}
    >
      <Box
        sx={{
          p: 2,
          borderRadius: '50%',
          bgcolor: 'action.hover',
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, letterSpacing: '-0.01em' }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420, mb: 3 }}>
        {description}
      </Typography>
      {(actionText || secondaryActionText) && (
        <Stack direction="row" spacing={1.5}>
          {secondaryActionText && (
            <Button variant="outlined" color="inherit" onClick={onSecondaryAction} sx={{ borderRadius: '8px', textTransform: 'none' }}>
              {secondaryActionText}
            </Button>
          )}
          {actionText && (
            <Button variant="contained" onClick={onAction} sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}>
              {actionText}
            </Button>
          )}
        </Stack>
      )}
    </Paper>
  );
}
