"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../../../ui/data-table/column-header";

export const columns: ColumnDef<any>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nom" />
    ),
    filterFn: "includesString",
    enableColumnFilter: true,
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => <span>{row.getValue("name")}</span>,
  },
  {
    id: "count",
    accessorKey: "count",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantité" />
    ),
    filterFn: "includesString",
    enableColumnFilter: true,
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => <span>{row.getValue("count")}</span>,
  },
  {
    id: "price",
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prix" />
    ),
    enableColumnFilter: false,
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => <span>{row.getValue("price")}</span>,
  },

];
