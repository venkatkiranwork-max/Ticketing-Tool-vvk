import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material';
import { AppSidebar } from './AppSidebar';
import { TopHeader } from './TopHeader';

export function RootLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  const handleMobileMenuToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        background: theme.palette.mode === 'dark' ? '#0f172a' : '#f8fafc',
      }}
    >
      {/* Desktop Permanent Sidebar */}
      {!isMobile && (
        <AppSidebar
          collapsed={collapsed}
          onToggleCollapse={handleToggleCollapse}
        />
      )}

      {/* Mobile Drawer Sidebar */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleMobileMenuToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 240,
              background: theme.palette.mode === 'dark' ? '#1e293b' : '#ffffff',
              border: 'none',
            },
          }}
        >
          <AppSidebar
            collapsed={false}
            onToggleCollapse={() => {}}
            onMobileClose={() => setMobileOpen(false)}
          />
        </Drawer>
      )}

      {/* Main Right Content — takes remaining width, scrolls vertically */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,         // prevent flex child from overflowing parent
          overflow: 'hidden',  // clip; vertical scroll handled by inner <main>
        }}
      >
        <TopHeader onMobileMenuToggle={handleMobileMenuToggle} />

        <Box
          component="main"
          sx={{
            flex: 1,
            overflowY: 'auto',   // vertical scroll only here
            overflowX: 'hidden',
            p: { xs: 2, sm: 2.5, md: 3 },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
