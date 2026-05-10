import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { fetchProfile } from '../app/slices/userSlice';
import Heatmap from '../components/Heatmap';
import { getAllProgress } from '../utils/indexedDB';
import dayjs from 'dayjs';

const PageWrap = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Card = styled(motion.div)`
  background: linear-gradient(145deg, rgba(42,39,64,0.6), rgba(30,27,46,0.8));
  border: 1px solid rgba(99,102,241,0.15);
  border-radius: 1.25rem;
  padding: 1.75rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.25);
`;

const AvatarRing = styled.div`
  width: 88px;
  height: 88px;
  border-radius: 50%;
  padding: 3px;
  background: linear-gradient(135deg, #6366f1, #f472b6);
  flex-shrink: 0;
`;

const AvatarInner = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #1e1b2e;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 800;
  color: #818cf8;
  overflow: hidden;
`;

const StatBox = styled(motion.div)`
  flex: 1;
  padding: 1rem;
  border-radius: 0.875rem;
  text-align: center;
  background: rgba(99,102,241,0.06);
  border: 1px solid rgba(99,102,241,0.12);
`;

export default function Profile() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, token } = useSelector((s) => s.user);
  const { currentStreak } = useSelector((s) => s.streak);
  const [progressData, setProgressData] = useState([]);

  useEffect(() => {
    if (isAuthenticated && token) {
      dispatch(fetchProfile());
    }
  }, [dispatch, isAuthenticated, token]);

  useEffect(() => {
    getAllProgress().then((data) => setProgressData(data)).catch(() => {});
  }, []);

  if (!isAuthenticated) {
    return (
      <PageWrap>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-text mb-2">Sign In Required</h2>
          <p className="text-text-muted mb-6">Sign in to view your profile and stats.</p>
          <Link to="/auth"
            className="inline-block px-6 py-2.5 rounded-xl font-semibold text-white"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
            Sign In
          </Link>
        </motion.div>
      </PageWrap>
    );
  }

  const stats = user?.stats || {};
  const initial = (user?.name || user?.email || '?')[0].toUpperCase();

  return (
    <PageWrap>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
        {/* Profile header */}
        <Card>
          <div className="flex items-center gap-5">
            <AvatarRing>
              <AvatarInner>
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  initial
                )}
              </AvatarInner>
            </AvatarRing>
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-text truncate">{user?.name || 'Player'}</h1>
              <p className="text-sm text-text-muted truncate">{user?.email}</p>
              {user?.lastPlayed && (
                <p className="text-xs text-text-muted mt-1">
                  Last played {dayjs(user.lastPlayed).format('MMM D, YYYY')}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Stats row */}
        <div className="flex gap-3">
          {[
            { label: 'Streak', value: user?.streakCount ?? currentStreak, icon: '🔥', color: '#fbbf24' },
            { label: 'Total Pts', value: user?.totalPoints ?? 0, icon: '⭐', color: '#818cf8' },
            { label: 'Solved', value: stats.puzzlesSolved ?? 0, icon: '✅', color: '#34d399' },
            { label: 'Avg Time', value: stats.avgSolveTime ? `${Math.round(stats.avgSolveTime)}s` : '—', icon: '⏱', color: '#f472b6' },
          ].map((s, i) => (
            <StatBox key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}>
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider mt-0.5">{s.label}</div>
            </StatBox>
          ))}
        </div>

        {/* Heatmap */}
        <Card>
          <Heatmap data={progressData} weeks={12} />
        </Card>

        {/* Recent activity */}
        <Card>
          <h3 className="text-sm font-semibold text-text-muted mb-3">Recent Activity</h3>
          {progressData.length === 0 ? (
            <p className="text-sm text-text-muted text-center py-6">No activity yet. Play your first puzzle!</p>
          ) : (
            <div className="space-y-2">
              {progressData.slice(-5).reverse().map((entry, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-2.5 rounded-lg"
                  style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.1)' }}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{entry.isCorrect ? '✅' : '❌'}</span>
                    <span className="text-sm text-text">{dayjs(entry.date).format('MMM D')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-text-muted">{entry.timeTaken}s</span>
                    <span className="text-sm font-semibold text-primary-light">{entry.score} pts</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>
    </PageWrap>
  );
}