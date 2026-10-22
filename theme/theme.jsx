import { createTheme } from '@mui/material/styles';

const ink = '#16201E';
const card = '#FBF9EF';
const cream = '#EDEAD9';
const teal = '#3F6B64';
const salmon = '#E9695C';
const yellow = '#F7C948';
const maroon = '#6B1D14';

// Neo-brutalist look: cream paper, thick ink outlines, hard maroon offset shadows.
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: salmon, contrastText: ink },
    secondary: { main: teal },
    background: { default: cream, paper: card },
    text: { primary: ink, secondary: '#56615E' },
    divider: ink,
    error: { main: '#C62F2F' },
    success: { main: '#1F7A5A' },
    warning: { main: yellow },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: "var(--font-ui, 'Segoe UI'), system-ui, sans-serif",
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true, disableRipple: true },
      styleOverrides: {
        root: {
          border: `2px solid ${ink}`,
          borderRadius: 8,
          minHeight: 42,
          paddingInline: 18,
          boxShadow: `4px 4px 0 ${maroon}`,
          transition: 'transform .08s, box-shadow .08s, background-color .08s',
          '&:hover': { transform: 'translate(2px, 2px)', boxShadow: `2px 2px 0 ${maroon}` },
          '&:active': { transform: 'translate(4px, 4px)', boxShadow: `0 0 0 ${maroon}` },
        },
        containedPrimary: { backgroundColor: salmon, color: ink, '&:hover': { backgroundColor: '#EE7B6F' } },
        outlined: {
          backgroundColor: card,
          color: ink,
          borderColor: ink,
          '&:hover': { backgroundColor: '#F3F0DF', borderColor: ink },
        },
        sizeSmall: { minHeight: 34, paddingInline: 12, boxShadow: `3px 3px 0 ${maroon}` },
      },
      variants: [
        {
          props: { variant: 'text' },
          style: {
            border: 'none',
            boxShadow: 'none',
            minHeight: 36,
            '&:hover': { transform: 'none', boxShadow: 'none', backgroundColor: 'rgba(22,32,30,.08)' },
          },
        },
      ],
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          border: `2px solid ${ink}`,
          color: ink,
          backgroundColor: card,
          fontWeight: 700,
          textTransform: 'none',
          '&:hover': { backgroundColor: '#F3F0DF' },
          '&.Mui-selected, &.Mui-selected:hover': { backgroundColor: yellow, color: ink },
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        grouped: { '&:not(:first-of-type)': { borderLeft: `2px solid ${ink}`, marginLeft: -2 } },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { height: 12, borderRadius: 6, border: `2px solid ${ink}`, backgroundColor: card },
        bar: { backgroundColor: teal },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { border: `2px solid ${ink}`, boxShadow: `8px 8px 0 ${maroon}`, borderRadius: 10 },
      },
    },
    MuiAlert: { styleOverrides: { root: { border: `2px solid ${ink}`, borderRadius: 8 } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
  },
});

export default theme;
