"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Search } from "../ui/search";
import Link from "next/link";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  showSearch?: boolean;
  searchPlaceholder?: string;
  addLinkPath?: string;
  addLinkText?: string;
  pageSizes?: number;
  searchColumn?: string;
  canAddUser?: boolean;
  customFilter?: (data: TData, query: string) => boolean;
  onAddClick?: () => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  showSearch = false,
  searchPlaceholder = "",
  addLinkPath = "/",
  addLinkText = "Agregar",
  searchColumn = "name",
  customFilter,
  canAddUser = true,
  pageSizes,
  onAddClick,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: pageSizes || 16,
  });
  const [searchInput, setSearchInput] = React.useState("");

  const filteredData = React.useMemo(() => {
    if (customFilter && searchInput) {
      return data.filter((item) => customFilter(item, searchInput));
    }
    return data;
  }, [data, customFilter, searchInput]);

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      pagination,
    },
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const pageCount = table.getPageCount();

  const handlePageChange = (pageIndex: number) => {
    setPagination((current) => ({
      ...current,
      pageIndex,
    }));
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 0; i < pageCount; i++) {
      pages.push(
        <Button
          key={i}
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(i)}
          className={`transition duration-150 ease-in-out ${pagination.pageIndex === i
            ? "bg-slate-700 text-white"
            : "bg-white text-slate-500"
            } hover:bg-slate-500 hover:text-white focus:outline-none mx-1`}
        >
          {i + 1}
        </Button>
      );
    }
    return pages;
  };

  return (
    <>
      {showSearch && (
        <div className="flex items-center mb-4 ">
          <Search
            placeholder={searchPlaceholder}
            className="w-full px-4 py-2 border rounded-md"
            value={searchInput}
            onChange={handleSearchChange}
          />
          {canAddUser && (
            <Button
              className="ml-4 bg-slate-700"
              onClick={onAddClick ? onAddClick : () => { }}
            >
              <Link href={addLinkPath}>{addLinkText}</Link>
            </Button>
          )}
        </div>
      )}
      <div className="rounded-lg overflow-hidden shadow-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-slate-700">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="py-2 px-6 text-left text-sm font-semibold text-white uppercase tracking-wider cursor-pointer"
                    >
                      <div className="flex items-center">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getIsSorted() === "asc" ? (
                          <FaAngleUp  className="ml-2" />
                        ) : header.column.getIsSorted() === "desc" ? (
                          <FaAngleDown className="ml-2" />
                        ) : (
                          ""
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>


            <tbody className="text-gray-700">
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={`${row.getIsSelected() ? "bg-teal-100" : "hover:bg-gray-50"
                      } transition duration-150 ease-in-out`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="py-2 px-6 border-b border-gray-200"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-10 text-center text-gray-500"
                  >
                    No se encuentran resultados con ese criterio de búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-center space-x-2 py-4">
        {renderPageNumbers()}
      </div>
    </>
  );
}
