import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { fetchLeaderboard } from '../app/slices/streakSlice';
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

const TabBtn = styled.button`
  padding: 0.5rem 1.25rem;
  border-radius: 0.625rem;
  font-size: 0.8rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  background: ${(p) => (p.$active ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'rgba(54,50,83,0.5)')};
  color: ${(p) => (p.$active ? '#fff' : '#9b97b8')};
`;

const RankBadge = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.8rem;
  flex-shrink: 0;
  background: ${(p) =>
    p.$rank === 1 ? 'linear-gradient(135deg,#fbbf24,#f59e0b)' :
    p.$rank === 2 ? 'linear-gradient(135deg,#94a3b8,#cbd5e1)' :
    p.$rank === 3 ? 'linear-gradient(135deg,#d97706,#b45309)' :
    'rgba(99,102,241,0.12)'};
  color: ${(p) => (p.$rank <= 3 ? '#1e1b2e' : '#818cf8')};
`;

const Row = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.75rem;
  transition: background 0.15s;
  background: ${(p) => (p.$highlight ? 'rgba(99,102,241,0.08)' : 'transparent')};
  &:hover { background: rgba(99,102,241,0.06); }
`;

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function Leaderboard() {
  const dispatch = useDispatch();
  const { leaderboard, leaderboardLoading, leaderboardError } = useSelector((s) => s.streak);
  const { user } = useSelector((s) => s.user);
  const [tab, setTab] = useState('daily');
  const [allTime, setAllTime] = useState([]);
  const [allTimeLoading, setAllTimeLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  useEffect(() => {
    if (tab === 'alltime' && allTime.length === 0) {
      setAllTimeLoading(true);
      fetch(`${API_URL}/leaderboard/alltime`)
        .then((r) => r.json())
        .then((d) => { setAllTime(d.leaderboard || []); setAllTimeLoading(false); })
        .catch(() => setAllTimeLoading(false));
    }
  }, [tab, allTime.length]);

  const activeData = tab === 'daily' ? leaderboard : allTime;
  const loading = tab === 'daily' ? leaderboardLoading : allTimeLoading;

  return (
    <PageWrap>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text">Leaderboard</h1>
            <p className="text-sm text-text-muted">{dayjs().format('MMMM D, YYYY')}</p>
          </div>
          <div className="flex gap-2">
            <TabBtn $active={tab === 'daily'} onClick={() => setTab('daily')}>Daily</TabBtn>
            <TabBtn $active={tab === 'alltime'} onClick={() => setTab('alltime')}>All Time</TabBtn>
          </div>
        </div>

        <Card>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="w-8 h-8 rounded-full"
                style={{ border: '3px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1' }} />
            </div>
          ) : leaderboardError && tab === 'daily' ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">⚠️</div>
              <p className="text-text-muted">{leaderboardError}</p>
              <button onClick={() => dispatch(fetchLeaderboard())}
                className="mt-3 text-sm text-primary-light underline">Retry</button>
            </div>
          ) : activeData.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">🏆</div>
              <p className="text-text-muted text-sm">No scores yet today. Be the first!</p>
            </div>
          ) : (
            <div className="space-y-1">
              {/* Header */}
              <div className="flex items-center gap-3 px-3 pb-2 text-[10px] uppercase tracking-widest text-text-muted font-semibold">
                <span className="w-8">#</span>
                <span className="flex-1">Player</span>
                {tab === 'daily' ? (
                  <>
                    <span className="w-16 text-right">Score</span>
                    <span className="w-14 text-right">Time</span>
                  </>
                ) : (
                  <span className="w-20 text-right">Points</span>
                )}
                <span className="w-12 text-right">Streak</span>
              </div>

              <AnimatePresence>
                {activeData.map((entry, i) => (
                  <Row key={entry.userId || i}
                    $highlight={user && entry.userId === user.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}>
                    <RankBadge $rank={entry.rank}>{entry.rank}</RankBadge>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg,#6366f1,#f472b6)', color: '#fff' }}>
                        {(entry.name || '?')[0].toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-text truncate">
                        {entry.name || 'Anonymous'}
                        {user && entry.userId === user.id && (
                          <span className="ml-1 text-[10px] text-primary-light">(You)</span>
                        )}
                      </span>
                    </div>
                    {tab === 'daily' ? (
                      <>
                        <span className="w-16 text-right text-sm font-bold text-primary-light">{entry.score}</span>
                        <span className="w-14 text-right text-xs text-text-muted">{entry.timeTaken}s</span>
                      </>
                    ) : (
                      <span className="w-20 text-right text-sm font-bold text-primary-light">{entry.totalPoints}</span>
                    )}
                    <span className="w-12 text-right text-xs" style={{ color: '#fbbf24' }}>
                      {entry.streak > 0 ? `🔥${entry.streak}` : '—'}
                    </span>
                  </Row>
                ))}
              </AnimatePresence>
            </div>
          )}
        </Card>
      </motion.div>
    </PageWrap>
  );
}