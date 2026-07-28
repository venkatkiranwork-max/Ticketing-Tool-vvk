import { createTheme, type PaletteMode } from '@mui/material/styles';

const fontFamily = "'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, sans-serif";

export function createAppTheme(mode: PaletteMode) {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? '#a78bfa' : '#6d28d9',
        light: isDark ? '#c4b5fd' : '#8b5cf6',
        dark: isDark ? '#7c3aed' : '#5b21b6',
        contrastText: '#ffffff',
      },
      secondary: {
        main: isDark ? '#38bdf8' : '#0284c7',
      },
      background: {
        default: isDark ? '#090d16' : '#f8fafc',
        paper: isDark ? '#111827' : '#ffffff',
      },
      text: {
        primary: isDark ? '#f9fafb' : '#0f172a',
        secondary: isDark ? '#9ca3af' : '#64748b',
      },
      divider: isDark ? '#1f2937' : '#e2e8f0',
      success: { main: '#10b981', light: '#ecfdf5' },
      warning: { main: '#f59e0b', light: '#fffbeb' },
      error: { main: '#f43f5e', light: '#fff1f2' },
      info: { main: '#06b6d4', light: '#ecfeff' },
    },
    typography: {
      fontFamily,
      h1: { fontWeight: 800, letterSpacing: '-0.03em' },
      h2: { fontWeight: 800, letterSpacing: '-0.025em' },
      h3: { fontWeight: 700, letterSpacing: '-0.02em' },
      h4: { fontWeight: 700, letterSpacing: '-0.015em' },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 700 },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
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
            borderRadius: 12,
            border: `1px solid ${isDark ? '#1f2937' : '#e2e8f0'}`,
          },
        },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            borderRadius: 14,
            border: `1px solid ${isDark ? '#1f2937' : '#e2e8f0'}`,
            boxShadow: isDark
              ? '0 4px 20px rgba(0, 0, 0, 0.4)'
              : '0 4px 20px rgba(15, 23, 42, 0.03)',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            borderBottom: `1px solid ${isDark ? '#1f2937' : '#e2e8f0'}`,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 700,
            borderRadius: 8,
          },
        },
      },
    },
  });
}


