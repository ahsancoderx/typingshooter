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
  <img
    src="/favicon.ico"
    alt=""
    width="30"
    height="30"
  />
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
      color="inherit"
      elevation={0}
      sx={{ bgcolor: '#3F6B64', color: '#FBF9EF', borderBottom: '3px solid #16201E' }}
    >
      <Toolbar sx={{ maxWidth: 1200, width: '100%', mx: 'auto', gap: 1, minHeight: { xs: 60, md: 68 } }}>
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
                color: '#FBF9EF',
                borderRadius: 0,
                minHeight: 68,
                px: 1.75,
                borderBottom: '4px solid',
                borderColor: isActive(item.href) ? '#F7C948' : 'transparent',
                '&:hover': { bgcolor: 'rgba(0,0,0,.12)' },
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
        <IconButton
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          sx={{ display: { md: 'none' }, color: '#FBF9EF' }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          '& .MuiDrawer-paper': { width: 280, p: 2, bgcolor: '#FBF9EF', borderLeft: '3px solid #16201E' },
        }}
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
