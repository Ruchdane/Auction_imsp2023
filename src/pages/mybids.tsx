import { Card, CardContent } from "../../ui/card";
import { useState } from "react";
import BidAgain from "../../form/bidagain";
import { AuctionBidCard } from "../../feature/auction/card";
import List from "../../ui/list";
import { getAllAuction } from "../../feature/auction";

export default function MyBids() {
  const auctions = getAllAuction();
  const [activeAuctionId, setActiveAuctionId] = useState<string | null>(null);
  return (
    <div className="grid grid-cols-3 items-center justify-center gap-4 pt-8">
      <Card className="w-fit h-fit">
        <CardContent className="p-0 overflow-y-auto max-h-72">
          <List
            setActiveElement={setActiveAuctionId}
            activeElement={activeAuctionId}
            elements={auctions}
            display={({ element }) => <>Ventes N*{element}</>}
          />
        </CardContent>
      </Card>
      <div className="col-span-2">
        {activeAuctionId && <AuctionBidCard auctionId={activeAuctionId} />}
        <BidAgain />
      </div>
    </div>
  );
}
