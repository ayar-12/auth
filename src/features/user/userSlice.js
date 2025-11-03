import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "localhost:3000";

const TOKEN_KEY = 'lifelab_auth_token';

const apiClient = axios.create({
  baseURL: API,
  withCredentials: true, 
});

const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem(TOKEN_KEY);
    delete axios.defaults.headers.common['Authorization'];

  }
};

const getAuthToken = () => localStorage.getItem(TOKEN_KEY);

const initializeAuth = () => {
  const token = getAuthToken();
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('✅ Auth initialized with stored token');
  }
};

initializeAuth();

const getMsg = (err, fallback) =>
  err?.response?.data?.message ||
  err?.response?.data?.error ||
  err?.message ||
  fallback;

const pickLangFromStorage = () => {
  try {
    const lng = (localStorage.getItem('i18nextLng') || 'en').toLowerCase();
    return lng.startsWith('ar') ? 'ar' : 'en';
  } catch {
    return 'en';
  }
};

export const login = createAsyncThunk(
  "user/login",
  async (creds, { rejectWithValue, dispatch }) => {
    try {
      const { email, password } = creds;
      const { data } = await apiClient.post('/api/v1/user/login', { email, password });

      if (data.token) {
        setAuthToken(data.token);
      } else {
   
        dispatch(loadUser());
      }
      return data;
    } catch (error) {
      return rejectWithValue({ message: getMsg(error, "Login failed. Please try again later.") });
    }
  }
);

export const register = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post('/api/v1/user/register', userData);
      
      if (data.token) {
        setAuthToken(data.token);
      }
      
      return data;
    } catch (error) {
      return rejectWithValue({ 
        message: getMsg(error, "Registration failed. Please try again later.") 
      });
    }
  }
);


export const loadUser = createAsyncThunk(
  "user/load",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/api/v1/user/profile');
      return data; 
    } catch (error) {
    
      if (error?.response?.status === 401) {
        setAuthToken(null);
      }
      return rejectWithValue({
        message: getMsg(error, "Failed to load user profile"),
        silent: true,
      });
    }
  }
);

const initialState = {
  user: null,
  loading: false,
  error: null,
  success: false,
  isAuthenticated: false,
  message: null,
  initialized: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    removeErrors: (state) => {
      state.error = null;
      state.quizError = null;
      state.quizHistoryError = null;
      state.emailVerificationError = null;
      state.resendVerificationError = null;
    },
    removeSuccess: (state) => {
      state.success = false;
      state.resendVerificationSuccess = false;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.success = false;
      state.error = null;
      state.initialized = true;
      state.quizHistory = [];
      state.quizResults = null;
      state.emailVerified = false;
      state.emailVerificationError = null;
      setAuthToken(null);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.initialized = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.success = Boolean(action.payload?.success);
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        state.initialized = true;
        state.message = action.payload?.message || "Registration successful! Please check your email.";
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Registration failed. Please try again later.";
        state.user = null;
        state.isAuthenticated = false;
        state.success = false;
        state.initialized = true;
      })

      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.initialized = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.success = Boolean(action.payload?.success);
        state.user = action.payload?.user || null;
        state.isAuthenticated = Boolean(action.payload?.user);
        state.error = null;
        state.initialized = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed. Please try again later.";
        state.user = null;
        state.isAuthenticated = false;
        state.success = false;
        state.initialized = true;
      })

    
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.user || null;
        state.isAuthenticated = Boolean(action.payload?.user);
        state.error = null;
        state.initialized = true;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        if (!action.payload?.silent) {
          state.error = action.payload?.message || "Failed to load user profile";
        }
        state.user = null;
        state.isAuthenticated = false;
        state.initialized = true;
      });
    
  },
});

export const { 
  removeErrors, 
  removeSuccess, 
  clearUser, 
} = userSlice.actions;

export { setAuthToken, getAuthToken, initializeAuth };

export default userSlice.reducer;
