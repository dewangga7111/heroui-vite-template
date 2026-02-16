
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Datatable from "@/components/data-table/datatable";
import Filter from "@/components/filters/filter";
import constants from "@/utils/constants";
import { TableColumnType, TableRowType } from "@/types/table";
import { FilterField } from "@/types/filter";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchRoles } from "@/pages/roles/store/api";
import { useLoading } from "@/hooks/useLoading";
import RenderCell from "./cells/render-cell";
import { clearRoles } from "@/pages/roles/store/reducer";

export default function RolesPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const store = useSelector((state: RootState) => state.roles);
  const isLoading = useLoading("roles");

  const fields: FilterField[] = [
    { type: "input", key: "role_name", label: "Name" },
  ];

  const columns: TableColumnType[] = [
    { key: "action", label: "Action", width: 50, align: "center" },
    { key: "role_name", label: "Name", width: 200 },
    { key: "description", label: "Description" },
  ];

  const renderCell = (item: TableRowType, columnKey: React.Key) => (
    <RenderCell item={item} columnKey={columnKey} />
  );

  useEffect(() => {
    dispatch(fetchRoles({ ...store.params, ...store.paging }));

    return () => {
      dispatch(clearRoles());
    };
  }, [dispatch]);

  return (
    <div>
      <Filter
        fields={fields}
        onFilter={(data: any) => {
          dispatch(fetchRoles({ ...data, ...store.paging, page: 1 }));
        }}
        onClear={() => {
          dispatch(fetchRoles({ ...store.paging, page: 1 }));
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
          dispatch(fetchRoles({ ...store.params, ...store.paging, page }));
        }}
        doAdd={() => navigate(`${constants.path.ROLES}/add`)}
      />
    </div>
  );
}
