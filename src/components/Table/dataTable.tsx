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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

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
    const pages: number[] = [];
    const { pageIndex } = pagination;
    const startPage = Math.max(0, pageIndex - 2);
    const endPage = Math.min(pageCount - 1, pageIndex + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <>
      {showSearch && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 mb-4">
          <Search
            placeholder={searchPlaceholder}
            className="w-full px-4 py-2 border rounded-md"
            value={searchInput}
            onChange={handleSearchChange}
          />
          {canAddUser && (
            <Button
              className="w-full sm:w-auto sm:ml-4 bg-slate-700"
              onClick={onAddClick ? onAddClick : () => {}}
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
                  {headerGroup.headers.map((header) => {
                    const hideOnMobile = (header.column.columnDef.meta as any)?.hideOnMobile;
                    return (
                      <th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className={`py-2 px-3 sm:px-6 text-left text-sm font-semibold text-white uppercase tracking-wider cursor-pointer ${
                          hideOnMobile ? "hidden sm:table-cell" : ""
                        }`}
                      >
                        <div className="flex items-center">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getIsSorted() === "asc" ? (
                            <FaAngleUp className="ml-2" />
                          ) : header.column.getIsSorted() === "desc" ? (
                            <FaAngleDown className="ml-2" />
                          ) : (
                            ""
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>

            <tbody className="text-gray-700">
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={`${
                      row.getIsSelected() ? "bg-teal-100" : "hover:bg-gray-50"
                    } transition duration-150 ease-in-out`}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const hideOnMobile = (cell.column.columnDef.meta as any)?.hideOnMobile;
                      return (
                        <td
                          key={cell.id}
                          className={`py-2 px-3 sm:px-6 border-b border-gray-200 ${
                            hideOnMobile ? "hidden sm:table-cell" : ""
                          }`}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-10 text-center text-gray-500"
                  >
                    No se encuentran resultados con ese criterio de busqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <Pagination className="mt-6 justify-end px-2 sm:px-4 py-2">
          <PaginationContent>
            {/* Boton para la pagina anterior */}
            <PaginationPrevious
              onClick={() => {
                if (pagination.pageIndex > 0) {
                  handlePageChange(pagination.pageIndex - 1);
                }
              }}
              aria-disabled={pagination.pageIndex === 0}
              className={`cursor-pointer text-xs sm:text-sm text-slate-800 hover:text-slate-900 ${
                pagination.pageIndex === 0
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
            />

            {/* Numeros de paginas */}
            {renderPageNumbers().map((pageNumber, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  isActive={pageNumber === pagination.pageIndex}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`cursor-pointer text-slate-800 hover:text-slate-900 ${
                    pageNumber === pagination.pageIndex ? "font-bold" : ""
                  }`}
                >
                  {pageNumber + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            {/* Boton para la pagina siguiente */}
            <PaginationNext
              onClick={() => {
                if (pagination.pageIndex < pageCount - 1) {
                  handlePageChange(pagination.pageIndex + 1);
                }
              }}
              aria-disabled={pagination.pageIndex === pageCount - 1}
              className={`cursor-pointer text-xs sm:text-sm text-slate-800 hover:text-slate-900 ${
                pagination.pageIndex === pageCount - 1
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
            />
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
}
