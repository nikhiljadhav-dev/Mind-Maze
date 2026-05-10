import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import PuzzleBoard from '../components/PuzzleBoard';
import Timer from '../components/Timer';
import HintButton from '../components/HintButton';
import { setPuzzle } from '../app/slices/puzzleSlice';
import { generateDailyPuzzle } from '../puzzles/generator';
import { getPuzzleId, getTodayDateString } from '../utils/dateSeed';
import { savePuzzleState, getPuzzleState } from '../utils/indexedDB';

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

export default function Play() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isCompleted, score, timeTaken } = useSelector((s) => s.puzzle);
  const [alreadyPlayed, setAlreadyPlayed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const today = getTodayDateString();
      const saved = await getPuzzleState(today);

      if (saved && saved.isCompleted) {
        setAlreadyPlayed(true);
        setLoading(false);
        return;
      }

      const puzzle = generateDailyPuzzle();
      const puzzleId = getPuzzleId();
      dispatch(setPuzzle({ puzzle: { ...puzzle, id: puzzleId }, puzzleType: puzzle.puzzleType }));
      setLoading(false);
    }
    init();
  }, [dispatch]);

  useEffect(() => {
    if (isCompleted) {
      const today = getTodayDateString();
      savePuzzleState(today, { isCompleted: true, score, timeTaken, completedAt: Date.now() });
      const timer = setTimeout(() => navigate('/results'), 2500);
      return () => clearTimeout(timer);
    }
  }, [isCompleted, score, timeTaken, navigate]);

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full" />
        </div>
      </PageContainer>
    );
  }

  if (alreadyPlayed) {
    return (
      <PageContainer>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center py-20">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-text mb-2">Already Played Today!</h2>
          <p className="text-text-muted mb-6">Come back tomorrow for a new puzzle.</p>
          <motion.button onClick={() => navigate('/results')} whileHover={{ scale: 1.05 }}
            className="px-6 py-2 rounded-xl font-semibold text-white"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
            View Results
          </motion.button>
        </motion.div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="text-xl font-bold text-text">
          Daily Challenge
        </motion.h1>
        <Timer isRunning={!isCompleted} />
      </div>
      <div className="space-y-4">
        <PuzzleBoard />
        <HintButton />
      </div>
    </PageContainer>
  );
}
