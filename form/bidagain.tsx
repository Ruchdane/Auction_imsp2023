import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";

function BidAgain() {
  const { toast } = useToast();
  const [amountField, setAmaountField] = useState(0);
  const toastType = ["Error", "Warning", "Info"];

  const [isLoading, setIsloading] = useState(false);
  const disabled = useMemo(() => {
    return amountField < 0;
  }, [amountField]);

  function handleSubmit(e: any): void {
    e.preventDefault();
    setIsloading(() => true);
    setTimeout(() => {
      setIsloading(() => false);
      toast({
        title: toastType[0],
        description: `${amountField}`,
      });
    }, 1000);
  }

  return (
    <div className="text-primary flex flex-col justify-center items-center h-full gap-6 max-w-60">
      <h2 className="text-3xl font-bold"></h2>
      <div className="flex flex-row items-center gap-4">
        <div className="flex items-center">
          <Label className="mr-2" htmlFor="someField"> Montant </Label>
          <Input
            type="number"
            min="0"
            value={amountField}
            onChange={(e) => setAmaountField(Number(e.target.value))}
          />
        </div>

        <Button
          isLoading={isLoading}
          disabled={disabled}
          onClick={handleSubmit}
          type="submit"
          className="w-2/3"
        >
          Encherir
        </Button>
      </div>
    </div>
  );
}

export default BidAgain;
