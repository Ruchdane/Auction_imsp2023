"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../../../ui/data-table/column-header";
import { Item } from "../../../domain/types/items";
import { Modal, ModalBody, ModalTriger } from "../../../ui/modal";
import { Pencil, Trash } from "lucide-react";
import { useState } from "react";
import CreateItem from "../../../form/createitem";

export const columns: ColumnDef<Item>[] = [
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
  }, {
    header: "Actions",
    columns: [{
      id: "edit",
      header: "Modifier",
      accessorFn: row => row,
      cell(row) {
        const [isModalOpen, setIsModalOpen] = useState(false);
        let a = row.getValue()
        return <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
          <ModalTriger
            label="Metre a jour"
            icon={<Pencil size={24} />}
          />
          <ModalBody title="" isOpen={isModalOpen}>
            <CreateItem />
          </ModalBody>
        </Modal >
      }
    }, {
      id: "delete",
      header: "Supprimer",
      accessorFn: row => row,
      cell(row) {
        const [isModalOpen, setIsModalOpen] = useState(false);
        let a = row.getValue()
        return <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
          <ModalTriger
            label="Supprimer"
            icon={<Trash size={24} />}
          />
          <ModalBody title="" isOpen={isModalOpen}>
            <CreateItem />
          </ModalBody>
        </Modal >
      }
    }]
  },
];
