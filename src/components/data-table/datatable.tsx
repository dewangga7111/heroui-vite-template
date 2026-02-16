
import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Spinner,
  Pagination,
  Button,
  Card,
  CardHeader,
  CardBody,
} from "@heroui/react";
import { DynamicTableProps, TableColumnType } from "@/types/table";
import { PlusIcon } from "lucide-react";
import { isMobile } from "react-device-detect";
import { button } from "@/components/primitives";

export default function Datatable({
  columns,
  rows,
  emptyContent = "No data available",
  loading = true,
  className = "",
  renderCell,
  page = 1,
  totalPage = 0,
  totalRows = 0,
  onPageChange,
  doAdd,
}: DynamicTableProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const finalColumns: TableColumnType[] = [
    { key: "no", label: "No", align: "center", width: 50 },
    ...columns,
  ];

  const topContent = React.useMemo(() => (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end gap-3 items-end">
        <Button onPress={doAdd} color="primary" className={button()} startContent={<PlusIcon />}>
          Add
        </Button>
      </div>
    </div>
  ), [doAdd]);

  const startRow = totalRows === 0 ? 0 : (page - 1) * 10 + 1;
  const endRow = Math.min(page * 10, totalRows);

  const bottomContent = React.useMemo(() => (
    <div className="flex w-full justify-between items-center px-2 max-sm:flex-col max-sm:justify-center">
      <p className="text-sm text-default-500 max-sm:mb-5">
        {totalRows > 0
          ? `Showing ${startRow}–${endRow} of ${totalRows} entries`
          : "No data to display"}
      </p>

      {totalPage > 0 ? (
        <Pagination
          showControls
          showShadow
          color="primary"
          page={page}
          total={totalPage}
          onChange={(v: number) => onPageChange?.(v)}
        />
      ) : (
        <div />
      )}
    </div>
  ), [page, totalPage, totalRows]);

  // 📱 Mobile card view
  const renderMobileCards = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-40">
          <Spinner size="lg" variant="wave" />
        </div>
      );
    }

    if (!rows || rows.length === 0) {
      return (
        <div className="w-full flex flex-col">
          <div className="mb-4">{topContent}</div>
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-center text-default-500">{emptyContent}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full">
        <div className="mb-4">{topContent}</div>
        <div className="flex flex-col gap-3">
          {rows.map((item, index) => {
            // separate action column
            const actionColumn = columns.find((col) => col.key === "action");

            return (
              <Card key={item.key || index} shadow="sm" className="p-3">
                <CardHeader className="flex justify-between items-center">
                  <p className="font-semibold text-sm">
                    #{(page - 1) * 10 + (index + 1)}
                  </p>
                  {actionColumn && (
                    <div>
                      {renderCell
                        ? renderCell(item, actionColumn.key)
                        : getKeyValue(item, actionColumn.key)}
                    </div>
                  )}
                </CardHeader>

                <CardBody className="grid grid-cols-1 gap-2 text-sm">
                  {columns
                    .filter((col) => col.key !== "action") // exclude action from body
                    .map((col) => (
                      <div key={col.key} className="flex justify-between">
                        <span className="font-bold">
                          {col.label}
                        </span>
                        <span className="text-right text-default-500 ">
                          {renderCell
                            ? renderCell(item, col.key)
                            : getKeyValue(item, col.key)}
                        </span>
                      </div>
                    ))}
                </CardBody>
              </Card>
            );
          })}
        </div>
        <div className="mt-4">{bottomContent}</div>
      </div>
    );
  };

  // 💻 Desktop table view
  const renderDesktopTable = () => (
    <Table topContent={topContent} bottomContent={bottomContent}>
      <TableHeader columns={finalColumns}>
        {(column) => (
          <TableColumn
            key={column.key}
            align={column.align}
            width={(column.width || "auto") as any}
          >
            {column.label}
          </TableColumn>
        )}
      </TableHeader>

      <TableBody
        items={rows}
        emptyContent={emptyContent}
        isLoading={loading}
        loadingContent={<Spinner size="lg" variant="wave" />}
      >
        {(item) => {
          const index = rows.indexOf(item);
          return (
            <TableRow key={item.key || index}>
              {(columnKey) => (
                <TableCell>
                  {columnKey === "no"
                    ? (page - 1) * 10 + (index + 1)
                    : renderCell
                      ? renderCell(item, columnKey)
                      : getKeyValue(item, columnKey)}
                </TableCell>
              )}
            </TableRow>
          );
        }}
      </TableBody>
    </Table>
  );

  if (!mounted) return null;

  return (
    <div className={className}>
      {isMobile ? renderMobileCards() : renderDesktopTable()}
    </div>
  );
}
