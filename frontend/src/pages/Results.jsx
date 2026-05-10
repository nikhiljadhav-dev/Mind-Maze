import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { submitScore } from '../app/slices/puzzleSlice';
import { incrementStreak } from '../app/slices/streakSlice';
import { getPuzzleId } from '../utils/dateSeed';
import { saveProgress } from '../utils/indexedDB';
import dayjs from 'dayjs';

const Card = styled(motion.div)`
  background: linear-gradient(145deg, rgba(42,39,64,0.6), rgba(30,27,46,0.8));
  border: 1px solid rgba(99,102,241,0.15);
  border-radius: 1.5rem;
  padding: 2rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
`;

const ScoreRing = styled(motion.div)`
  width: 160px;
  height: 160px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: conic-gradient(
    #6366f1 ${(props) => (props.$pct || 0) * 3.6}deg,
    rgba(99,102,241,0.1) 0deg
  );
  position: relative;
  &::after {
    content: '';
    position: absolute;
    inset: 8px;
    border-radius: 50%;
    background: #1e1b2e;
  }
`;

const ScoreValue = styled.div`
  position: relative;
  z-index: 1;
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #818cf8, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export default function Results() {
  const dispatch = useDispatch();
  const { score, timeTaken, isCorrect, hintsUsed, isSubmitting, submitResult, submitError, currentPuzzle } =
    useSelector((s) => s.puzzle);
  const { isAuthenticated } = useSelector((s) => s.user);

  useEffect(() => {
    if (isCorrect) {
      dispatch(incrementStreak());
      const today = dayjs().format('YYYY-MM-DD');
      saveProgress({
        id: `${today}-result`,
        date: today,
        score,
        timeTaken,
        hintsUsed,
        isCorrect,
      });
    }
  }, [isCorrect, dispatch, score, timeTaken, hintsUsed]);

  const handleSubmitScore = () => {
    const puzzleId = getPuzzleId();
    dispatch(submitScore({ puzzleId, score, timeTaken, hintsUsed }));
  };

  const pct = Math.round((score / 1000) * 100);

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <div className="text-center mb-6">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
              className="text-5xl mb-3">
              {isCorrect ? '🎉' : '💪'}
            </motion.div>
            <h1 className="text-2xl font-bold text-text">
              {isCorrect ? 'Puzzle Solved!' : 'Nice Try!'}
            </h1>
            <p className="text-text-muted text-sm mt-1">{dayjs().format('MMMM D, YYYY')}</p>
          </div>

          <div className="flex justify-center mb-8">
            <ScoreRing $pct={pct} initial={{ rotate: -90 }} animate={{ rotate: 0 }} transition={{ duration: 1 }}>
              <ScoreValue>{score}</ScoreValue>
              <span className="relative z-10 text-xs text-text-muted">points</span>
            </ScoreRing>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Time', value: formatTime(timeTaken), icon: '⏱' },
              { label: 'Hints', value: `${hintsUsed}/3`, icon: '💡' },
              { label: 'Accuracy', value: isCorrect ? '100%' : '0%', icon: '🎯' },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="p-3 rounded-xl text-center"
                style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
                <div className="text-lg mb-1">{stat.icon}</div>
                <div className="text-lg font-bold text-text">{stat.value}</div>
                <div className="text-[10px] text-text-muted uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {isAuthenticated && !submitResult && (
            <motion.button onClick={handleSubmitScore} disabled={isSubmitting}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="w-full py-3 rounded-xl font-semibold text-white mb-3"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
              id="submit-score">
              {isSubmitting ? 'Submitting...' : 'Submit to Leaderboard'}
            </motion.button>
          )}

          {submitResult && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="p-3 rounded-xl text-center text-sm mb-3"
              style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)', color: '#34d399' }}>
              ✅ Score submitted! Streak: {submitResult.streak} 🔥
            </motion.div>
          )}

          {submitError && (
            <div className="p-3 rounded-xl text-center text-sm mb-3"
              style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)', color: '#f87171' }}>
              {submitError}
            </div>
          )}

          <div className="flex gap-3">
            <Link to="/" className="flex-1 py-2.5 rounded-xl text-center text-sm font-medium text-text-muted"
              style={{ background: 'rgba(54,50,83,0.5)', border: '1px solid rgba(99,102,241,0.15)' }}>
              Home
            </Link>
            <Link to="/leaderboard" className="flex-1 py-2.5 rounded-xl text-center text-sm font-medium text-primary-light"
              style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)' }}>
              Leaderboard
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
