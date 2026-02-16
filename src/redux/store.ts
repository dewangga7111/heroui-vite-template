import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "@/pages/users/store/reducer";
import rolesReducer from "@/pages/roles/store/reducer";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    roles: rolesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
