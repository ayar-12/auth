import React, { useEffect, useState } from 'react';
import {
  Box, Paper, Stack, Typography, TextField, Button, Alert, Divider, Link as MLink, CircularProgress
} from '@mui/material';
import MailRounded from '@mui/icons-material/MailRounded';
import LockRounded from '@mui/icons-material/LockRounded';
import KeyRounded from '@mui/icons-material/KeyRounded';
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, removeErrors, removeSuccess } from '../features/user/userSlice';
import { useTranslation } from 'react-i18next';

const colors = {
  paper: '#F6F4F1',
  stone: '#E4DED2',
  coral: '#34656D',
  coralDark: '#34656D',
  black: '#000000'
};

export default function Login() {
  const { t } = useTranslation('common');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [feedback, setFeedback] = useState({ text: '', type: 'info' });

  const { error, success, isAuthenticated } = useSelector((s) => s.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSignIn = async (e) => {
    e.preventDefault();
    if (localLoading) return;
    setFeedback({ text: '', type: 'info' });
    setLocalLoading(true);
    try {
      await dispatch(login({ email: email.trim().toLowerCase(), password })).unwrap();
      setFeedback({ text: t('login.okRedirect'), type: 'success' });
    } catch (err) {
      setFeedback({ text: err?.message || t('login.errGeneric'), type: 'error' });
    } finally {
      setLocalLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      setFeedback({ text: typeof error === 'string' ? error : error?.message || t('login.errGeneric'), type: 'error' });
      dispatch(removeErrors());
    }
  }, [error, dispatch, t]);

  useEffect(() => {
    if (success) {
      setFeedback({ text: t('login.ok'), type: 'success' });
      dispatch(removeSuccess());
    }
  }, [success, dispatch, t]);

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const isEmailVerificationError =
    feedback.text.toLowerCase().includes('verify') ||
    feedback.text.toLowerCase().includes('verification') ||
    feedback.text.toLowerCase().includes('not verified');

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        p: { xs: 2, md: 3 },
        background: `linear-gradient(135deg, ${colors.paper} 0%, ${colors.stone} 100%)`,
      }}
    >
      <Paper
        elevation={0}
        component="form"
        onSubmit={onSignIn}
        sx={{
          width: '100%',
          maxWidth: 520,
          px: { xs: 3, md: 4 },
          py: { xs: 3, md: 4 },
          borderRadius: 2,
          bgcolor: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 20px 60px rgba(249,92,75,0.12)', // coral glow
          textAlign: 'left',
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Stack spacing={0.5}>
            <Typography variant="h5" fontWeight={800}>Life Lab — {t('login.title')}</Typography>
            <Typography variant="body2" color="text.secondary">{t('login.subtitle')}</Typography>
          </Stack>
          <Box sx={{ width: 44, height: 44, borderRadius: '50%', display: 'grid', placeItems: 'center', background: colors.coral, color: '#fff' }}>
            <KeyRounded fontSize="small" />
          </Box>
        </Stack>

        <Divider sx={{ mb: 3 }} />

        <Stack spacing={2}>
          <TextField
            label={t('login.email')}
            type="email"
            required
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={localLoading}
            autoComplete="username"
            InputProps={{ startAdornment: <MailRounded sx={{ mr: 1, color: 'text.disabled' }} /> }}
          />

          <TextField
            label={t('login.password')}
            type="password"
            required
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={localLoading}
            autoComplete="current-password"
            InputProps={{ startAdornment: <LockRounded sx={{ mr: 1, color: 'text.disabled' }} /> }}
          />

          <Button
            type="submit"
            disabled={!email.trim() || !password.trim() || localLoading}
            endIcon={!localLoading ? <ArrowForwardRounded /> : null}
            sx={{
              height: 48,
              borderRadius: '999px',
              fontWeight: 700,
              background: colors.coral,
              color: '#fff',
              '&:hover': { background: colors.coralDark },
              '&.Mui-disabled': { background: '#67878cff', color: '#fff' },
            }}
          >
            {localLoading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : t('login.cta')}
          </Button>

          {feedback.text && (
            <Alert
              severity={isEmailVerificationError ? 'warning' : feedback.type}
              sx={{ borderRadius: 2 }}
              action={
                isEmailVerificationError && (
                  <Button
                    color="inherit"
                    size="small"
                    onClick={() => navigate('/resend-verification')}
                    sx={{ fontWeight: 600, textTransform: 'none' }}
                  >
                    {t('login.resend')}
                  </Button>
                )
              }
            >
              <Typography variant="body2" fontWeight={500}>{feedback.text}</Typography>
              {isEmailVerificationError && (
                <Typography variant="caption" display="block" sx={{ mt: 0.5, opacity: 0.9 }}>
                  {t('login.verifyHint')}
                </Typography>
              )}
            </Alert>
          )}

          <Stack direction="row" justifyContent="space-between" alignItems="center" pt={1}>
            <MLink
              href="/signup"
              underline="hover"
              sx={{ color: colors.coral, fontWeight: 600, cursor: 'pointer' }}
              onClick={(e) => { e.preventDefault(); navigate('/signup'); }}
            >
              {t('login.create')}
            </MLink>
            <MLink
              href="/forget/password"
              underline="hover"
              color="text.secondary"
              sx={{ cursor: 'pointer' }}
              onClick={(e) => { e.preventDefault(); navigate('/forget/password'); }}
            >
              {t('login.forgot')}
            </MLink>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
