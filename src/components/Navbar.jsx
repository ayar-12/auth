import React from "react";
import { AppBar, Toolbar, Box, IconButton, Button, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import HomeRounded from "@mui/icons-material/HomeRounded";
import TranslateRounded from "@mui/icons-material/TranslateRounded";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const colors = {
  paper: '#F6F4F1',
  stone: '#E4DED2',
  coral: '#34656D',
  coralDark: '#34656D',
  black: '#000000'
};

export default function Navbar() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const linkSx = ({ isActive }) => ({
    mx: 0.5,
    px: 1.25,
    py: 0.5,
    borderRadius: 999,
    fontWeight: 700,
    textTransform: "none",
    color: "#fff",
    backgroundColor: isActive ? alpha("#000", 0.18) : "transparent",
    "&:hover": { backgroundColor: alpha("#000", 0.12) },
  });

  const toggleLang = () => {
    const next = i18n.language?.startsWith("ar") ? "en" : "ar";
    i18n.changeLanguage(next);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: colors.coral,
        color: "#fff",
        borderBottom: `1px solid ${alpha(colors.black, 0.08)}`,
      }}
    >
      <Toolbar sx={{ minHeight: 64, gap: 1 }}>
 
   
        <Typography
          variant="h6"
          onClick={() => navigate("/")}
          sx={{ fontWeight: 800, letterSpacing: "-0.02em", cursor: "pointer" }}
        >
          Life Lab
        </Typography>

        {/* Home */}
        <IconButton size="small" color="inherit" onClick={() => navigate("/")} aria-label="Home" sx={{ ml: 0.5 }}>
          <HomeRounded />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        {/* Links */}
        <Button component={NavLink} to="/login" sx={linkSx}>
          Login
        </Button>
        <Button component={NavLink} to="/signup" sx={linkSx}>
          Register
        </Button>

        {/* Lang switch */}
        <IconButton
          size="small"
          color="inherit"
          onClick={toggleLang}
          aria-label="Switch language"
          sx={{ ml: 0.5 }}
          title={i18n.language?.startsWith("ar") ? "English" : "العربية"}
        >
          <TranslateRounded />
        </IconButton>

      </Toolbar>
    </AppBar>
  );
}
