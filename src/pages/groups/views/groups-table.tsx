import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Datatable from "@/components/data-table/datatable";
import Filter from "@/components/filters/filter";
import { TableColumnType, TableRowType } from "@/types/table";
import { FilterField } from "@/types/filter";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchGroups } from "@/pages/groups/store/api";
import { useLoading } from "@/hooks/useLoading";
import { clearGroups } from "@/pages/groups/store/reducer";
import RenderCell from "./cells/render-cell";

export default function GroupsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const store = useSelector((state: RootState) => state.groups);
  const isLoading = useLoading("groups");

  const fields: FilterField[] = [
    { type: "input", key: "group_name", label: "Group Name" },
    {
      type: "autocomplete",
      key: "category",
      label: "Category",
      placeholder: "Select category",
      options: [
        { label: "Minimarket", value: "minimarket" },
        { label: "Supermarket", value: "supermarket" },
        { label: "Hypermarket", value: "hypermarket" },
        { label: "Convenience Store", value: "convenience_store" },
        { label: "Toko Kelontong", value: "toko_kelontong" },
        { label: "Toko Grosir", value: "toko_grosir" },
        { label: "Apotek", value: "apotek" },
        { label: "Toko Elektronik", value: "toko_elektronik" },
        { label: "Toko Pakaian", value: "toko_pakaian" },
        { label: "Toko Alat Tulis", value: "toko_alat_tulis" },
      ],
    },
  ];

  const columns: TableColumnType[] = [
    { key: "action", label: "Action", width: 50, align: "center" },
    { key: "group_name", label: "Group Name", width: 250 },
    { key: "category", label: "Category" },
  ];

  const renderCell = (item: TableRowType, columnKey: React.Key) => (
    <RenderCell item={item} columnKey={columnKey} />
  );

  useEffect(() => {
    dispatch(fetchGroups({ ...store.params, ...store.paging }));
    return () => {
      dispatch(clearGroups());
    };
  }, [dispatch]);

  return (
    <div>
      <Filter
        fields={fields}
        onFilter={(data: any) => {
          dispatch(fetchGroups({ ...data, ...store.paging, page: 1 }));
        }}
        onClear={() => {
          dispatch(fetchGroups({ ...store.paging, page: 1 }));
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
          dispatch(fetchGroups({ ...store.params, ...store.paging, page }));
        }}
        doAdd={() => navigate("/groups/add")}
      />
    </div>
  );
}
