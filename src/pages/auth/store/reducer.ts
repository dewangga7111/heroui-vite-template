import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthSession, UserProfile, getAccessToken, setAuthSession, clearAuthSession } from "@/utils/auth";

interface AuthState {
  token: string;
  profile: UserProfile | null;
  loading: boolean;
  success: boolean;
  error: string;
}

const initialState: AuthState = {
  token: getAccessToken() || "",
  profile: null,
  loading: false,
  success: false,
  error: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSession: (state, action: PayloadAction<AuthSession>) => {
      state.token = action.payload.access_token;
      state.loading = false;
      state.success = true;
      setAuthSession(action.payload);
    },
    errorAuth: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    resetAuth: (state) => {
      state.success = false;
      state.error = "";
    },
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
    clearAuth: () => {
      clearAuthSession();
      return { ...initialState, token: "", profile: null };
    },
  },
});

export const { setLoading, setSession, setProfile, errorAuth, resetAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
