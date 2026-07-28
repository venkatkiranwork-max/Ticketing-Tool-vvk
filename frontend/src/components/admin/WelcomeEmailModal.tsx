import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  IconButton,
  Paper,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import toast from 'react-hot-toast';

interface WelcomeEmailModalProps {
  open: boolean;
  onClose: () => void;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    tempPassword?: string;
  } | null;
}

export const WelcomeEmailModal: React.FC<WelcomeEmailModalProps> = ({
  open,
  onClose,
  user,
}) => {
  if (!user) return null;

  const tempPassword = user.tempPassword || 'Temp@1234';

  const emailBody = `Subject: Welcome to ABC Technologies

--------------------------------

Hello ${user.firstName} ${user.lastName},

Your TicketFlow account has been created successfully.

Email:
${user.email}

Temporary Password:
${tempPassword}

Please sign in using the link below and change your password.

https://ticketflow.company.com/login

Regards,

ABC Technologies IT Team

--------------------------------`;

  const handleCopy = () => {
    navigator.clipboard.writeText(emailBody);
    toast.success('Welcome email content copied to clipboard');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: { sx: { borderRadius: '18px', p: 1 } },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <EmailOutlinedIcon color="primary" />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                Welcome Email Preview
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Sent to {user.email}
              </Typography>
            </Box>
          </Stack>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            borderRadius: '12px',
            bgcolor: 'background.default',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.6,
          }}
        >
          {emailBody}
        </Paper>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={handleCopy}
          startIcon={<ContentCopyIcon />}
          sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
        >
          Copy Email Body
        </Button>
        <Button
          onClick={onClose}
          variant="contained"
          disableElevation
          sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700, px: 3 }}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};
