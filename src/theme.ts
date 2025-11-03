// src/theme/lifelabTheme.js
import { createTheme } from "@mui/material/styles";

export const LIFE_LAB = {
  paper:  "#F6F4F1", // Paper
  stone:  "#E4DED2", // Stone
  coral:  "#F95C4B", // Coral (brand accent)
  black:  "#000000", // Black
};

const lifelabTheme = createTheme({
  palette: {
    mode: "light",
    primary:   { main: LIFE_LAB.coral, contrastText: "#ffffff" },
    secondary: { main: LIFE_LAB.stone, contrastText: LIFE_LAB.black },
    background:{ default: LIFE_LAB.paper, paper: "#FFFFFF" },
    text:      { primary: LIFE_LAB.black, secondary: "#3A3A3A" },
    divider:   "rgba(0,0,0,0.12)",
  },
  shape: { borderRadius: 14 },
  typography: {
    // Headline: modern grotesk; Body: neutral sans
    fontFamily: ['"Space Grotesk"', "Inter", "system-ui", "Segoe UI", "Arial", "sans-serif"].join(","),
    h1: { fontWeight: 800, letterSpacing: "-0.02em" },
    h2: { fontWeight: 800, letterSpacing: "-0.02em" },
    h3: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 700, letterSpacing: 0 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 999 },
        containedPrimary: {
          boxShadow: "0 6px 18px rgba(249,92,75,0.25)",
        },
      },
    },
    MuiPaper: { styleOverrides: { root: { borderRadius: 20 } } },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: LIFE_LAB.coral,
          color: "#fff",
        },
      },
    },
  },
});

export default lifelabTheme;
