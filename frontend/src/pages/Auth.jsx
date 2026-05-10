import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { loginWithGoogle, loginWithTruecaller, loginAsGuest, clearError } from '../app/slices/userSlice';

const PageWrap = styled.div`
  min-height: calc(100vh - 4rem);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  position: relative;
  overflow: hidden;
`;

const GlowOrb = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.25;
  pointer-events: none;
`;

const Card = styled(motion.div)`
  width: 100%;
  max-width: 420px;
  background: linear-gradient(145deg, rgba(42,39,64,0.7), rgba(30,27,46,0.9));
  border: 1px solid rgba(99,102,241,0.15);
  border-radius: 1.5rem;
  padding: 2.5rem 2rem;
  backdrop-filter: blur(20px);
  box-shadow: 0 24px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05);
  position: relative;
  z-index: 1;
`;

const LogoMark = styled(motion.div)`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, #6366f1, #f472b6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 1.25rem;
  color: #fff;
  margin: 0 auto 1.5rem;
  box-shadow: 0 8px 24px rgba(99,102,241,0.3);
`;

const Title = styled.h1`
  text-align: center;
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #e2e0f0, #818cf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
`;

const AuthButton = styled(motion.button)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  border-radius: 0.875rem;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  border: none;
  transition: opacity 0.2s;
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.25rem 0;
  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(99,102,241,0.15);
  }
`;

const TruecallerForm = styled(motion.div)`
  background: rgba(99,102,241,0.05);
  border: 1px solid rgba(99,102,241,0.12);
  border-radius: 0.875rem;
  padding: 1.25rem;
  margin-top: 0.75rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.7rem 0.875rem;
  background: rgba(54,50,83,0.6);
  border: 1px solid rgba(99,102,241,0.25);
  border-radius: 0.625rem;
  color: #e2e0f0;
  font-size: 0.85rem;
  outline: none;
  transition: border-color 0.2s;
  &:focus { border-color: #6366f1; }
  &::placeholder { color: #9b97b8; }
`;

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);

const TruecallerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="4" fill="#0085FF" />
    <path d="M6 8h2v8H6V8zm4-2h2v12h-2V6zm4 4h2v4h-2v-4zm4-1h2v6h-2V9z" fill="#fff" />
  </svg>
);

export default function Auth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((s) => s.user);
  const [showTruecaller, setShowTruecaller] = useState(false);
  const [phone, setPhone] = useState('');
  const [tcName, setTcName] = useState('');

  if (isAuthenticated) {
    navigate('/', { replace: true });
    return null;
  }

  const handleGoogle = () => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
        callback: (response) => {
          dispatch(loginWithGoogle(response.credential)).then((res) => {
            if (res.meta.requestStatus === 'fulfilled') navigate('/');
          });
        },
      });
      window.google.accounts.id.prompt();
    } else {
      dispatch(loginWithGoogle('demo-google-credential')).then((res) => {
        if (res.meta.requestStatus === 'fulfilled') navigate('/');
      });
    }
  };

  const handleTruecaller = () => {
    if (!phone.trim()) return;
    const mockProfile = {
      phoneNumber: phone.trim(),
      firstName: tcName.trim() || 'Truecaller',
      lastName: 'User',
      email: '',
      avatarUrl: '',
    };
    dispatch(loginWithTruecaller({ accessToken: 'mock-tc-token', profile: mockProfile })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') navigate('/');
    });
  };

  const handleGuest = () => {
    dispatch(loginAsGuest()).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') navigate('/');
    });
  };

  return (
    <PageWrap>
      <GlowOrb style={{ width: 400, height: 400, background: '#6366f1', top: '10%', left: '-8%' }}
        animate={{ x: [0, 20, 0], y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 9 }} />
      <GlowOrb style={{ width: 350, height: 350, background: '#f472b6', bottom: '5%', right: '-5%' }}
        animate={{ x: [0, -15, 0], y: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 11 }} />

      <Card initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring', damping: 20 }}>

        <LogoMark initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.15, type: 'spring' }}>
          MM
        </LogoMark>

        <Title>Welcome to Mind Maze</Title>
        <p className="text-center text-sm text-text-muted mb-6">
          Sign in to save your streaks and compete on the leaderboard.
        </p>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 rounded-xl text-sm text-center"
              style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)', color: '#f87171' }}>
              {error}
              <button onClick={() => dispatch(clearError())}
                className="block mx-auto mt-1 text-xs underline opacity-70">Dismiss</button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-3">
          {/* Google */}
          <AuthButton onClick={handleGoogle} disabled={loading}
            style={{ background: '#fff', color: '#1f1f1f' }}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} id="auth-google">
            <GoogleIcon />
            {loading ? 'Signing in…' : 'Continue with Google'}
          </AuthButton>

          {/* Truecaller */}
          <AuthButton
            onClick={() => setShowTruecaller(!showTruecaller)}
            disabled={loading}
            style={{ background: '#0085FF', color: '#fff' }}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} id="auth-truecaller">
            <TruecallerIcon />
            Continue with Truecaller
          </AuthButton>

          <AnimatePresence>
            {showTruecaller && (
              <TruecallerForm initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}>
                <div className="space-y-2.5">
                  <Input type="text" placeholder="Your name (optional)" value={tcName}
                    onChange={(e) => setTcName(e.target.value)} id="tc-name" />
                  <Input type="tel" placeholder="Phone number" value={phone}
                    onChange={(e) => setPhone(e.target.value)} id="tc-phone" />
                  <AuthButton onClick={handleTruecaller}
                    disabled={loading || !phone.trim()}
                    style={{ background: 'linear-gradient(135deg,#0085FF,#0066cc)', color: '#fff', marginTop: '0.5rem' }}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} id="tc-submit">
                    {loading ? 'Verifying…' : 'Verify & Sign In'}
                  </AuthButton>
                  <p className="text-[10px] text-text-muted text-center">Mock implementation for demo purposes</p>
                </div>
              </TruecallerForm>
            )}
          </AnimatePresence>

          <Divider>
            <span className="text-xs text-text-muted">or</span>
          </Divider>

          {/* Guest */}
          <AuthButton onClick={handleGuest} disabled={loading}
            style={{ background: 'rgba(54,50,83,0.6)', color: '#e2e0f0', border: '1px solid rgba(99,102,241,0.2)' }}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} id="auth-guest">
            <span className="text-lg">👤</span>
            Continue as Guest
          </AuthButton>
        </div>

        <p className="text-[11px] text-text-muted text-center mt-6 leading-relaxed">
          Guest progress is stored locally. Sign in with Google or Truecaller to sync across devices.
        </p>
      </Card>
    </PageWrap>
  );
}