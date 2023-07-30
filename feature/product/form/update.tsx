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
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storageApp } from "../../../domain/firebase/config";

interface itemObj {
  item: Item;
}

function UpdateItem(props: itemObj) {
  const { toast } = useToast();
  const [nameField, setNameField] = useState(props.item.name);
  const [priceField, setPriceField] = useState(props.item.initial_price);
  const [quantityField, setQuantityField] = useState(props.item.quantity);
  const [descriptionField, setDescriptionField] = useState(
    props.item.description,
  );
  const [imageField, setImageField] = useState<File | null>(null);
  const categoryType = [
    "Informatique et High-Tech",
    "Meubles et Décoration",
    "Vêtements et Accessoires",
    "Sports et Fitness",
    "Jeux et Jouets",
    "Autres",
  ];
  const [categoryIndex, setCategoryIndex] = useState<number | null>(
    categoryType.indexOf(props.item.category),
  );

  const [isLoading, setIsloading] = useState(false);
  const disabled = useMemo(() => {
    return (
      nameField === "" ||
      priceField < 0 ||
      quantityField < 0 ||
      descriptionField === "" ||
      categoryIndex === null ||
      (nameField === props.item.name &&
        priceField === props.item.initial_price &&
        quantityField === props.item.quantity &&
        descriptionField === props.item.description &&
        categoryType[categoryIndex ?? 0] === props.item.category)
    );
  }, [
    nameField,
    priceField,
    quantityField,
    descriptionField,
    categoryIndex,
    imageField,
    props.item,
  ]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function handleSubmit(e: any): Promise<void> {
    e.preventDefault();
    setIsloading(() => true);
    let imageUrl: string | null = null;
    let previousImageUrl: string | null = null;

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

        imageUrl = await getDownloadURL(storageRef);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Une erreur est survenue lors de l'upload de l'image.",
          variant: "destructive",
        });
      }
    }

    const dto: UpdateItemDto = {
      itemId: props.item.id,
      name: nameField,
      stockId: props.item.stockId,
      quantity: quantityField,
      category: categoryType[categoryIndex ?? 0],
      description: descriptionField,
      initial_price: priceField,
      imgUrl: imageUrl ? imageUrl : props.item.imgUrl,
    };

    // Vérifier si l'article avait déjà une image avant la mise à jour
    if (props.item.imgUrl && imageUrl !== props.item.imgUrl) {
      previousImageUrl = props.item.imgUrl;
    }

    const response = await itemService.updateItem(dto);
    if (response.success) {
      toast({
        title: "Success",
        description: `L'article a été ajouté avec succès!`,
        variant: "default",
      });
      props.item.name = nameField;
      props.item.initial_price = priceField;
      props.item.quantity = quantityField;
      props.item.description = descriptionField;
      props.item.category = categoryType[categoryIndex ?? 0];

      // Supprimer l'ancienne image de Firebase Storage (si elle existe)
      // if (previousImageUrl) {
      //   const storageRef = ref(storageApp, previousImageUrl);
      //   try {
      //     await deleteObject(storageRef);
      //   } catch (error) {
      //     console.error(error);
      //     toast({
      //       title: "Error",
      //       description:
      //         "Une erreur est survenue lors de la suppression de l'ancienne image.",
      //       variant: "destructive",
      //     });
      //   }
      // }
    } else {
      toast({
        title: "Error",
        description: `${response.message}`,
        variant: "destructive",
      });
    }
    setIsloading(false);
  }

  return (
    <div className="text-primary flex flex-col justify-center items-center h-full gap-6 max-w-60">
      <h2 className="text-3xl font-bold">Modifier un article</h2>
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
