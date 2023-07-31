import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";
import bidService from "../domain/services/bid.service";
import { BidAgainDto } from "../domain/dto/bidAgain.dto";
import {
  ErrorResponse,
  SuccessResponse,
} from "../domain/interfaces/response.interface";

interface bidAginProps {
  bidId: string
}

function BidAgain(props: bidAginProps) {
  const { toast } = useToast();
  const [amountField, setAmaountField] = useState(0);
  const toastType = ["Error", "Warning", "Info"];

  const [isLoading, setIsloading] = useState(false);
  const disabled = useMemo(() => {
    return amountField < 0;
  }, [amountField]);

  async function handleSubmit(e: any): Promise<SuccessResponse<string | null> | ErrorResponse> {
    e.preventDefault();
    setIsloading(() => true);
    try {
      const dto: BidAgainDto = {
        bidId: props.bidId,
        amount: amountField,
      };
      const response = await bidService.bidAgain(dto);
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
      <h2 className="text-3xl font-bold"></h2>
      <div className="flex flex-row items-center gap-4">
        <div className="flex items-center">
          <Label className="mr-2" htmlFor="someField">
            {" "}
            Montant{" "}
          </Label>
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
