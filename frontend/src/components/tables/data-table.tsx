import React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
    getPaginationRowModel
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface DataTableProps<
    TData,
    TValue,
    BgValue,
    BorderColorValue,
    PaginationValue,
    FilteringValue
> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    bgColor: BgValue;
    borderColor: BorderColorValue;
    pagination: PaginationValue;
    filtering: FilteringValue;
}

export function DataTable<
    TData,
    TValue,
    BgValue,
    BorderColorValue,
    PaginationValue,
    FilteringValue
>({
    columns,
    data,
    bgColor,
    borderColor,
    pagination,
    filtering
}: DataTableProps<TData, TValue, BgValue, BorderColorValue, PaginationValue, FilteringValue>) {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters
        }
    });

    return (
        <>
            {filtering && (
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Filter senders..."
                        value={(table.getColumn("sender")?.getFilterValue() as string) ?? ""}
                        onChange={event =>
                            table.getColumn("sender")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm dark:border-[#ecebf069] dark:placeholder:text-[#f5f5f769]"
                    />
                </div>
            )}
            <div className={`rounded border ${borderColor} ${bgColor} text-white`}>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow className={`${borderColor}`} key={headerGroup.id}>
                                {headerGroup.headers.map(header => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow
                                    className={`${borderColor}`}
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {pagination && (
                <div className="flex items-center justify-end space-x-2 pt-4">
                    <Button
                        className="border-[#ecebf069] text-white"
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        className="border-[#ecebf069] text-white"
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            )}
        </>
    );
}
