// src/redux/slices/users-slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types/users";
import { TableFilter, TablePaging } from "@/types/table";

interface UsersState {
  data: User[];
  detail: Partial<User>;
  params: TableFilter;
  paging: TablePaging;
  loading: boolean;
  success: boolean;
  error: string;
}

const initialState: UsersState = {
  data: [],
  detail: {},
  params: {},
  paging: {
    page: 1,
    totalPage: 1,
    totalRows: 0,
    limit: 10,
  },
  loading: false,
  success: false,
  error: '',
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setDetail: (state, action: PayloadAction<Partial<User>>) => {
      state.detail = action.payload;
      state.loading = false;
    },
    setUsers: (
      state,
      action: PayloadAction<{
        data?: User[],
        params?: TableFilter,
        paging?: TablePaging;
      }>
    ) => {
      if (action.payload.data !== undefined) {
        state.data = action.payload.data
      };
      if (action.payload.params !== undefined) state.params = action.payload.params;
      if (action.payload.paging !== undefined) state.paging = action.payload.paging;
      state.loading = false;
      state.error = '';
    },
    errorUsers: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    successUsers: (state) => {
      state.success = true;
      state.loading = false;
    },
    resetUsers: (state) => {
      state.success = false;
      state.error = '';
    },
    clearUsers: () => initialState,
  },
});

export const { setLoading, setDetail, setUsers, successUsers, errorUsers, resetUsers, clearUsers } = usersSlice.actions;
export default usersSlice.reducer;