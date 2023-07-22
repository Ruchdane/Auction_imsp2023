import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ComboBox } from "../ui/combobox";
import { useToast } from "../ui/use-toast";

function CreateItem() {
  const { toast } = useToast()
  const [nameField, setNameField] = useState("")
  const [priceField, setPriceField] = useState("")
  const [quantityField, setQuantityField] = useState("")
  const [descriptionField, setDescriptionField] = useState("")
  const categoryType = ["Option 1", "Option 2", "Option 3"];
  const [categoryIndex, setCategoryIndex] = useState<number | null>(null);
  const toastType = ["Error", "Warning", "Info"];
  const [toastIndex, setToastIndex] = useState<number | null>(null);


  const [isLoading, setIsloading] = useState(false)
  const disabled = useMemo(() => {
    return nameField === "" || priceField === "" || quantityField === "" || descriptionField === "" || categoryIndex === null
  }, [nameField, priceField, quantityField, descriptionField, categoryIndex])

  function handleSubmit(e: any): void {
    e.preventDefault();
    setIsloading(() => true)
    setTimeout(() => {
      setIsloading(() => false)
      toast({
        title: toastType[toastIndex ?? 0],
        description: `${nameField} =[]= ${priceField} =[]= ${quantityField} =[]= ${descriptionField}`,
      })
    }, 1000)

  }

  return (
    <div className="text-primary flex flex-col justify-center items-center h-full gap-6 max-w-60">
      <h2 className="text-3xl font-bold">Create Item</h2>
      <div className="flex flex-col gap-4">
        <div>
          <Label htmlFor="nameField"> Name </Label>
          <Input value={nameField} onChange={e => setNameField(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="priceField"> Price </Label>
          <Input value={priceField} onChange={e => setPriceField(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="quantityField"> Quantity </Label>
          <Input value={quantityField} onChange={e => setQuantityField(e.target.value)} />
        </div>
        <div className="flex flex-col">
          <Label htmlFor="descriptionField"> Description </Label>
          <textarea value={descriptionField} onChange={e => setDescriptionField(e.target.value)} />
        </div>
        <div>
            <ComboBox
              values={categoryType}
              index={categoryIndex}
              placeholder="Category"
              onChange={(value) => setCategoryIndex(value)}
              label={(toast) => toast}
            />
        </div>
       
        <Button isLoading={isLoading} disabled={disabled} onClick={handleSubmit} type="submit" className="w-full">
          create
        </Button>
      </div>
    </div>
  );
}

export default CreateItem;
