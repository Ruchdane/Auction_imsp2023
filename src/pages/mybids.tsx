import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Modal, ModalBody, ModalTriger } from "../../ui/modal";
import { useState } from "react";
import { ProductDataTable } from "../../feature/product/data-table";
import MakeBid from "../../form/makebid";
import BidAgain from "../../form/bidagain";
import { AuctionBidCard, BidsCard } from "../../feature/auction/card";
import ActiveAuctions from "./activeAuctions";

export default function MyBids() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (

    <div className="grid grid-cols-3 items-center justify-center gap-4 pt-8">
      <Card className="w-fit h-fit">
        <CardHeader className="flex justify-between item-center gap-4"></CardHeader>
        <CardContent>
          <ActiveAuctions />
        </CardContent>
      </Card>
      <div className="col-span-2">
        <AuctionBidCard auctionId={0} />
        <BidAgain />
      </div>
    </div>);
}
