import { AppDispatch, RootState } from "@/redux/store";
import { setLoading, setDetail, setUsers, errorUsers, successUsers } from "@/pages/users/store/reducer";
import { TableFilter } from "@/types/table";
import { usersList, UserItem } from "@/dummy/users";

const simulateDelay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export const getUserById =
  (user_id: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      await simulateDelay();
      const user = usersList.find((u) => u.user_id === user_id);
      if (user) {
        dispatch(setDetail(user));
      } else {
        dispatch(errorUsers("User not found"));
      }
    } catch (error: any) {
      dispatch(errorUsers(error.message || "Failed to fetch user"));
    }
  };

export const fetchUsers =
  (param: TableFilter) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      await simulateDelay();

      const limit = param.limit || 10;
      const page = param.page || 1;
      const skip = (page - 1) * limit;

      const filtered = param.name
        ? usersList.filter((u) => u.name.toLowerCase().includes((param.name as string).toLowerCase()))
        : usersList;

      const paged = filtered.slice(skip, skip + limit);

      dispatch(
        setUsers({
          data: paged,
          params: param,
          paging: {
            page,
            totalPage: Math.ceil(filtered.length / limit),
            totalRows: filtered.length,
            limit,
          },
        })
      );
    } catch (error: any) {
      dispatch(errorUsers(error.message || "Failed to fetch users"));
    }
  };

export const createUser =
  (user: Omit<UserItem, "user_id">) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      await simulateDelay();

      const newUser: UserItem = {
        user_id: usersList.length ? Math.max(...usersList.map((u) => u.user_id)) + 1 : 1,
        ...user,
      };
      usersList.push(newUser);
      dispatch(successUsers());
    } catch (error: any) {
      dispatch(errorUsers(error.message || "Failed to create user"));
    }
  };

export const updateUser =
  (user: Partial<UserItem> & { user_id: number }) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      await simulateDelay();

      const idx = usersList.findIndex((u) => u.user_id === user.user_id);
      if (idx !== -1) Object.assign(usersList[idx], user);
      dispatch(successUsers());
    } catch (error: any) {
      dispatch(errorUsers(error.message || "Failed to update user"));
    }
  };

export const deleteUser =
  (user_id: number) => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      dispatch(setLoading(true));
      await simulateDelay();

      const idx = usersList.findIndex((u) => u.user_id === user_id);
      if (idx !== -1) usersList.splice(idx, 1);
      dispatch(successUsers());

      const state = getState();
      dispatch(fetchUsers(state.users.params));
    } catch (error: any) {
      dispatch(errorUsers(error.message || "Failed to delete user"));
    }
  };
