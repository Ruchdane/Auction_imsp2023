"use client";
import { columns } from "./column";
import { DataTableToolbar } from "./toolbar";
import { DataTable } from "../../../ui/data-table";

export function ProductDataTable() {
  const data: any[] = [{
    name: "My Product",
    count: 2,
    price: 10
  }];
  return (
    <DataTable columns={columns} data={data || []} Toolbar={DataTableToolbar} />
  );
}
