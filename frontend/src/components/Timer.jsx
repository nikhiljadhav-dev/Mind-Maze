import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const TimerContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  background: linear-gradient(145deg, rgba(42, 39, 64, 0.7), rgba(30, 27, 46, 0.9));
  border: 1px solid rgba(99, 102, 241, 0.15);
  border-radius: 1rem;
  backdrop-filter: blur(10px);
`;

const TimeDisplay = styled.span`
  font-family: 'Inter', monospace;
  font-weight: 700;
  font-size: 1.75rem;
  letter-spacing: 0.05em;
  background: linear-gradient(135deg, #e2e0f0, #818cf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Dot = styled(motion.div)`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(props) => (props.$active ? '#34d399' : '#f87171')};
  box-shadow: 0 0 8px ${(props) => (props.$active ? 'rgba(52, 211, 153, 0.5)' : 'rgba(248, 113, 113, 0.5)')};
`;

export default function Timer({ isRunning = true, onTick }) {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          const next = prev + 1;
          if (onTick) onTick(next);
          return next;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, onTick]);

  useEffect(() => {
    if (!isRunning && intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [isRunning]);

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (seconds > 180) return '#f87171';
    if (seconds > 120) return '#fbbf24';
    return '#34d399';
  };

  return (
    <TimerContainer
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      id="puzzle-timer"
    >
      <Dot
        $active={isRunning}
        animate={isRunning ? { scale: [1, 1.3, 1] } : {}}
        transition={{ repeat: Infinity, duration: 1.5 }}
      />
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-widest font-medium" style={{ color: '#9b97b8' }}>
          Time
        </span>
        <TimeDisplay style={{ color: getTimerColor() }}>{formatTime(seconds)}</TimeDisplay>
      </div>
      {seconds > 120 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{
            background: 'rgba(251, 191, 36, 0.15)',
            color: '#fbbf24',
          }}
        >
          Hurry!
        </motion.div>
      )}
    </TimerContainer>
  );
}
