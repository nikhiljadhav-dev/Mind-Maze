import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { setAnswer, completePuzzle, revealHint } from '../app/slices/puzzleSlice';
import { validateAnswer } from '../puzzles/validator';

const BoardContainer = styled(motion.div)`
  background: linear-gradient(145deg, rgba(42, 39, 64, 0.6), rgba(30, 27, 46, 0.8));
  border: 1px solid rgba(99, 102, 241, 0.15);
  border-radius: 1.5rem;
  padding: 2rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05);
`;

const PuzzleTitle = styled.h2`
  background: linear-gradient(135deg, #e2e0f0, #818cf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const SequenceItem = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.1rem;
  background: linear-gradient(145deg, rgba(99, 102, 241, 0.2), rgba(99, 102, 241, 0.05));
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: #e2e0f0;
`;

const QuestionMark = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 12px;
  font-weight: 800;
  font-size: 1.5rem;
  background: linear-gradient(145deg, rgba(244, 114, 182, 0.3), rgba(244, 114, 182, 0.1));
  border: 2px solid rgba(244, 114, 182, 0.5);
  color: #f472b6;
`;

const InputField = styled.input`
  background: rgba(54, 50, 83, 0.6);
  border: 2px solid rgba(99, 102, 241, 0.3);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  color: #e2e0f0;
  font-size: 1.1rem;
  font-weight: 600;
  width: 100%;
  max-width: 300px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  }

  &::placeholder {
    color: #9b97b8;
    font-weight: 400;
  }
`;

const SubmitButton = styled(motion.button)`
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 2rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const OptionButton = styled(motion.button)`
  background: ${(props) =>
    props.$selected
      ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
      : 'rgba(54, 50, 83, 0.6)'};
  color: ${(props) => (props.$selected ? '#fff' : '#e2e0f0')};
  border: 2px solid ${(props) =>
    props.$selected ? '#6366f1' : 'rgba(99, 102, 241, 0.2)'};
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  text-transform: capitalize;
  min-width: 120px;
`;

const GridCell = styled.select`
  background: rgba(54, 50, 83, 0.6);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 8px;
  padding: 0.5rem;
  color: #e2e0f0;
  font-size: 0.85rem;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: #6366f1;
  }

  option {
    background: #1e1b2e;
    color: #e2e0f0;
  }
`;

