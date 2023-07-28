import { Card, CardContent, CardHeader } from "../../ui/card";
import { useState } from "react";
import BidAgain from "../../form/bidagain";
import { AuctionBidCard } from "../../feature/auction/card";
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
        <AuctionBidCard auctionId={"Xh0W92dPTvUZ6NCRkaCg"} />
        <BidAgain />
      </div>
    </div>
  );
}
