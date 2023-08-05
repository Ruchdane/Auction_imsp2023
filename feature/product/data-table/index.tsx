"use client";
import { columns } from "./column";
import { DataTableToolbar } from "./toolbar";
import { DataTable } from "../../../ui/data-table";
import { useState, useEffect } from "react";
import stockService from "../../../domain/services/stock.service";
import { useToast } from "../../../ui/use-toast";
import { Item } from "../../../domain/types/items";
import { useUser } from "../../auth";

function useItemsStock(userId: string) {
  const [items, setItems] = useState<Item[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (userId != "") {
      const unsubscribe = stockService.listenStockUser(
        userId,
        (updatedStock, error) => {
          if (error) {
            toast({
              title: "Error",
              description: error,
              variant: "destructive",
            });
          } else {
            setItems(updatedStock ? updatedStock.items : []);
            console.log("updated items");
          }
        },
      );
      return () => {
        unsubscribe();
      };
    }
  }, []);
  return items;
}
export function ProductDataTable() {
  const user = useUser();
  const data = useItemsStock(user ? user.id : "");
  return (
    <DataTable columns={columns} data={data || []} Toolbar={DataTableToolbar} />
  );
}
