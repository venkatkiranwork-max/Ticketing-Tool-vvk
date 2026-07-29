import { createTheme, type PaletteMode } from '@mui/material/styles';

const fontFamily = "'Inter', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";

export function createAppTheme(mode: PaletteMode) {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? '#60a5fa' : '#2563eb',
        light: isDark ? '#93c5fd' : '#3b82f6',
        dark: isDark ? '#3b82f6' : '#1d4ed8',
        contrastText: '#ffffff',
      },
      secondary: {
        main: isDark ? '#a78bfa' : '#7c3aed',
      },
      background: {
        default: isDark ? '#0f172a' : '#f8fafc',
        paper: isDark ? '#1e293b' : '#ffffff',
      },
      text: {
        primary: isDark ? '#f1f5f9' : '#0f172a',
        secondary: isDark ? '#94a3b8' : '#64748b',
      },
      divider: isDark ? '#334155' : '#e2e8f0',
      success: { main: '#10b981', light: '#ecfdf5' },
      warning: { main: '#f59e0b', light: '#fffbeb' },
      error: { main: '#ef4444', light: '#fef2f2' },
      info: { main: '#0ea5e9', light: '#f0f9ff' },
    },
    typography: {
      fontFamily,
      h1: { fontWeight: 700, letterSpacing: '-0.02em' },
      h2: { fontWeight: 700, letterSpacing: '-0.015em' },
      h3: { fontWeight: 600, letterSpacing: '-0.01em' },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: { borderRadius: 8 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: 'none',
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            borderRadius: 8,
            border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
          },
        },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            borderRadius: 10,
            border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
            boxShadow: isDark
              ? '0 1px 4px rgba(0, 0, 0, 0.3)'
              : '0 1px 4px rgba(15, 23, 42, 0.06)',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            borderBottom: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 600,
            borderRadius: 6,
          },
        },
      },
      MuiTextField: {
        defaultProps: { size: 'small' },
      },
    },
  });
}
