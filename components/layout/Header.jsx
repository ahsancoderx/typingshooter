'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Typing Test', href: '/typing-test' },
  { label: 'Game', href: '/game' },
  { label: 'Learn', href: '/learn' },
  { label: 'Progress', href: '/progress' },
  { label: 'Settings', href: '/settings' },
];
function Logo() {
  return (
    <Link href="/" className="logo" aria-label="TypeBlaster home">
      <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="16" r="12" fill="none" stroke="#3d8bff" strokeWidth="2.5" />
        <circle cx="16" cy="16" r="4" fill="#8b6cff" />
        <path d="M16 1v7M16 24v7M1 16h7M24 16h7" stroke="#3d8bff" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <span>TypeBlaster</span>
    </Link>
  );
}
export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={{
        bgcolor: 'rgba(8,13,29,0.92)',
        backdropFilter: 'blur(8px)',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ maxWidth: 1200, width: '100%', mx: 'auto', gap: 1 }}>
        <Logo />
        <Box
          component="nav"
          aria-label="Main"
          sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, ml: 4, flexGrow: 1 }}
        >
          {NAV.map((item) => (
            <Button
              key={item.href}
              component={Link}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              sx={{
                color: isActive(item.href) ? 'primary.main' : 'text.secondary',
                borderRadius: 0,
                minHeight: 64,
                borderBottom: 2,
                borderColor: isActive(item.href) ? 'primary.main' : 'transparent',
                '&:hover': { color: 'text.primary', bgcolor: 'transparent' },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
        <Box sx={{ flexGrow: { xs: 1, md: 0 } }} />
        <Button
          component={Link}
          href="/game"
          variant="contained"
          sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
        >
          Start Practicing
        </Button>
        <IconButton aria-label="Open menu" onClick={() => setOpen(true)} sx={{ display: { md: 'none' } }}>
          <MenuIcon />
        </IconButton>
      </Toolbar>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        sx={{ '& .MuiDrawer-paper': { width: 280, p: 2, bgcolor: 'background.paper' } }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton aria-label="Close menu" onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List component="nav" aria-label="Mobile">
          {NAV.map((item) => (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              selected={isActive(item.href)}
              onClick={() => setOpen(false)}
              aria-current={isActive(item.href) ? 'page' : undefined}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
        <Button
          component={Link}
          href="/game"
          variant="contained"
          onClick={() => setOpen(false)}
          sx={{ mt: 2 }}
        >
          Start Practicing
        </Button>
      </Drawer>
    </AppBar>
  );
}
