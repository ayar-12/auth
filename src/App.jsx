
import React, { useEffect, useMemo, Suspense } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, CssBaseline, CircularProgress } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";

import { initializeAuth, loadUser } from "./features/user/userSlice";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import theme from "./theme"; 
import "./App.css";

export default function App() {
  const dispatch = useDispatch();
  const { loading, initialized } = useSelector((s) => s.user);
  const { i18n } = useTranslation();

  useEffect(() => {
    initializeAuth();
    if (!initialized && !loading) dispatch(loadUser());
  }, [dispatch, initialized, loading]);

  useEffect(() => {
    const html = document?.documentElement;
    if (html) {
      html.setAttribute("dir", i18n.dir());
      html.setAttribute("lang", i18n.language || "en");
    }
  }, [i18n, i18n.language]);

  const cache = useMemo(() => {
    const isRTL = i18n.dir() === "rtl";
    return createCache({
      key: isRTL ? "mui-rtl" : "mui",
      stylisPlugins: isRTL ? [prefixer, rtlPlugin] : [prefixer],
    });
  }, [i18n.language]);

  const muiTheme = useMemo(() => ({ ...theme, direction: i18n.dir() }), [i18n.language]);

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <BrowserRouter>
          <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1 }}>
              <Suspense
                fallback={
                  <Box sx={{ minHeight: "50vh", display: "grid", placeItems: "center" }}>
                    <CircularProgress />
                  </Box>
                }
              >
                <Routes>
                  <Route path="/" element={<Navigate to="/login" replace />}/>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Register />} />
                </Routes>
              </Suspense>
            </Box>
          </Box>
        </BrowserRouter>
      </ThemeProvider>
    </CacheProvider>
  );
}
