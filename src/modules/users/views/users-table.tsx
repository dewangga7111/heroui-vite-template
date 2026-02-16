
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Datatable from "@/shared/components/data-table/datatable";
import Filter from "@/shared/components/filters/filter";
import constants from "@/shared/utils/constants";
import { TableColumnType, TableRowType } from "@/shared/types/table";
import { FilterField } from "@/shared/types/filter";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchUsers } from "@/modules/users/store/api";
import { useLoading } from "@/shared/hooks/useLoading";
import RenderCell from "./cells/render-cell";
import { clearUsers } from "@/modules/users/store/reducer";

export default function UsersPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const store = useSelector((state: RootState) => state.users);
  const isLoading = useLoading("users");

  const fields: FilterField[] = [
    { type: "input", key: "name", label: "Name" },
    {
      type: "autocomplete",
      key: "role",
      label: "Role",
      placeholder: "Select role",
      options: (store.data ?? []).map((opt) => ({
        label: opt.name,
        value: opt.name,
      })),
    },
    { type: "datepicker", key: "joinedAt", label: "Joined Date" },
    { type: "daterange", key: "activeRange", label: "Active Range" },
  ];

  const columns: TableColumnType[] = [
    { key: "action", label: "Action", width: 50, align: "center" },
    { key: "firstName", label: "Name", width: 200 },
    { key: "username", label: "Username" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
  ];

  const renderCell = (item: TableRowType, columnKey: React.Key) => (
    <RenderCell item={item} columnKey={columnKey} />
  );

  useEffect(() => {
    dispatch(fetchUsers({ ...store.params, ...store.paging }));

    return () => {
      dispatch(clearUsers());
    };
  }, [dispatch]);

  return (
    <div>
      <Filter
        fields={fields}
        onFilter={(data: any) => {
          dispatch(fetchUsers({ ...data, ...store.paging, page: 1 }));
        }}
        onClear={() => {
          dispatch(fetchUsers({ ...store.paging, page: 1 }));
        }}
      />
      <Datatable
        columns={columns}
        rows={store.data}
        renderCell={renderCell}
        loading={isLoading}
        page={store.paging.page!}
        totalPage={store.paging.totalPage!}
        totalRows={store.paging.totalRows!}
        onPageChange={(page: number) => {
          dispatch(fetchUsers({ ...store.params, ...store.paging, page }));
        }}
        doAdd={() => navigate(`${constants.path.USERS}/add`)}
      />
    </div>
  );
}