export default function PuzzleBoard() {
  const dispatch = useDispatch();
  const puzzle = useSelector((s) => s.puzzle);
  const { currentPuzzle, puzzleType, isCompleted, userAnswer, startTime } = puzzle;
  const [localAnswer, setLocalAnswer] = useState('');
  const [gridAnswers, setGridAnswers] = useState({});
  const inputRef = useRef(null);

  useEffect(() => {
    setLocalAnswer('');
    setGridAnswers({});
  }, [currentPuzzle]);

  useEffect(() => {
    if (inputRef.current && !isCompleted) {
      inputRef.current.focus();
    }
  }, [currentPuzzle, isCompleted]);

  const handleSubmit = useCallback(() => {
    if (isCompleted || !currentPuzzle) return;

    let answerToSubmit;

    if (puzzleType === 'logicGrid') {
      const entities = currentPuzzle.gridEntities || [];
      const answers = entities.map((e) => gridAnswers[e] || '');
      answerToSubmit = JSON.stringify(answers);
    } else {
      answerToSubmit = localAnswer.trim();
    }

    if (!answerToSubmit || answerToSubmit === '[]' || answerToSubmit === '["","",""]') return;

    dispatch(setAnswer(answerToSubmit));

    const result = validateAnswer(currentPuzzle, answerToSubmit);
    const elapsed = Math.round((Date.now() - startTime) / 1000);

    dispatch(completePuzzle({ isCorrect: result.isCorrect, timeTaken: elapsed }));
  }, [currentPuzzle, puzzleType, localAnswer, gridAnswers, isCompleted, startTime, dispatch]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isCompleted) {
      handleSubmit();
    }
  };

  if (!currentPuzzle) {
    return (
      <BoardContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="py-12">
          <div className="text-6xl mb-4">🧩</div>
          <p className="text-text-muted text-lg">Loading puzzle...</p>
        </div>
      </BoardContainer>
    );
  }

  const renderPuzzleContent = () => {
    switch (puzzleType) {
      case 'sequence':
        return (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {(currentPuzzle.displaySequence || []).map((num, i) => (
                <SequenceItem
                  key={i}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1, type: 'spring' }}
                >
                  {num}
                </SequenceItem>
              ))}
              <QuestionMark
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                ?
              </QuestionMark>
            </div>
            <div className="flex items-center justify-center gap-3">
              <InputField
                ref={inputRef}
                type="text"
                value={localAnswer}
                onChange={(e) => setLocalAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter the next number"
                disabled={isCompleted}
                id="puzzle-input"
              />
            </div>
          </div>
        );

      case 'pattern':
        return (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {(currentPuzzle.displayPattern || []).map((item, i) => (
                <SequenceItem
                  key={i}
                  initial={{ opacity: 0, rotateY: 90 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  transition={{ delay: i * 0.08, type: 'spring' }}
                >
                  {item}
                </SequenceItem>
              ))}
              <QuestionMark
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                ?
              </QuestionMark>
            </div>
            <div className="flex items-center justify-center gap-3">
              <InputField
                ref={inputRef}
                type="text"
                value={localAnswer}
                onChange={(e) => setLocalAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter the next element"
                disabled={isCompleted}
                id="puzzle-input"
              />
            </div>
          </div>
        );

      case 'syllogism':
        return (
          <div className="space-y-6">
            <div className="space-y-3 max-w-lg mx-auto">
              {(currentPuzzle.premises || []).map((premise, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2 }}
                  className="p-3 rounded-xl text-sm"
                  style={{
                    background: 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                  }}
                >
                  <span className="text-primary-light font-semibold mr-2">Premise {i + 1}:</span>
                  {premise}
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="p-3 rounded-xl text-sm"
                style={{
                  background: 'rgba(244, 114, 182, 0.1)',
                  border: '1px solid rgba(244, 114, 182, 0.2)',
                }}
              >
                <span className="text-accent font-semibold mr-2">Conclusion:</span>
                {currentPuzzle.conclusion}
              </motion.div>
            </div>
            <div className="flex items-center justify-center gap-4">
              {(currentPuzzle.options || ['valid', 'invalid']).map((option) => (
                <OptionButton
                  key={option}
                  $selected={localAnswer === option}
                  onClick={() => setLocalAnswer(option)}
                  disabled={isCompleted}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  id={`option-${option}`}
                >
                  {option}
                </OptionButton>
              ))}
            </div>
          </div>
        );

      case 'logicGrid':
        return (
          <div className="space-y-6">
            <div className="space-y-2 max-w-lg mx-auto">
              {(currentPuzzle.clues || []).map((clue, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="p-2.5 rounded-lg text-sm"
                  style={{
                    background: 'rgba(99, 102, 241, 0.08)',
                    border: '1px solid rgba(99, 102, 241, 0.15)',
                  }}
                >
                  <span className="text-primary-light font-semibold mr-2">{i + 1}.</span>
                  {clue}
                </motion.div>
              ))}
            </div>
            <div className="space-y-3 max-w-sm mx-auto">
              {(currentPuzzle.gridEntities || []).map((entity) => (
                <div key={entity} className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-text w-20">{entity}</span>
                  <GridCell
                    value={gridAnswers[entity] || ''}
                    onChange={(e) =>
                      setGridAnswers((prev) => ({ ...prev, [entity]: e.target.value }))
                    }
                    disabled={isCompleted}
                    id={`grid-${entity.toLowerCase()}`}
                  >
                    <option value="">Select...</option>
                    {(currentPuzzle.gridAttributes || []).map((attr) => (
                      <option key={attr} value={attr}>
                        {attr}
                      </option>
                    ))}
                  </GridCell>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <p className="text-text-muted whitespace-pre-line">{currentPuzzle.question}</p>
            <InputField
              ref={inputRef}
              type="text"
              value={localAnswer}
              onChange={(e) => setLocalAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Your answer"
              disabled={isCompleted}
              id="puzzle-input"
            />
          </div>
        );
    }
  };

  return (
    <BoardContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3"
          style={{
            background: 'rgba(99, 102, 241, 0.15)',
            color: '#818cf8',
            border: '1px solid rgba(99, 102, 241, 0.25)',
          }}
        >
          {currentPuzzle.puzzleTypeName}
          {currentPuzzle.difficulty && (
            <span className="ml-1 opacity-70">• {currentPuzzle.difficulty}</span>
          )}
        </div>
        <PuzzleTitle>{currentPuzzle.puzzleTypeName} Challenge</PuzzleTitle>
      </div>

      {renderPuzzleContent()}

      {!isCompleted && (
        <div className="flex justify-center mt-6">
          <SubmitButton
            onClick={handleSubmit}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            id="puzzle-submit"
          >
            Submit Answer
          </SubmitButton>
        </div>
      )}

      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 p-4 rounded-xl text-center"
            style={{
              background: puzzle.isCorrect
                ? 'rgba(52, 211, 153, 0.1)'
                : 'rgba(248, 113, 113, 0.1)',
              border: `1px solid ${
                puzzle.isCorrect
                  ? 'rgba(52, 211, 153, 0.3)'
                  : 'rgba(248, 113, 113, 0.3)'
              }`,
            }}
          >
            <div className="text-3xl mb-2">{puzzle.isCorrect ? '🎉' : '😔'}</div>
            <p
              className="font-semibold text-lg"
              style={{ color: puzzle.isCorrect ? '#34d399' : '#f87171' }}
            >
              {puzzle.isCorrect ? 'Correct!' : 'Incorrect'}
            </p>
            {currentPuzzle.explanation && (
              <p className="text-text-muted text-sm mt-2">{currentPuzzle.explanation}</p>
            )}
            {puzzle.score > 0 && (
              <p className="text-primary-light font-bold mt-2">Score: {puzzle.score}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </BoardContainer>
  );
}
