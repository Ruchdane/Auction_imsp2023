"use client";
import { columns } from "./column";
import { DataTableToolbar } from "./toolbar";
import { DataTable } from "../../../ui/data-table";
import { useState, useEffect } from "react";
import stockService from "../../../domain/services/stock.service";
import { useToast } from "../../../ui/use-toast";
import { Item } from "../../../domain/types/items";

function useItemsStock(userId: string) {
  const [items, setItems] = useState<Item[]>([]);
  const { toast } = useToast();

  useEffect(() => {
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
  }, []);
  return items;
}
export function ProductDataTable() {
  const [userId, setUserId] = useState("8OJY14mamOUHY2nWKK0q");
  const data = useItemsStock(userId);
  return (
    <DataTable columns={columns} data={data || []} Toolbar={DataTableToolbar} />
  );
}
// props.item.name = nameField;
// props.item.initial_price = priceField;
// props.item.quantity = quantityField;
// props.item.description = descriptionField;
// props.item.category = categoryType[categoryIndex ?? 0];
// console.log("disabled :", (nameField === props.item.name &&
//   priceField === props.item.initial_price &&
//   quantityField === props.item.quantity &&
//   descriptionField === props.item.description &&
//   categoryType[categoryIndex ?? 0] === props.item.category));
