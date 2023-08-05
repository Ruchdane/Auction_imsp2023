import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";
import { MakeBidDto } from "../domain/dto/makeBid.dto";
import bidService from "../domain/services/bid.service";
import { useUser } from "../feature/auth";
import {
  ErrorResponse,
  SuccessResponse,
} from "../domain/interfaces/response.interface";

interface makeBidProps {
  auctionId: string;
}

function MakeBid(props: makeBidProps) {
  const { toast } = useToast();
  const [amountField, setAmountField] = useState(0);

  const user = useUser();

  const [isLoading, setIsloading] = useState(false);
  const disabled = useMemo(() => {
    return amountField < 0;
  }, [amountField]);

  async function handleSubmit(
    e: any,
  ): Promise<SuccessResponse<string> | ErrorResponse> {
    e.preventDefault();
    setIsloading(() => true);
    try {
      const dto: MakeBidDto = {
        auctionId: props.auctionId,
        amount: amountField,
        bidderId: user ? user.id : "None",
      };
      const response = await bidService.makeBid(dto);
      if (response.success) {
        toast({
          title: "Success",
          description: `L'offre a été fait avec succès!`,
          variant: "default",
        });
        setIsloading(false);
        return response;
      } else {
        toast({
          title: "Error",
          description: `${response.message}`,
          variant: "destructive",
        });
        setIsloading(false);
        return response;
      }
    } catch (error) {
      console.error(error);

      toast({
        title: "Error",
        description: String(error),
        variant: "destructive",
      });
      setIsloading(false);
      return {
        success: false,
        message: "An error occurred while making the bid.",
      };
    }
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
          Enchérir
        </Button>
      </div>
    </div>
  );
}
export default MakeBid;
