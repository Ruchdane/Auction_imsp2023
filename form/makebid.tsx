import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";

function MakeBid() {
  const { toast } = useToast();
  const [someField, setSomeField] = useState("");
  const toastType = ["Error", "Warning", "Info"];

  const [isLoading, setIsloading] = useState(false);
  const disabled = useMemo(() => {
    return someField === "";
  }, [someField]);

  function handleSubmit(e: any): void {
    e.preventDefault();
    setIsloading(() => true);
    setTimeout(() => {
      setIsloading(() => false);
      toast({
        title: toastType[0],
        description: `${someField}`,
      });
    }, 1000);
  }

  return (
    <div className="text-primary flex flex-col justify-center items-center h-full gap-6 max-w-60">
      <h2 className="text-3xl font-bold">Make Bid</h2>
      <div className="flex flex-col items-center gap-4">
        <div>
          <Label htmlFor="someField"> Amount </Label>
          <Input
            value={someField}
            onChange={(e) => setSomeField(e.target.value)}
          />
        </div>

        <Button
          isLoading={isLoading}
          disabled={disabled}
          onClick={handleSubmit}
          type="submit"
          className="w-2/3"
        >
          Make Bid
        </Button>
      </div>
    </div>
  );
}

export default MakeBid;
