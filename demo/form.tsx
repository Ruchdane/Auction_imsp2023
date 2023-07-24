import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ComboBox } from "../ui/combobox";
import { useToast } from "../ui/use-toast";

function FormDemo() {
  const { toast } = useToast();
  const [someField, setSomeField] = useState("");
  const [someOtherField, setSomeOtherField] = useState("");
  const toastType = ["Error", "Warning", "Info"];
  const [toastIndex, setToastIndex] = useState<number | null>(null);

  const [isLoading, setIsloading] = useState(false);
  const disabled = useMemo(() => {
    return someField === "" || someOtherField === "" || toastIndex === null;
  }, [someField, someOtherField, toastIndex]);

  function handleSubmit(e: any): void {
    e.preventDefault();
    setIsloading(() => true);
    setTimeout(() => {
      setIsloading(() => false);
      toast({
        title: toastType[toastIndex ?? 0],
        description: `${someField} =[]= ${someOtherField}`,
      });
    }, 1000);
  }

  return (
    <div className="text-primary flex flex-col justify-center items-center h-full gap-6 max-w-60">
      <h2 className="text-3xl font-bold">Form Demo!</h2>
      <div className="flex flex-col gap-4">
        <div>
          <Label htmlFor="someField"> Some Field </Label>
          <Input
            value={someField}
            onChange={(e) => setSomeField(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="someOtherField"> Some OtherField </Label>
          <Input
            value={someOtherField}
            onChange={(e) => setSomeOtherField(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="someOtherField"> Tooltip To show</Label>
          <ComboBox
            values={toastType}
            index={toastIndex}
            placeholder="Toast Type"
            onChange={(value) => setToastIndex(value)}
            label={(toast) => toast}
          />
        </div>
        <Button
          isLoading={isLoading}
          disabled={disabled}
          onClick={handleSubmit}
          type="submit"
          className="w-full"
        >
          Submit
        </Button>
      </div>
    </div>
  );
}

export default FormDemo;
