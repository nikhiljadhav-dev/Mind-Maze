import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import dayjs from 'dayjs';

const HeatmapGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 3px;
`;

const DayCell = styled(motion.div)`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 4px;
  cursor: default;
  position: relative;
`;

const INTENSITY_COLORS = [
  'rgba(99,102,241,0.05)',
  'rgba(99,102,241,0.2)',
  'rgba(99,102,241,0.4)',
  'rgba(99,102,241,0.6)',
  'rgba(99,102,241,0.85)',
];

function getIntensity(score) {
  if (!score) return 0;
  if (score < 200) return 1;
  if (score < 500) return 2;
  if (score < 800) return 3;
  return 4;
}

export default function Heatmap({ data = [], weeks = 12 }) {
  const grid = useMemo(() => {
    const totalDays = weeks * 7;
    const today = dayjs().startOf('day');
    const startDate = today.subtract(totalDays - 1, 'day');
    const dataMap = {};
    data.forEach((d) => {
      const key = dayjs(d.date).format('YYYY-MM-DD');
      dataMap[key] = d.score || 0;
    });
    const cells = [];
    for (let i = 0; i < totalDays; i++) {
      const date = startDate.add(i, 'day');
      const key = date.format('YYYY-MM-DD');
      cells.push({ date: key, score: dataMap[key] || 0, dayLabel: date.format('MMM D') });
    }
    return cells;
  }, [data, weeks]);

  return (
    <div id="heatmap" className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-text-muted">Activity</h3>
        <div className="flex items-center gap-1 text-[10px] text-text-muted">
          <span>Less</span>
          {INTENSITY_COLORS.map((c, i) => (
            <div key={i} className="w-3 h-3 rounded-sm" style={{ background: c }} />
          ))}
          <span>More</span>
        </div>
      </div>
      <HeatmapGrid>
        {grid.map((cell, i) => (
          <DayCell
            key={cell.date}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.003 }}
            style={{ background: INTENSITY_COLORS[getIntensity(cell.score)] }}
            title={`${cell.dayLabel}: ${cell.score} pts`}
          />
        ))}
      </HeatmapGrid>
    </div>
  );
}
