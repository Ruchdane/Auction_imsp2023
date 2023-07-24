import { useMemo, useState, useRef, ChangeEvent } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ComboBox } from "../ui/combobox";
import { useToast } from "../ui/use-toast";

function CreateItem() {
  const { toast } = useToast();
  const [nameField, setNameField] = useState("");
  const [priceField, setPriceField] = useState("");
  const [quantityField, setQuantityField] = useState("");
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
      priceField === "" ||
      quantityField === "" ||
      descriptionField === "" ||
      imageField === null ||
      categoryIndex === null
    );
  }, [nameField, priceField, quantityField, descriptionField, categoryIndex, imageField]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function handleSubmit(e: any): void {
    e.preventDefault();
    setIsloading(() => true);
    setTimeout(() => {
      setIsloading(() => false);
      toast({
        title: toastType[toastIndex ?? 0],
        description: `${nameField} =[]= ${priceField} =[]= ${quantityField} =[]= ${descriptionField}`,
      });
    }, 1000);
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
                value={priceField}
                onChange={(e) => setPriceField(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="quantityField"> Quantité </Label>
              <Input
                value={quantityField}
                onChange={(e) => setQuantityField(e.target.value)}
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
              <textarea
                value={descriptionField}
                onChange={(e) => setDescriptionField(e.target.value)}
              />
            </div>
            <div>
              <ComboBox
                values={categoryType}
                index={categoryIndex}
                placeholder="Categori"
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
