import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";
import { MakeBidDto } from "../domain/dto/makeBid.dto";
import bidService from "../domain/services/bid.service";

interface makeBidProps {
  auctionId: string;
  bidderId: string;
}

function MakeBid(props: makeBidProps) {
  const { toast } = useToast();
  const [amountField, setAmountField] = useState(0);
  const toastType = ["Error", "Warning", "Info"];

  const [isLoading, setIsloading] = useState(false);
  const disabled = useMemo(() => {
    return amountField < 0 || props.bidderId === "8OJY14mamOUHY2nWKK0q";
  }, [amountField]);

  async function handleSubmit(e: any): Promise<void> {
    e.preventDefault();
    setIsloading(() => true);
    try {
      const dto: MakeBidDto = {
        auctionId: props.auctionId,
        amount: amountField,
        bidderId: props.bidderId,
      };
      const response = await bidService.makeBid(dto);

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
      console.error(error);

      toast({
        title: "Error",
        description: "Une erreur est survenue lors de l'upload de l'image.",
        variant: "destructive",
      });
    }
    setIsloading(false);
  }

  return (
    <div className="text-primary flex flex-col justify-center items-center h-full gap-6 max-w-60">
      <h2 className="text-3xl font-bold">Enchérir</h2>
      <div className="flex flex-col justify-center items-center gap-4">
        <div>
          <Label htmlFor="someField"> Montant </Label>
          <Input
            type="number"
            min="0"
            value={amountField}
            onChange={(e) => setAmountField(Number(e.target.value))}
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
