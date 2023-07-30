import { useMemo, useState } from "react";
import { Item } from "../../../domain/types/items";
import { Button } from "../../../ui/button";
import { DeleteItemDto } from "../../../domain/dto/deleteItem.dto";
import { useToast } from "../../../ui/use-toast";
import itemService from "../../../domain/services/item.service";

interface itemObj {
  item: Item;
}
export default function DeleteItem(props: itemObj) {
  const [isLoading, setIsloading] = useState(false);
  const {toast} = useToast();
  const [disabled, setDisabled] = useState(false);
 

  async function handleSubmit(e: any): Promise<void> {
    e.preventDefault();
    setIsloading(() => true);

    const dto:DeleteItemDto = {
      itemId:props.item.id
    }
    const response = await itemService.deleteItem(dto);
    if (response.success) {
      toast({
        title: "Success",
        description: `L'article a été supprimé avec succès!`,
        variant:"default"
      });
      setDisabled(true);
    } else {
      toast({
        title: "Error",
        description: `${response.message}`,
        variant:"destructive"
      });
    }
    setIsloading(false);
  }
  return (
    <div className="text-primary flex flex-col justify-center items-center h-full gap-6 max-w-60">
      <h2 className="text-3xl font-bold">Supprimer un article</h2>
      <div className="flex flex-col gap-4">
        <div className="mb-2">
          <label> Etes vous sur de vouloir supprimer: </label>
          
          <p className="truncate text-3xl text-primary">{props.item.name}</p>
         
        </div>
        <Button
          isLoading={isLoading}
          disabled={disabled}
          onClick={handleSubmit}
          type="submit"
          className="w-80"
        >
          Supprimer
        </Button>
      </div>
    </div>
  );
}
