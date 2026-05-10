import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import puzzleReducer from './slices/puzzleSlice';
import streakReducer from './slices/streakSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    puzzle: puzzleReducer,
    streak: streakReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['puzzle/setPuzzle', 'puzzle/setResult'],
        ignoredPaths: ['puzzle.startTime'],
      },
    }),
});

export default store;
