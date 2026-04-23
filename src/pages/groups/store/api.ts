import { apiClient } from "@/redux/api-client";
import { AppDispatch, RootState } from "@/redux/store";
import {
  setLoading,
  setDetail,
  setGroups,
  errorGroups,
  resetGroups,
  successGroups,
} from "@/pages/groups/store/reducer";
import { Group } from "@/types/groups";
import { TableFilter } from "@/types/table";
import { groupDummy } from "@/dummy/groups";

// TODO: set to false when API is ready
const USE_DUMMY = true;

export const getGroupById =
  (id: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      if (USE_DUMMY) {
        const item = groupDummy.find((g) => g.id === id) ?? {};
        dispatch(setDetail(item));
        return;
      }
      const response = await apiClient.get(`/groups/${id}`);
      dispatch(setDetail(response.data));
    } catch (error: any) {
      dispatch(errorGroups(error.response?.data?.message || error.message));
    }
  };

export const fetchGroups =
  (param: TableFilter) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      if (USE_DUMMY) {
        const page = param.page || 1;
        const limit = param.limit || 10;
        const start = (page - 1) * limit;
        dispatch(
          setGroups({
            data: groupDummy.slice(start, start + limit),
            params: { ...param },
            paging: {
              page,
              totalPage: Math.ceil(groupDummy.length / limit),
              totalRows: groupDummy.length,
              limit,
            },
          })
        );
        return;
      }
      const response = await apiClient.get("/groups", {
        params: { ...param, skip: ((param.page || 1) - 1) * (param.limit || 10) },
      });
      dispatch(
        setGroups({
          data: response.data?.groups,
          params: { ...param },
          paging: {
            page: param.page || 1,
            totalPage: Math.ceil(response.data?.total / (param.limit || 10)),
            totalRows: response.data?.total,
            limit: param.limit,
          },
        })
      );
    } catch (error: any) {
      dispatch(errorGroups(error.response?.data?.message || error.message));
    }
  };

export const createGroup =
  (group: Omit<Group, "id">) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      if (USE_DUMMY) {
        dispatch(successGroups());
        dispatch(resetGroups());
        return;
      }
      const response = await apiClient.post("/groups", group);
      if (response.status === 200) {
        dispatch(successGroups());
      } else {
        dispatch(errorGroups(response.data?.message || response.statusText));
      }
    } catch (error: any) {
      dispatch(errorGroups(error.response?.data?.message || error.message));
    } finally {
      dispatch(resetGroups());
    }
  };

export const updateGroup =
  (id: number, group: Partial<Group>) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      if (USE_DUMMY) {
        dispatch(successGroups());
        dispatch(resetGroups());
        return;
      }
      const response = await apiClient.put(`/groups/${id}`, group);
      if (response.status === 200) {
        dispatch(successGroups());
      } else {
        dispatch(errorGroups(response.data?.message || response.statusText));
      }
    } catch (error: any) {
      dispatch(errorGroups(error.response?.data?.message || error.message));
    } finally {
      dispatch(resetGroups());
    }
  };

export const deleteGroup =
  (id: number) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      dispatch(setLoading(true));
      if (USE_DUMMY) {
        dispatch(successGroups());
        const state = getState();
        const lastParams = (state.groups as any)?.params || {};
        dispatch(fetchGroups(lastParams));
        return;
      }
      const response = await apiClient.delete(`/groups/${id}`);
      if (response.status === 200) {
        dispatch(successGroups());
      } else {
        dispatch(errorGroups(response.data?.message || response.statusText));
      }
      const state = getState();
      const lastParams = (state.groups as any)?.params || {};
      dispatch(fetchGroups(lastParams));
    } catch (error: any) {
      dispatch(errorGroups(error.response?.data?.message || error.message));
    }
  };
