import { useMemo, useState, useRef, ChangeEvent } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ComboBox } from "../ui/combobox";
import { useToast } from "../ui/use-toast";
import { AddItemDto } from "../domain/dto/addItem.dto";
import { Textarea } from "../ui/textarea";
import itemService from "../domain/services/item.service";
import { storageApp } from "../domain/firebase/config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

function CreateItem() {
  const { toast } = useToast();
  const [nameField, setNameField] = useState("");
  const [priceField, setPriceField] = useState(0);
  const [quantityField, setQuantityField] = useState(1);
  const [descriptionField, setDescriptionField] = useState("");
  const [imageField, setImageField] = useState<File | null>(null);
  const categoryType = ["Option 1", "Option 2", "Option 3"];
  const [categoryIndex, setCategoryIndex] = useState<number | null>(null);
  const toastType = ["Error", "Warning", "Info"];
  const [toastIndex, setToastIndex] = useState<number | null>(null);

  const [isLoading, setIsloading] = useState(false);
  const disabled = useMemo(() => {
    return (
      nameField === "" ||
      priceField < 0 ||
      quantityField < 0 ||
      descriptionField === "" ||
      imageField === null ||
      categoryIndex === null
    );
  }, [
    nameField,
    priceField,
    quantityField,
    descriptionField,
    categoryIndex,
    imageField,
  ]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function handleSubmit(e: any): Promise<void> {
    e.preventDefault();
    setIsloading(() => true);
    if (imageField) {
      if (!imageField.type.startsWith("image/")) {
        toast({
          title: "Error",
          description: "Le fichier sélectionné n'est pas une image.",
          variant: "destructive",
        });
        setIsloading(false);
        return;
      }

      try {
        const storageRef = ref(storageApp, `${Date.now()}_${imageField.name}`);
        await uploadBytes(storageRef, imageField);

        const imageUrl = await getDownloadURL(storageRef);

        const dto: AddItemDto = {
          stockId: "ALC9DaaxLNx72nQbChyr",
          name: nameField,
          initial_price: priceField,
          quantity: quantityField,
          description: descriptionField,
          imgUrl: imageUrl,
          category: categoryType[categoryIndex ?? 0],
        };
        const response = await itemService.createItem(dto);

        if (response.success) {
          toast({
            title: "Success",
            description: `L'article a été ajouté avec succès!`,
            variant: "default",
          });
        } else {
          toast({
            title: "Error",
            description: `${response.message}`,
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Une erreur est survenue lors de l'upload de l'image.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Veuillez choisir une image.",
        variant: "destructive",
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
        Créer produit
      </Button>
    </div>
  );
}

export default CreateItem;
