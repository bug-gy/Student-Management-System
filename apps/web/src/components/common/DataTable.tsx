import React from "react";
import { Table } from "../ui/Table";
import { Pagination } from "../ui/Pagination";

interface DataTableProps<T> {
  columns: { key: string; header: string; render?: (item: T) => React.ReactNode }[];
  data: T[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export const DataTable = <T extends Record<string, any>>({
  columns,
  data,
  page,
  totalPages,
  onPageChange,
  onRowClick,
  isLoading,
  emptyMessage,
}: DataTableProps<T>) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <Table columns={columns} data={data} onRowClick={onRowClick} isLoading={isLoading} emptyMessage={emptyMessage} />
      <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
};
