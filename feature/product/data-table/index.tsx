"use client";
import { columns } from "./column";
import { DataTableToolbar } from "./toolbar";
import { DataTable } from "../../../ui/data-table";
import { getAllProduct } from "..";

export function ProductDataTable() {
  const data = getAllProduct();
  return (
    <DataTable columns={columns} data={data || []} Toolbar={DataTableToolbar} />
  );
}
