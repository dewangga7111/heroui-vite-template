import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/pages/auth/store/reducer";
import usersReducer from "@/pages/users/store/reducer";
import rolesReducer from "@/pages/roles/store/reducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    roles: rolesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
