import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const loginWithGoogle = createAsyncThunk(
  'user/loginWithGoogle',
  async (credential, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
      });
      if (!res.ok) throw new Error('Google login failed');
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const loginWithTruecaller = createAsyncThunk(
  'user/loginWithTruecaller',
  async ({ accessToken, profile }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/auth/truecaller`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken, profile }),
      });
      if (!res.ok) throw new Error('Truecaller login failed');
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const loginAsGuest = createAsyncThunk(
  'user/loginAsGuest',
  async (_, { rejectWithValue }) => {
    try {
      let guestId = localStorage.getItem('logic_looper_guest_id');
      if (!guestId) {
        guestId = crypto.randomUUID();
        localStorage.setItem('logic_looper_guest_id', guestId);
      }
      const res = await fetch(`${API_URL}/auth/guest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestId }),
      });
      if (!res.ok) throw new Error('Guest login failed');
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      const res = await fetch(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch profile');
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const savedToken = localStorage.getItem('logic_looper_token');
const savedUser = localStorage.getItem('logic_looper_user');

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: savedUser ? JSON.parse(savedUser) : null,
    token: savedToken || null,
    isAuthenticated: !!savedToken,
    isGuest: localStorage.getItem('logic_looper_is_guest') === 'true',
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isGuest = false;
      state.error = null;
      localStorage.removeItem('logic_looper_token');
      localStorage.removeItem('logic_looper_user');
      localStorage.removeItem('logic_looper_is_guest');
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const handleLoginPending = (state) => {
      state.loading = true;
      state.error = null;
    };

    const handleLoginFulfilled = (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isGuest = false;
      localStorage.setItem('logic_looper_token', action.payload.token);
      localStorage.setItem('logic_looper_user', JSON.stringify(action.payload.user));
      localStorage.removeItem('logic_looper_is_guest');
    };

    const handleLoginRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Login failed';
    };

    builder
      .addCase(loginWithGoogle.pending, handleLoginPending)
      .addCase(loginWithGoogle.fulfilled, handleLoginFulfilled)
      .addCase(loginWithGoogle.rejected, handleLoginRejected)
      .addCase(loginWithTruecaller.pending, handleLoginPending)
      .addCase(loginWithTruecaller.fulfilled, handleLoginFulfilled)
      .addCase(loginWithTruecaller.rejected, handleLoginRejected)
      .addCase(loginAsGuest.pending, handleLoginPending)
      .addCase(loginAsGuest.fulfilled, (state, action) => {
        handleLoginFulfilled(state, action);
        state.isGuest = true;
        localStorage.setItem('logic_looper_is_guest', 'true');
      })
      .addCase(loginAsGuest.rejected, handleLoginRejected)
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload.user };
        localStorage.setItem('logic_looper_user', JSON.stringify(state.user));
      });
  },
});

export const { logout, clearError } = userSlice.actions;
export default userSlice.reducer;
