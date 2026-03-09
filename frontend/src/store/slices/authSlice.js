// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginAPI, getMeAPI, logoutAPI } from '../../api/authAPI.js';

export const loginThunk = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const data = await loginAPI(credentials);
    localStorage.setItem('nec_token', data.token);
    return data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const getMeThunk = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    return await getMeAPI();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const logoutThunk = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await logoutAPI();
    localStorage.removeItem('nec_token');
  } catch (err) {
    localStorage.removeItem('nec_token');
    return rejectWithValue(err.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:        null,
    token:       localStorage.getItem('nec_token') || null,
    isLoading:   false,
    isMeLoading: !!localStorage.getItem('nec_token'),
    error:       null,
 },
  reducers: {
    clearAuthError: (state) => { state.error = null; },
    updateStudentProfile: (state, action) => {
      if (state.user?.profile) {
        state.user.profile = { ...state.user.profile, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginThunk.pending,   (state) => { state.isLoading = true;  state.error = null; })
      .addCase(loginThunk.fulfilled, (state, action) => {
        console.log("LOGIN RESPONSE:", action.payload);
      
        state.isLoading = false;
        state.user      = action.payload.data.user;
        state.token     = action.payload.token;
      
        localStorage.setItem("role", action.payload.data.user.role);
      })
      .addCase(loginThunk.rejected,  (state, action) => { state.isLoading = false; state.error = action.payload; })
      // getMe
      .addCase(getMeThunk.pending,   (state) => { state.isMeLoading = true; })
      .addCase(getMeThunk.fulfilled, (state, action) => {
        state.isMeLoading = false;
        state.user        = action.payload.data.user;
      })
      .addCase(getMeThunk.rejected,  (state) => {
        state.isMeLoading = false;
        state.user        = null;
        state.token       = null;
        localStorage.removeItem('nec_token');
      })
      // logout
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user  = null;
        state.token = null;
      });
  },
});

export const { clearAuthError, updateStudentProfile } = authSlice.actions;
export default authSlice.reducer;