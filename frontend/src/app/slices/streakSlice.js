import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const fetchLeaderboard = createAsyncThunk(
  'streak/fetchLeaderboard',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/leaderboard/daily`);
      if (!res.ok) throw new Error('Failed to fetch leaderboard');
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const streakSlice = createSlice({
  name: 'streak',
  initialState: {
    currentStreak: 0,
    lastPlayedDate: null,
    leaderboard: [],
    leaderboardLoading: false,
    leaderboardError: null,
  },
  reducers: {
    updateStreak(state, action) {
      const { streakCount, lastPlayed } = action.payload;
      state.currentStreak = streakCount;
      state.lastPlayedDate = lastPlayed;
    },
    checkAndResetStreak(state) {
      if (state.lastPlayedDate) {
        const last = dayjs(state.lastPlayedDate).startOf('day');
        const today = dayjs().startOf('day');
        const diffDays = today.diff(last, 'day');

        if (diffDays > 1) {
          state.currentStreak = 0;
        }
      }
    },
    incrementStreak(state) {
      const today = dayjs().startOf('day').toISOString();

      if (state.lastPlayedDate) {
        const last = dayjs(state.lastPlayedDate).startOf('day');
        const todayDate = dayjs().startOf('day');
        const diffDays = todayDate.diff(last, 'day');

        if (diffDays === 1) {
          state.currentStreak += 1;
        } else if (diffDays > 1) {
          state.currentStreak = 1;
        }
      } else {
        state.currentStreak = 1;
      }

      state.lastPlayedDate = today;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.leaderboardLoading = true;
        state.leaderboardError = null;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.leaderboardLoading = false;
        state.leaderboard = action.payload.leaderboard || [];
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.leaderboardLoading = false;
        state.leaderboardError = action.payload || 'Failed to load leaderboard';
      });
  },
});

export const { updateStreak, checkAndResetStreak, incrementStreak } = streakSlice.actions;
export default streakSlice.reducer;
