import { createTheme } from '@mui/material/styles';
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#3d8bff' },
    secondary: { main: '#8b6cff' },
    background: { default: '#080d1d', paper: '#0f1731' },
    text: { primary: '#eef3ff', secondary: '#9aa8c7' },
    divider: 'rgba(130,160,255,0.16)',
    error: { main: '#ff5c78' },
    success: { main: '#35d49a' },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: 'var(--font-ui), system-ui, sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { borderRadius: 10, minHeight: 44, paddingInline: 20 } },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
  },
});
export default theme;
