import React, { useState, useEffect } from "react";
import {
  Box, Paper, IconButton, Tooltip, Stack, Typography, TextField,
  Button, Alert, Divider, Link as MLink, CircularProgress
} from "@mui/material";
import PersonRounded from "@mui/icons-material/PersonRounded";
import MailRounded from "@mui/icons-material/MailRounded";
import KeyRounded from "@mui/icons-material/KeyRounded";
import LockRounded from "@mui/icons-material/LockRounded";
import PhoneRounded from "@mui/icons-material/PhoneRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import PhotoCameraRounded from "@mui/icons-material/PhotoCameraRounded";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register, removeErrors } from "../features/user/userSlice";
import { useTranslation } from "react-i18next";

const colors = {
  paper: "#F6F4F1",
  stone: "#E4DED2",
  coral: "#34656D",
  coralDark: "#34656D",
  black: "#000000"
};

export default function RegisterPasskey() {
  const { t } = useTranslation("common");
  const [user, setUser] = useState({ name: "", email: "", phoneNumber: "", password: "" });
  const [avatar, setAvatar] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, success, message } = useSelector((s) => s.user);

  useEffect(() => () => { dispatch(removeErrors()); }, [dispatch]);

  const registerDataChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();
      reader.onload = () => { if (reader.readyState === 2) setAvatar(reader.result); };
      if (e.target.files?.[0]) reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser((s) => ({ ...s, [e.target.name]: e.target.value }));
    }
  };

  const registerSubmit = (e) => {
    e.preventDefault();
    const { name, email, phoneNumber, password } = user;
    dispatch(removeErrors());

    if (!name?.trim() || !email?.trim() || !phoneNumber?.trim() || !password?.trim()) return;
    if (password.length < 8) return;

    dispatch(register({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phoneNumber: phoneNumber.trim(),
      password,
      avatar: avatar || null,
    }));
  };

  if (success) {
    return (
      <Box sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        p: { xs: 2, md: 3 },
        background: `linear-gradient(135deg, ${colors.paper} 0%, ${colors.stone} 100%)`
      }}>
        <Paper elevation={0}
          sx={{
            width: '100%', maxWidth: 520,
            px: { xs: 3, md: 4 }, py: { xs: 3, md: 4 },
            borderRadius: 2,
            bgcolor: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            textAlign: 'center',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 20px 60px rgba(52,101,109,0.18)'
          }}
        >
          <Box sx={{
            width: 80, height: 80, borderRadius: '50%',
            bgcolor: colors.coral, display: 'grid', placeItems: 'center',
            margin: '0 auto 24px'
          }}>
            <MailRounded sx={{ fontSize: 40, color: '#fff' }} />
          </Box>

          <Typography variant="h5" fontWeight={700} mb={2}>
            {t("register.checkEmailTitle")}
          </Typography>

          <Typography variant="body1" color="text.secondary" mb={3} lineHeight={1.7}>
            {t("register.checkEmailBody", { email: user.email })}
          </Typography>

          <Alert severity="info" sx={{ mb: 3, borderRadius: 2, textAlign: 'left' }}>
            <Typography variant="body2" fontWeight={600} mb={0.5}>
              {t("register.noEmailTitle")}
            </Typography>
            <Typography variant="body2">
              {t("register.noEmailBody")}{" "}
              <MLink
                href="/resend-verification"
                sx={{ color: colors.coral, fontWeight: 600, cursor: 'pointer' }}
                onClick={(e) => { e.preventDefault(); navigate('/resend-verification'); }}
              >
                {t("register.resendLink")}
              </MLink>
            </Typography>
          </Alert>

          {message && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2, textAlign: 'left' }}>
              {message}
            </Alert>
          )}

          <Button
            fullWidth
            onClick={() => navigate('/login')}
            sx={{
              height: 48, borderRadius: '999px', fontWeight: 700,
              background: colors.coral, color: '#fff',
              '&:hover': { background: colors.coralDark }
            }}
          >
            {t("register.goToLogin")}
          </Button>
        </Paper>
      </Box>
    );
  }

  const { name, email, phoneNumber, password } = user;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        p: { xs: 2, md: 3 },
        background: `linear-gradient(135deg, ${colors.paper} 0%, ${colors.stone} 100%)`
      }}
    >
      <Paper
        elevation={0}
        component="form"
        onSubmit={registerSubmit}
        encType="multipart/form-data"
        sx={{
          width: '100%', maxWidth: 520,
          px: { xs: 3, md: 4 }, py: { xs: 3, md: 4 },
          borderRadius: 2,
          bgcolor: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 20px 60px rgba(52,101,109,0.18)'
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Stack spacing={0.5}>
            <Typography variant="h5" fontWeight={800}>
              {t("register.title")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("register.subtitle")}
            </Typography>
          </Stack>
          <Box sx={{
            width: 44, height: 44, borderRadius: '50%',
            display: 'grid', placeItems: 'center',
            background: colors.coral, color: '#fff'
          }}>
            <KeyRounded fontSize="small" />
          </Box>
        </Stack>

        <Divider sx={{ mb: 3 }} />

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3, borderRadius: 2 }}
            onClose={() => dispatch(removeErrors())}
          >
            <Typography variant="body2" fontWeight={600} mb={0.5}>
              Registration Failed
            </Typography>
            <Typography variant="body2">{error}</Typography>

            {error.includes("not verified") && (
              <MLink
                href="/resend-verification"
                sx={{ color: colors.coral, fontWeight: 600, display: 'block', mt: 1, cursor: 'pointer' }}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/resend-verification', { state: { email: user.email } });
                }}
              >
                Resend verification email →
              </MLink>
            )}

            {error.includes("already exists") && (
              <MLink
                href="/login"
                sx={{ color: colors.coral, fontWeight: 600, display: 'block', mt: 1, cursor: 'pointer' }}
                onClick={(e) => { e.preventDefault(); navigate('/login'); }}
              >
                Go to login →
              </MLink>
            )}
          </Alert>
        )}

        <Stack spacing={2}>
          <TextField
            label={t("register.displayName")}
            name="name"
            fullWidth
            required
            value={name}
            onChange={registerDataChange}
            disabled={loading}
            InputProps={{ startAdornment: <PersonRounded sx={{ mr: 1, color: 'text.disabled' }} /> }}
          />

          <TextField
            label={t("register.email")}
            name="email"
            type="email"
            fullWidth
            required
            value={email}
            onChange={registerDataChange}
            disabled={loading}
            autoComplete="email"
            InputProps={{ startAdornment: <MailRounded sx={{ mr: 1, color: 'text.disabled' }} /> }}
          />

          <TextField
            label={t("register.phone")}
            name="phoneNumber"
            type="tel"
            fullWidth
            required
            value={phoneNumber}
            onChange={registerDataChange}
            disabled={loading}
            InputProps={{ startAdornment: <PhoneRounded sx={{ mr: 1, color: 'text.disabled' }} /> }}
          />

          <TextField
            label={t("register.password")}
            name="password"
            type="password"
            fullWidth
            required
            value={password}
            onChange={registerDataChange}
            disabled={loading}
            autoComplete="new-password"
            helperText={
              password.length > 0 ? (
                <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                  <Typography component="span" variant="caption"
                    sx={{ color: password.length >= 8 ? 'success.main' : 'error.main', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {password.length >= 8 ? '✓' : '✗'} {t("register.passwordMinLength")}
                  </Typography>
                  <Typography component="span" variant="caption"
                    sx={{ color: /[A-Z]/.test(password) ? 'success.main' : 'text.secondary', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {/[A-Z]/.test(password) ? '✓' : '○'} {t("register.passwordUppercase")}
                  </Typography>
                  <Typography component="span" variant="caption"
                    sx={{ color: /[0-9]/.test(password) ? 'success.main' : 'text.secondary', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {/[0-9]/.test(password) ? '✓' : '○'} {t("register.passwordNumber")}
                  </Typography>
                </Stack>
              ) : t("register.passwordHint")
            }
            error={password.length > 0 && password.length < 8}
            InputProps={{ startAdornment: <LockRounded sx={{ mr: 1, color: 'text.disabled' }} /> }}
          />

          <Box sx={{ mt: 1 }}>
            <Tooltip title={t("register.uploadAvatarTooltip")}>
              <span>
                <IconButton
                  component="label"
                  aria-label={t("register.uploadAvatarAria")}
                  disabled={loading}
                  sx={{
                    width: 56, height: 56, borderRadius: "50%", color: "#fff",
                    background: colors.coral,
                    boxShadow: "0 10px 24px rgba(52,101,109,0.28)",
                    transition: "transform .15s ease, box-shadow .15s ease, opacity .15s",
                    "&:hover": { transform: "translateY(-2px)", boxShadow: "0 16px 36px rgba(52,101,109,0.36)" },
                    "&.Mui-disabled": { opacity: 0.6, boxShadow: "none" }
                  }}
                >
                  <PhotoCameraRounded fontSize="medium" />
                  <input hidden accept="image/*" id="avatar-upload" name="avatar" type="file" onChange={registerDataChange} />
                </IconButton>
              </span>
            </Tooltip>
            {avatar && (
              <Typography variant="caption" color="success.main" sx={{ ml: 2 }}>
                {t("register.avatarSelected")}
              </Typography>
            )}
          </Box>

          <Button
            type="submit"
            disabled={!email.trim() || !name.trim() || !phoneNumber.trim() || !password.trim() || password.length < 8 || loading}
            endIcon={!loading ? <ArrowForwardRounded /> : null}
            sx={{
              height: 48, borderRadius: '999px', fontWeight: 700,
              background: colors.coral, color: '#fff',
              '&:hover': { background: colors.coralDark },
              '&.Mui-disabled': { background: '#67878cff', color: '#fff' }
            }}
          >
            {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : t("register.create")}
          </Button>

          <Stack direction="row" justifyContent="space-between" alignItems="center" pt={1}>
            <MLink
              href="/login"
              underline="hover"
              sx={{ color: colors.coral, fontWeight: 600, cursor: 'pointer' }}
              onClick={(e) => { e.preventDefault(); navigate('/login'); }}
            >
              {t("register.haveAccount")}
            </MLink>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
