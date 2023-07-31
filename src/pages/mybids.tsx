import { Card, CardContent } from "../../ui/card";
import { useState } from "react";
import { AuctionBidCard } from "../../feature/auction/card";
import List from "../../ui/list";
import { useAuctionsBidder } from "../../feature/auction";
import { Auction } from "../../domain/types/auction";
import { useLocation } from "react-router-dom";
import { useRedirectUserToLogin } from "../../feature/auth";

export default function MyBids() {
  const location = useLocation();
  useRedirectUserToLogin(location.pathname);
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
            display={({ element }) => <>Ventes De {element.item.name}</>}
          />
        </CardContent>
      </Card>
      <div className="col-span-2">
        {bidderAuction && <AuctionBidCard auction={bidderAuction} />}
      </div>
    </div>
  );
}
