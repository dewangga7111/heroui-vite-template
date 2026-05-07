
import React, { useEffect, useState } from "react";
import { Table, Spinner, Pagination, Button, Card } from "@heroui/react";
import { DynamicTableProps, TableColumnType } from "@/types/table";
import { PlusIcon, ChevronLeft, ChevronRight } from "lucide-react";
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
  topContent: topContentProp,
}: DynamicTableProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const finalColumns: TableColumnType[] = [
    { key: "no", label: "No", align: "center", width: 50 },
    ...columns,
  ];

  const defaultTopContent = React.useMemo(() => (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end gap-3 items-end">
        <Button onPress={doAdd} variant="primary" className={button()}>
          <PlusIcon size={16} />
          Add
        </Button>
      </div>
    </div>
  ), [doAdd]);

  const topContent = topContentProp ?? (doAdd ? defaultTopContent : null);

  const startRow = totalRows === 0 ? 0 : (page - 1) * 10 + 1;
  const endRow = Math.min(page * 10, totalRows);

  const getPaginationPages = (current: number, total: number): (number | "...")[] => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | "...")[] = [1];
    if (current > 3) pages.push("...");
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i);
    }
    if (current < total - 2) pages.push("...");
    pages.push(total);
    return pages;
  };

  const bottomContent = React.useMemo(() => (
    <Pagination>
      <Pagination.Summary className="max-sm:self-center">
        {totalRows > 0
          ? `Showing ${startRow}–${endRow} of ${totalRows} entries`
          : "No data to display"}
      </Pagination.Summary>
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.Previous
            isDisabled={page <= 1}
            onPress={() => onPageChange?.(page - 1)}
          >
            <ChevronLeft size={16} />
          </Pagination.Previous>
        </Pagination.Item>
        {getPaginationPages(page, totalPage).map((p, idx) =>
          p === "..." ? (
            <Pagination.Item key={`ellipsis-${idx}`}>
              <span className="px-2 text-default-500">…</span>
            </Pagination.Item>
          ) : (
            <Pagination.Item key={p}>
              <Pagination.Link isActive={p === page} onPress={() => onPageChange?.(p as number)}>
                {p}
              </Pagination.Link>
            </Pagination.Item>
          )
        )}
        <Pagination.Item>
          <Pagination.Next
            isDisabled={page >= totalPage}
            onPress={() => onPageChange?.(page + 1)}
          >
            <ChevronRight size={16} />
          </Pagination.Next>
        </Pagination.Item>
      </Pagination.Content>
    </Pagination>
  ), [page, totalPage, totalRows]);

  const renderMobileCards = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-40">
          <Spinner size="lg" className="block size-8" />
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
            const actionColumn = columns.find((col) => col.key === "action");

            return (
              <Card key={(item as any).key || index} className="p-3">
                <Card.Header className="flex justify-between items-center">
                  <p className="font-semibold text-sm">
                    #{(page - 1) * 10 + (index + 1)}
                  </p>
                  {actionColumn && (
                    <div>
                      {renderCell
                        ? renderCell(item, actionColumn.key)
                        : (item as any)[actionColumn.key]}
                    </div>
                  )}
                </Card.Header>

                <Card.Content className="grid grid-cols-1 gap-2 text-sm">
                  {columns
                    .filter((col) => col.key !== "action")
                    .map((col) => (
                      <div key={col.key} className="flex justify-between">
                        <span className="font-bold">
                          {col.label}
                        </span>
                        <span className="text-right text-default-500">
                          {renderCell
                            ? renderCell(item, col.key)
                            : (item as any)[col.key]}
                        </span>
                      </div>
                    ))}
                </Card.Content>
              </Card>
            );
          })}
        </div>
        <div className="mt-4">{bottomContent}</div>
      </div>
    );
  };

  const renderDesktopTable = () => (
    <Card>
      <Card.Content>
        {topContent && <div className="mb-3">{topContent}</div>}
        <Table variant="secondary">
          <Table.Content>
            <Table.Header>
              {finalColumns.map((column) => (
                <Table.Column
                  key={column.key}
                  id={column.key}
                  style={{
                    textAlign: column.align,
                    width: column.width ? `${column.width}px` : undefined,
                  }}
                >
                  {column.label}
                </Table.Column>
              ))}
            </Table.Header>

            <Table.Body>
              {loading ? (
                <Table.Row>
                  <Table.Cell colSpan={finalColumns.length} className="text-center py-8">
                    <div className="flex justify-center">
                      <Spinner size="lg" />
                    </div>
                  </Table.Cell>
                </Table.Row>
              ) : rows.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={finalColumns.length} className="text-center py-8 text-default-500">
                    {emptyContent}
                  </Table.Cell>
                </Table.Row>
              ) : (
                rows.map((item, index) => (
                  <Table.Row key={(item as any).key || index}>
                    {finalColumns.map((column) => (
                      <Table.Cell key={column.key} style={{ textAlign: column.align }}>
                        {column.key === "no"
                          ? (page - 1) * 10 + (index + 1)
                          : renderCell
                            ? renderCell(item, column.key)
                            : (item as any)[column.key]}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Content>
        </Table>
        <div className="mt-3">{bottomContent}</div>
      </Card.Content>
    </Card>
  );

  if (!mounted) return null;

  return (
    <div className={className}>
      {isMobile ? renderMobileCards() : renderDesktopTable()}
    </div>
  );
}
