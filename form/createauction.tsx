import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { ComboBox } from "../ui/combobox";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";

function CreateAuction() {
  const { toast } = useToast()
  const [itemIndex, setItemIndex] = useState<number | null>(null);
  const itemType = ["Item A", "Item B", "Item C"];
  const toastType = ["Error", "Warning", "Info"];


  const [isLoading, setIsloading] = useState(false)
  const disabled = useMemo(() => {
    return itemIndex === null 
  }, [itemIndex])

  function handleSubmit(e: any): void {
    e.preventDefault();
    setIsloading(() => true)
    setTimeout(() => {
      setIsloading(() => false)
      toast({
        title: toastType[0],
        description: `${itemIndex}`,
      })
    }, 1000)

  }

  return (
    <div className="text-primary flex flex-col justify-center items-center h-full gap-6 max-w-60">
      <h2 className="text-3xl font-bold">Create Auction</h2>
      <div className="flex flex-col items-center gap-4 w-1/4" >
        <div>
            <ComboBox
                values={itemType}
                index={itemIndex}
                placeholder="Item"
                onChange={(value) => setItemIndex(value)}
                label={(toast) => toast}
            />
        </div>
        
        <Button  isLoading={isLoading} disabled={disabled} onClick={handleSubmit} type="submit" className="w-2/3">
          Create
        </Button>
      </div>
    </div>
  );
}

export default CreateAuction;
