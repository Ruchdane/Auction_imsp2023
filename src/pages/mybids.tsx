import { Card, CardContent } from "../../ui/card";
import { useState } from "react";
import BidAgain from "../../form/bidagain";
import { AuctionBidCard } from "../../feature/auction/card";
import List from "../../ui/list";
import { getAllAuction, useAuctionsBidder } from "../../feature/auction";
import { Auction } from "../../domain/types/auction";

export default function MyBids() {

  const bidderAuctions = useAuctionsBidder();
  const [bidderAuction, setbidderAuction] = useState<Auction | null>(null);
  return (
    <div className="grid grid-cols-3 items-center justify-center gap-4 pt-8">
      <Card className="w-fit h-fit">
        <CardContent className="p-0 overflow-y-auto max-h-72">
          <List
            setActiveElement={setbidderAuction}
            activeElement={bidderAuction}
            elements={bidderAuctions}
            display={({ element }) => <>Ventes De {element}</>}
          />
        </CardContent>
      </Card>
      <div className="col-span-2">
        {bidderAuction && <AuctionBidCard auction={bidderAuction} />}
       
      </div>
    </div>
  );
}
