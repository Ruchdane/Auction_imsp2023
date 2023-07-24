"use client";
import { columns } from "./column";
import { DataTableToolbar } from "./toolbar";
import { DataTable } from "../../../ui/data-table";

const data: any[] = Array.from(Array(100), _ => (
  {
    name: "My Product",
    count: 2,
    price: 10,
  }))
export function ProductDataTable() {

  return (
    <DataTable columns={columns} data={data || []} Toolbar={DataTableToolbar} />
  );
}
