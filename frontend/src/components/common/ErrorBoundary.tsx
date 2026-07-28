import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Box, Button, Container, Paper, Stack, Typography } from '@mui/material';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled React Error Boundary Exception:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
          <Paper
            variant="outlined"
            sx={{
              p: 4,
              borderRadius: '16px',
              textAlign: 'center',
              bgcolor: 'background.paper',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            }}
          >
            <Stack spacing={2.5} sx={{ alignItems: 'center' }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  bgcolor: 'rgba(239, 68, 68, 0.12)',
                  color: 'error.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <WarningAmberOutlinedIcon fontSize="large" color="error" />
              </Box>

              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                Something went wrong
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {this.state.error?.message || 'An unexpected error occurred while rendering this page.'}
              </Typography>

              <Stack direction="row" spacing={1.5} sx={{ mt: 1 }}>
                <Button
                  variant="outlined"
                  onClick={this.handleReset}
                  sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
                >
                  Try again
                </Button>
                <Button
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={this.handleReload}
                  sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
                >
                  Reload Page
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}
