import { useMemo, useState, useEffect } from "react";
import { Button } from "../ui/button";
import { ComboBox } from "../ui/combobox";
import { useToast } from "../ui/use-toast";
import { CreateAuctionDto } from "../domain/dto/createAuction.dto";
import AuctionService from "../domain/services/auction.service";
import stockService from "../domain/services/stock.service";
import { Stock } from "../domain/types/stock";
import { useUser } from "../feature/auth";

function CreateAuction() {
  const { toast } = useToast();
  const [itemIndex, setItemIndex] = useState<number | null>(null);
  const [stock, setStock] = useState<Stock | null>(null);
  const [isLoading, setIsloading] = useState(false);
  const user = useUser();
  const userId = user ? user.id : "";
  const disabled = useMemo(() => {
    return itemIndex === null;
  }, [itemIndex]);

  useEffect(() => {
    if (userId != "") {
      const fetchStock = async () => {
        try {
          const response = await stockService.getStockUser(userId);
          if (response.success) {
            setStock(response.data);
          } else {
            toast({
              title: "Error",
              description: "L'extraction des articles du stock a échoué.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error(error);
          toast({
            title: "Error",
            description: "Erreur côté serveur",
          });
        }
      };
      fetchStock();
    }
  }, [toast, userId]);

  async function handleSubmit(e: any): Promise<void> {
    e.preventDefault();
    setIsloading(true);

    const selectedItem = stock?.items[itemIndex ?? 0]; // Get the selected item from the stock

    if (!selectedItem) {
      // Handle error or show toast message
      toast({
        title: "Error",
        description: "Please select an item.",
      });
      setIsloading(false);
      return;
    }

    const dto: CreateAuctionDto = {
      itemId: selectedItem.id,
      sellerId: userId,
    };

    // Make an API call to the backend to create the auction
    const response = await AuctionService.createAuction(dto);

    if (response.success) {
      toast({
        title: "Success",
        description: "L'enchère a été créée avec succès!",
        variant: "default",
      });
    } else {
      toast({
        title: "Error",
        description: response.message,
        variant: "destructive",
      });
    }
    setIsloading(false);
  }

  const itemType = useMemo(() => {
    return stock?.items.map((item) => item.name) || [];
  }, [stock]);

  return (
    <div className="text-primary flex flex-col justify-center items-center h-full gap-6 max-w-60">
      <h2 className="text-3xl font-bold">Créer enchère</h2>
      <div className="flex flex-col items-center gap-4 w-1/4">
        <div>
          <ComboBox
            values={itemType}
            index={itemIndex}
            placeholder="Article"
            onChange={(value) => setItemIndex(value)}
            label={(toast) => toast}
          />
        </div>

        <Button
          isLoading={isLoading}
          disabled={disabled}
          onClick={handleSubmit}
          type="submit"
          className="w-2/3"
        >
          Créer
        </Button>
      </div>
    </div>
  );
}

export default CreateAuction;
