import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { checkAndResetStreak } from '../app/slices/streakSlice';
import dayjs from 'dayjs';

const Hero = styled.section`
  min-height: calc(100vh - 4rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
`;

const GlowOrb = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.3;
  pointer-events: none;
`;

const Title = styled(motion.h1)`
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 900;
  letter-spacing: -0.03em;
  line-height: 1.1;
  background: linear-gradient(135deg, #e2e0f0 0%, #818cf8 50%, #f472b6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1.5rem;
`;

const PlayButton = styled(motion(Link))`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2.5rem;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  font-weight: 700;
  font-size: 1.125rem;
  border-radius: 16px;
  text-decoration: none;
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.35);
  transition: box-shadow 0.3s;
  &:hover { box-shadow: 0 12px 48px rgba(99, 102, 241, 0.5); }
`;

const StatCard = styled(motion.div)`
  background: linear-gradient(145deg, rgba(42,39,64,0.6), rgba(30,27,46,0.8));
  border: 1px solid rgba(99,102,241,0.15);
  border-radius: 1rem;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  text-align: center;
  min-width: 140px;
`;

export default function Home() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((s) => s.user);
  const { currentStreak } = useSelector((s) => s.streak);

  useEffect(() => {
    dispatch(checkAndResetStreak());
  }, [dispatch]);

  return (
    <Hero>
      <GlowOrb style={{ width: 500, height: 500, background: '#6366f1', top: '-10%', left: '-10%' }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 8 }} />
      <GlowOrb style={{ width: 400, height: 400, background: '#f472b6', bottom: '-5%', right: '-5%' }}
        animate={{ x: [0, -20, 0], y: [0, 30, 0] }} transition={{ repeat: Infinity, duration: 10 }} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
        style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.25)' }}>
        🧠 Daily Logic Challenge • {dayjs().format('MMM D, YYYY')}
      </motion.div>

      <Title initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
        Mind Maze
      </Title>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="text-text-muted text-lg max-w-lg mb-8 leading-relaxed">
        A new logic puzzle every day. Build your streak, sharpen your mind, and climb the global leaderboard.
      </motion.p>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="flex flex-col items-center gap-6">
        <PlayButton to="/play" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} id="play-button">
          <span>▶</span> Play Today's Puzzle
        </PlayButton>

        {isAuthenticated && (
          <div className="flex gap-4 mt-4">
            <StatCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <div className="text-3xl mb-1">🔥</div>
              <div className="text-2xl font-bold text-primary-light">{user?.streakCount || currentStreak}</div>
              <div className="text-xs text-text-muted mt-1">Day Streak</div>
            </StatCard>
            <StatCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
              <div className="text-3xl mb-1">⭐</div>
              <div className="text-2xl font-bold text-accent">{user?.totalPoints || 0}</div>
              <div className="text-xs text-text-muted mt-1">Total Points</div>
            </StatCard>
          </div>
        )}

        {!isAuthenticated && (
          <Link to="/auth" className="text-sm text-text-muted hover:text-primary-light transition-colors">
            Sign in to save your progress →
          </Link>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
        className="grid grid-cols-3 gap-6 mt-16 max-w-2xl w-full">
        {[
          { icon: '🎯', title: 'Daily Puzzles', desc: 'New challenge every day' },
          { icon: '🏆', title: 'Leaderboard', desc: 'Compete globally' },
          { icon: '📊', title: 'Track Stats', desc: 'Monitor your progress' },
        ].map((f, i) => (
          <motion.div key={i} whileHover={{ y: -4 }}
            className="p-4 rounded-xl text-center"
            style={{ background: 'rgba(42,39,64,0.4)', border: '1px solid rgba(99,102,241,0.1)' }}>
            <div className="text-2xl mb-2">{f.icon}</div>
            <div className="text-sm font-semibold text-text">{f.title}</div>
            <div className="text-xs text-text-muted mt-1">{f.desc}</div>
          </motion.div>
        ))}
      </motion.div>
    </Hero>
  );
}
