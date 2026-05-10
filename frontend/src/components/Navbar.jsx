import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { logout } from '../app/slices/userSlice';

const NavContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  backdrop-filter: blur(20px);
  background: rgba(15, 13, 26, 0.85);
  border-bottom: 1px solid rgba(99, 102, 241, 0.15);
`;

const LogoText = styled.span`
  background: linear-gradient(135deg, #818cf8, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
  font-size: 1.25rem;
  letter-spacing: -0.025em;
`;

const ActiveIndicator = styled(motion.div)`
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #6366f1, #f472b6);
  border-radius: 1px;
`;

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/play', label: 'Play' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/profile', label: 'Profile' },
];

export default function Navbar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((s) => s.user);
  const { currentStreak } = useSelector((s) => s.streak);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <NavContainer>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2" id="nav-logo">
            <LogoText>Mind Maze</LogoText>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                id={`nav-${link.label.toLowerCase()}`}
                className="relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg"
                style={{
                  color: location.pathname === link.to ? '#818cf8' : '#9b97b8',
                }}
              >
                {link.label}
                {location.pathname === link.to && (
                  <ActiveIndicator layoutId="navIndicator" />
                )}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {currentStreak > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: 'rgba(251, 191, 36, 0.15)',
                  color: '#fbbf24',
                  border: '1px solid rgba(251, 191, 36, 0.3)',
                }}
              >
                🔥 {currentStreak}
              </motion.div>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-muted">
                  {user?.name || 'User'}
                </span>
                <button
                  id="nav-logout"
                  onClick={() => dispatch(logout())}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200"
                  style={{
                    background: 'rgba(248, 113, 113, 0.1)',
                    color: '#f87171',
                    border: '1px solid rgba(248, 113, 113, 0.2)',
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                id="nav-signin"
                className="px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200"
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: '#fff',
                }}
              >
                Sign In
              </Link>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-text-muted"
            onClick={() => setMobileOpen(!mobileOpen)}
            id="nav-mobile-toggle"
            aria-label="Toggle navigation menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-surface-lighter"
          >
            <div className="px-4 py-3 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    color: location.pathname === link.to ? '#818cf8' : '#9b97b8',
                    background: location.pathname === link.to ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                  }}
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <Link
                  to="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-primary-light"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </NavContainer>
  );
}
