"use client";
import { columns } from "./column";
import { DataTableToolbar } from "./toolbar";
import { DataTable } from "../../../ui/data-table";
import { Stock } from "../../../domain/types/stock";
import { useState, useEffect } from "react";
import stockService from "../../../domain/services/stock.service";
import { useToast } from "../../../ui/use-toast";
//import { getAllProduct } from ".."

export function ProductDataTable() {
  console.log("Component rendered");
  //const data = getAllProduct();
  const { toast } = useToast();
  const [stock, setStock] = useState<Stock | null>(null);
  const [userId, setUserId] = useState("8OJY14mamOUHY2nWKK0q");
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await stockService.getStockUser(userId);
        if (response.success) {
          setStock(response.data);
        } else {
          // Handle error or show toast message
          toast({
            title: "Error",
            description: "L'extraction des articles du stock a échoué.",
          });
        }
        console.log(data);
      } catch (error) {
        // Handle error or show toast message
        console.error(error);
        toast({
          title: "Error",
          description: "Erreur côté serveur",
        });
      }
    };
    fetchStock();
  }, [toast]);

  useEffect(() => {
    if (stock && stock.items) {
      setData(stock.items);
      console.log(stock.items);
    }
  }, [stock]);

  return (
    <DataTable columns={columns} data={data || []} Toolbar={DataTableToolbar} />
  );
}
