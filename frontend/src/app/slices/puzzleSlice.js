import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const submitScore = createAsyncThunk(
  'puzzle/submitScore',
  async ({ puzzleId, score, timeTaken, hintsUsed }, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      const res = await fetch(`${API_URL}/score/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ puzzleId, score, timeTaken, hintsUsed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submit failed');
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const puzzleSlice = createSlice({
  name: 'puzzle',
  initialState: {
    currentPuzzle: null,
    puzzleType: null,
    userAnswer: null,
    isCorrect: null,
    hintsUsed: 0,
    maxHints: 3,
    hintsRevealed: [],
    startTime: null,
    endTime: null,
    timeTaken: 0,
    score: 0,
    isCompleted: false,
    isSubmitting: false,
    submitError: null,
    submitResult: null,
  },
  reducers: {
    setPuzzle(state, action) {
      const { puzzle, puzzleType } = action.payload;
      state.currentPuzzle = puzzle;
      state.puzzleType = puzzleType;
      state.userAnswer = null;
      state.isCorrect = null;
      state.hintsUsed = 0;
      state.hintsRevealed = [];
      state.startTime = Date.now();
      state.endTime = null;
      state.timeTaken = 0;
      state.score = 0;
      state.isCompleted = false;
      state.submitError = null;
      state.submitResult = null;
    },
    setAnswer(state, action) {
      state.userAnswer = action.payload;
    },
    revealHint(state) {
      if (state.hintsUsed < state.maxHints && state.currentPuzzle) {
        const hints = state.currentPuzzle.hints || [];
        if (state.hintsUsed < hints.length) {
          state.hintsRevealed.push(hints[state.hintsUsed]);
          state.hintsUsed += 1;
        }
      }
    },
    completePuzzle(state, action) {
      const { isCorrect, timeTaken } = action.payload;
      state.isCorrect = isCorrect;
      state.endTime = Date.now();
      state.timeTaken = timeTaken;
      state.isCompleted = true;

      if (isCorrect) {
        let baseScore = 1000;
        const timePenalty = Math.min(timeTaken * 2, 500);
        const hintPenalty = state.hintsUsed * 100;
        state.score = Math.max(100, baseScore - timePenalty - hintPenalty);
      } else {
        state.score = 0;
      }
    },
    resetPuzzle(state) {
      state.currentPuzzle = null;
      state.puzzleType = null;
      state.userAnswer = null;
      state.isCorrect = null;
      state.hintsUsed = 0;
      state.hintsRevealed = [];
      state.startTime = null;
      state.endTime = null;
      state.timeTaken = 0;
      state.score = 0;
      state.isCompleted = false;
      state.submitError = null;
      state.submitResult = null;
    },
    setResult(state, action) {
      state.submitResult = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitScore.pending, (state) => {
        state.isSubmitting = true;
        state.submitError = null;
      })
      .addCase(submitScore.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.submitResult = action.payload;
      })
      .addCase(submitScore.rejected, (state, action) => {
        state.isSubmitting = false;
        state.submitError = action.payload || 'Failed to submit score';
      });
  },
});

export const { setPuzzle, setAnswer, revealHint, completePuzzle, resetPuzzle, setResult } =
  puzzleSlice.actions;
export default puzzleSlice.reducer;
