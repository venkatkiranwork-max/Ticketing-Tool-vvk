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
        minHeight: '100vh',
        background:
          theme.palette.mode === 'dark'
            ? 'radial-gradient(ellipse at 60% 0%, rgba(30, 27, 75, 0.5) 0%, #060b18 55%, #040810 100%)'
            : 'radial-gradient(ellipse at 60% 0%, rgba(30, 27, 75, 0.3) 0%, #06091a 55%, #04060f 100%)',
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
              width: 260,
              background: 'linear-gradient(180deg, #0f0b2a 0%, #0d1225 50%, #080d1e 100%)',
              color: '#ffffff',
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

      {/* Main Right Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          overflowX: 'hidden',
        }}
      >
        <TopHeader onMobileMenuToggle={handleMobileMenuToggle} />

        <Box
          component="main"
          sx={{
            flex: 1,
            p: { xs: 2, sm: 3, md: 3.5 },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
