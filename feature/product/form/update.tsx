import { useMemo, useState, useRef, ChangeEvent, useEffect } from "react";
import { Button } from "../../../ui/button";
import { Label } from "../../../ui/label";
import { Input } from "../../../ui/input";
import { ComboBox } from "../../../ui/combobox";
import { useToast } from "../../../ui/use-toast";
import { UpdateItemDto } from "../../../domain/dto/updateItem.dto";
import { Textarea } from "../../../ui/textarea";
import itemService from "../../../domain/services/item.service";
import { Item } from "../../../domain/types/items";

interface itemObj {
  item: Item;
}

function UpdateItem(props: itemObj) {
  const { toast } = useToast();
  const [nameField, setNameField] = useState(props.item.name);
  const [priceField, setPriceField] = useState(props.item.initial_price);
  const [quantityField, setQuantityField] = useState(props.item.quantity);
  const [descriptionField, setDescriptionField] = useState(props.item.description);
  const [imageField, setImageField] = useState<File | null>(null);
  const categoryType = ["Option 1", "Option 2", "Option 3"];
  const [categoryIndex, setCategoryIndex] = useState<number | null>(null);
 

  const [isLoading, setIsloading] = useState(false);
  const disabled = useMemo(() => {
    return (
      nameField === "" ||
      priceField < 0 ||
      quantityField < 0  ||
      descriptionField === "" ||
      imageField === null ||
      categoryIndex === null
    );
  }, [nameField, priceField, quantityField, descriptionField, categoryIndex, imageField]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // useEffect(() => {
  //   const fetchStock = async () => {
  //     try {
  //       const response = await itemService.(userId);
  //       if (response.success) {
  //         setStock(response.data);
  //       } else {
  //         // Handle error or show toast message
  //         toast({
  //           title: "Error",
  //           description: "L'extraction des articles du stock a échoué.",
  //         });
  //       }
  //     } catch (error) {
  //       // Handle error or show toast message
  //       console.error(error);
  //       toast({
  //         title: "Error",
  //         description: "Erreur côté serveur",
  //       });
  //     }
  //   };
  //   fetchStock();
  // }, [toast]);

  async function handleSubmit(e: any): Promise<void> {
    e.preventDefault();
    setIsloading(() => true);

    const dto:UpdateItemDto= {
      itemId: props.item.id,
    name: props.item.name,
    stockId: props.item.stockId,
    quantity:(props.item.quantity).toString(),
    category: props.item.category,
    description: props.item.description,
    initial_price: props.item.initial_price,
    imgUrl: props.item.imgUrl
    };

    // Make an API call to the backend to create the item
    const response = await itemService.updateItem(dto);

    if (response.success) {
      toast({
        title: "Success",
        description: `L'article a été ajouté avec succès!`,
      });
    } else {
      toast({
        title: "Error",
        description: `${response.message}`,
      });
    }
    setIsloading(false);
  }

  return (
    <div className="text-primary flex flex-col justify-center items-center h-full gap-6 max-w-60">
      <h2 className="text-3xl font-bold">Ajouter un produit</h2>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-4">
          <div>
            <div>
              <Label htmlFor="nameField"> Nom </Label>
              <Input
                value={nameField}
                onChange={(e) => setNameField(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="priceField"> Prix </Label>
              <Input
                type="number"
                min="0"
                value={priceField}
                onChange={(e) => setPriceField(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="quantityField"> Quantité </Label>
              <Input
                type="number"
                min="1"
                value={quantityField}
                onChange={(e) => setQuantityField(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="ImageField"> Image</Label>
              <div className="flex flex-row items-center">
                <Button onClick={() => fileInputRef.current?.click()}>
                  Choisir image
                </Button>
                <Input
                  onChange={(e) => setImageField(e.target.files?.[0] ?? null)}
                  accept="image/*"
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                />
                <span className="ml-2">{imageField?.name}</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex flex-col mb-4">
              <Label htmlFor="descriptionField"> Description </Label>
              <Textarea
                value={descriptionField}
                onChange={(e) => setDescriptionField(e.target.value)}
              />
            </div>
            <div>
              <ComboBox
                values={categoryType}
                index={categoryIndex}
                placeholder="Categories"
                onChange={(value) => setCategoryIndex(value)}
                label={(toast) => toast}
              />
            </div>
          </div>
        </div>
      </div>
      <Button
        isLoading={isLoading}
        disabled={disabled}
        onClick={handleSubmit}
        type="submit"
        className="w-80"
      >
        Modifier
      </Button>
    </div>
  );
}

export default UpdateItem;
