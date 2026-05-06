import { AppDispatch } from "@/redux/store";
import { setLoading, setSession, setProfile, errorAuth, clearAuth } from "@/pages/auth/store/reducer";
import { UserProfile } from "@/utils/auth";

const simulateDelay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_CREDENTIALS = { username: "admin", password: "admin" };

const MOCK_PROFILE: UserProfile = {
  user: { id: 1, name: "John Doe", username: "admin", supervisor_id: null, supervisor_name: null },
  role: { id: 1, name: "Admin", access: [] },
};

export const login =
  (payload: { username: string; password: string }) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      await simulateDelay();

      if (
        payload.username === MOCK_CREDENTIALS.username &&
        payload.password === MOCK_CREDENTIALS.password
      ) {
        const expiredAt = new Date();
        expiredAt.setHours(expiredAt.getHours() + 8);
        dispatch(
          setSession({
            access_token: "mock-token-admin",
            expired_at: expiredAt.toISOString(),
            role: "admin",
            token_type: "Bearer",
          })
        );
      } else {
        dispatch(errorAuth("Invalid credentials. Try admin/admin"));
      }
    } catch (error: any) {
      dispatch(errorAuth(error.message || "Login failed"));
    }
  };

export const getProfile = () => async (dispatch: AppDispatch) => {
  await simulateDelay(300);
  dispatch(setProfile(MOCK_PROFILE));
};

export const logout = () => async (dispatch: AppDispatch) => {
  dispatch(clearAuth());
};
