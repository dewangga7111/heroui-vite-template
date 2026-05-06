import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@heroui/react";
import { PlusIcon } from "lucide-react";

import Datatable from "@/components/data-table/datatable";
import Filter from "@/components/filters/filter";
import { TableColumnType, TableRowType } from "@/types/table";
import { FilterField } from "@/types/filter";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchUsers } from "@/pages/users/store/api";
import { useLoading } from "@/hooks/useLoading";
import RenderCell from "./cells/render-cell";
import { clearUsers, resetUsers } from "@/pages/users/store/reducer";
import { showSuccessToast } from "@/utils/common";
import { button } from "@/components/primitives";

export default function UsersPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const store = useSelector((state: RootState) => state.users);
  const isLoading = useLoading("users");

  const fields: FilterField[] = [
    { type: "input", key: "name", label: "Name" },
  ];

  const columns: TableColumnType[] = [
    { key: "action", label: "Action", width: 50, align: "center" },
    { key: "name", label: "Name" },
    { key: "role_name", label: "Role" },
    { key: "nama_kota", label: "City" },
    { key: "supervisor_name", label: "Supervisor" },
  ];

  const renderCell = (item: TableRowType, columnKey: React.Key) => (
    <RenderCell item={item} columnKey={columnKey} />
  );

  useEffect(() => {
    dispatch(fetchUsers({ page: 1, limit: 10 }));
    return () => { dispatch(clearUsers()); };
  }, [dispatch]);

  useEffect(() => {
    if (store.success) {
      showSuccessToast("Data Deleted Successfully");
      dispatch(resetUsers());
    }
  }, [store.success]);

  return (
    <div>
      <Filter
        fields={fields}
        onFilter={(data: any) => dispatch(fetchUsers({ ...store.params, ...data, page: 1 }))}
        onClear={() => dispatch(fetchUsers({ page: 1, limit: store.params.limit || 10 }))}
      />
      <Datatable
        columns={columns}
        rows={store.data}
        renderCell={renderCell}
        loading={isLoading}
        page={store.paging.page!}
        totalPage={store.paging.totalPage!}
        totalRows={store.paging.totalRows!}
        onPageChange={(page: number) => dispatch(fetchUsers({ ...store.params, page }))}
        topContent={
          <div className="flex justify-end">
            <Button color="primary" className={button()} startContent={<PlusIcon size={16} />} onPress={() => navigate("/users/add")}>
              Add
            </Button>
          </div>
        }
      />
    </div>
  );
}
