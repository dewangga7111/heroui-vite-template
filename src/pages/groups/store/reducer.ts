import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Group } from "@/types/groups";
import { TableFilter, TablePaging } from "@/types/table";

interface GroupsState {
  data: Group[];
  detail: Partial<Group>;
  params: TableFilter;
  paging: TablePaging;
  loading: boolean;
  success: boolean;
  error: string;
}

const initialState: GroupsState = {
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
  error: "",
};

const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setDetail: (state, action: PayloadAction<Partial<Group>>) => {
      state.detail = action.payload;
      state.loading = false;
    },
    setGroups: (
      state,
      action: PayloadAction<{
        data?: Group[];
        params?: TableFilter;
        paging?: TablePaging;
      }>
    ) => {
      if (action.payload.data !== undefined) state.data = action.payload.data;
      if (action.payload.params !== undefined) state.params = action.payload.params;
      if (action.payload.paging !== undefined) state.paging = action.payload.paging;
      state.loading = false;
      state.error = "";
    },
    errorGroups: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    successGroups: (state) => {
      state.success = true;
      state.loading = false;
    },
    resetGroups: (state) => {
      state.success = false;
      state.error = "";
    },
    clearGroups: () => initialState,
  },
});

export const {
  setLoading,
  setDetail,
  setGroups,
  successGroups,
  errorGroups,
  resetGroups,
  clearGroups,
} = groupsSlice.actions;
export default groupsSlice.reducer;
