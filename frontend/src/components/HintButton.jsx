import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { revealHint } from '../app/slices/puzzleSlice';

const HintBtn = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  background: linear-gradient(145deg, rgba(244,114,182,0.15), rgba(244,114,182,0.05));
  border: 1px solid rgba(244,114,182,0.25);
  border-radius: 12px;
  color: #f472b6;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  &:disabled { opacity: 0.35; cursor: not-allowed; }
`;

const HintCard = styled(motion.div)`
  background: rgba(244,114,182,0.08);
  border: 1px solid rgba(244,114,182,0.15);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #e2e0f0;
`;

export default function HintButton() {
  const dispatch = useDispatch();
  const { hintsUsed, maxHints, hintsRevealed, isCompleted } = useSelector((s) => s.puzzle);
  const remaining = maxHints - hintsUsed;

  return (
    <div id="hint-section" className="w-full">
      <div className="flex items-center justify-between mb-2">
        <HintBtn
          onClick={() => dispatch(revealHint())}
          disabled={remaining <= 0 || isCompleted}
          whileHover={remaining > 0 ? { scale: 1.03 } : {}}
          whileTap={remaining > 0 ? { scale: 0.97 } : {}}
          id="hint-button"
        >
          <span>💡</span>
          <span>{remaining > 0 ? `Use Hint (${remaining} left)` : 'No Hints Left'}</span>
        </HintBtn>
        {hintsUsed > 0 && (
          <span className="text-xs px-2 py-0.5 rounded-md" style={{ background: 'rgba(248,113,113,0.15)', color: '#f87171' }}>
            -{hintsUsed * 100} pts
          </span>
        )}
      </div>
      <AnimatePresence>
        {hintsRevealed.map((hint, i) => (
          <HintCard key={i} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <span className="text-accent font-semibold mr-2">Hint {i + 1}:</span>{hint}
          </HintCard>
        ))}
      </AnimatePresence>
      {hintsUsed > 0 && (
        <div className="flex gap-1 mt-2">
          {Array.from({ length: maxHints }).map((_, i) => (
            <div key={i} className="h-1 flex-1 rounded-full" style={{ background: i < hintsUsed ? 'linear-gradient(90deg,#f472b6,#f87171)' : 'rgba(99,102,241,0.15)' }} />
          ))}
        </div>
      )}
    </div>
  );
}
