import { Action } from "@radix-ui/react-toast";
import { Accessibility } from "lucide-react";
import { useEffect, useState } from "react";

interface Auction {
  product: number;
  time: Date;
  high_bid: number;
}

interface Bid {
  username: string;
  price: number;
}

export const useAuction = (auctionId: number): Auction | null => {
  const [auction, setAuction] = useState<Auction | null>(null);
  console.log(auctionId);

  useEffect(() => {
    console.log("auction");
    const timeInterval = setInterval(() => {
      console.log("Update");
      if (auction) {
        const updatedTime = new Date(auction.time.getTime() + 1000);
        setAuction((prevAuction) => ({ ...prevAuction!, time: updatedTime }));
      }
    }, 1000);
    const bidInterval = setInterval(() => {
      if (auction) {
        const updatedBid = auction?.high_bid + 10;
        setAuction(
          (prevAuction) =>
            prevAuction && { ...prevAuction!, high_bid: updatedBid },
        );
      }
    }, 1000);

    const initialTime = new Date();
    const initialAuctionData: Auction = {
      product: 0,
      time: initialTime,
      high_bid: 0,
    };
    setAuction(initialAuctionData);

    return () => {
      clearInterval(timeInterval);
      clearInterval(bidInterval);
    };
  }, []);
  return auction;
};
export const useAuctionHighBid = (auctionId: number) => {
  const [bids, setBids] = useState<Bid[]>([]);
  console.log(auctionId);
  useEffect(() => {
    setBids(
      Array.from(Array(5), () => ({
        username: "John Doe",
        price: 100,
      })),
    );
  }, []);
  return bids;
};
export function getAllAuction() {
  return Array.from(Array(100), (_, i) => i);
}
export default useAuction;
