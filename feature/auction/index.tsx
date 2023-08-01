import { useEffect, useRef, useState } from "react";
import auctionService from "../../domain/services/auction.service";
import { Auction } from "../../domain/types/auction";
import { Bid } from "../../domain/types/bid";
import bidService from "../../domain/services/bid.service";
import { Timestamp } from "firebase/firestore";
import { useToast } from "../../ui/use-toast";
import { useUser } from "../auth";

export const useAuction = (auctionId: string): Auction | null => {
  const [auction, setAuction] = useState<Auction | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAuction = async () => {
      const response = await auctionService.getAuction(auctionId);
      if (response.success) {
        setAuction(response.data);
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
      }
    };
    fetchAuction();
  }, [auctionId, toast]);

  return auction;
};

// Pour récupérer mon offre actuelle
export const useMyBid = (userId: string, auctionId: string): Bid | null => {
  const [myBid, setmyBid] = useState<Bid | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (userId != "") {
      const unsubscribe = bidService.listenCurrentBidUser(
        userId,
        auctionId,
        (myBid, error) => {
          if (error) {
            toast({
              title: "Error",
              description: error,
              variant: "destructive",
            });
          } else {
            setmyBid(myBid);
          }
        },
      );
      return () => {
        unsubscribe();
      };
    }
  }, []);

  return myBid;
};
// Pour récupérer la 1ère offre
export const useHigtestBid = (auctionId: string): number => {
  const [high, setHighBid] = useState<number>(0);
  const { toast } = useToast();
  useEffect(() => {
    const unsubscribe = bidService.listenHighestBid(
      auctionId,
      (high, error) => {
        if (error) {
          toast({
            title: "Error",
            description: error,
            variant: "destructive",
          });
        } else {
          setHighBid(high);
        }
      },
    );
    return () => {
      unsubscribe();
    };
  }, [auctionId]);

  return high;
};

export const useEndAuction = (timeRemaining: string, auction: Auction) => {
  const { toast } = useToast();
  const user = useUser();

  useEffect(() => {
    if (timeRemaining === "00:00:000") {
      const fetchEndAuction = async () => {
        const response = await auctionService.endAuction({ auctionId : auction.id });
        if (response.success ) {
          if (response.data && user) {
              console.log('response.data:', response.data)
              const res = await bidService.getBidsAuction(auction.id);
              if (res.success) {
                const bids = res.data;
                if (
                  bids.find((it) => it.bidderId === user.id) ||  auction.sellerId === user.id
                ) {
                  bids.sort((a, b) => b.amount - a.amount);
                  if (bids[0].bidderId === user.id) {
                    toast({
                      title: "Enchère Terminé",
                      description: `Vous avez remporté l'enchère ${auction.item.name}.`,
                      variant: "default",
                    });
                  } else {
                    toast({
                      title: "Enchère Terminé",
                      description: `L'enchère ${auction.item.name} a été remporté par l'utilisateur ${bids[0].bidder.name}.`,
                      variant: "default",
                    });
                  }
                
              } 
            }
          }
          // toast({
          //   title: "Success",
          //   description: "Auction updated successfully",
          //   variant: "default",
          // });
          console.log("endAuction or restartAuction");
        } else {
          toast({
            title: "Error",
            description: response.message,
            variant: "destructive",
          });
        }
      };
      fetchEndAuction();
    }
  }, [timeRemaining]);
};

// Pour récupérer les 5 premières offres
export const useAuctionHighBid = (auctionId: string) => {
  const [bids, setBids] = useState<Bid[]>([]);
  const { toast } = useToast();
  useEffect(() => {
    const unsubscribe = bidService.listenBidsAuction(
      auctionId,
      (bids, error) => {
        if (error) {
          toast({
            title: "Error",
            description: error,
            variant: "destructive",
          });
        } else {
          bids.sort((a, b) => b.amount - a.amount);
          const highestBids = bids.slice(0, 5);

          setBids(highestBids);
        }
      },
    );
    return () => {
      unsubscribe();
    };
  }, [auctionId]);

  return bids;
};

export function getAllAuction() {
  return Array.from(Array(100), (_, i) => i.toString());
}

export function useActiveAuctions() {
  const [activeAuctions, setActiveAuctions] = useState<Auction[]>([]);
  const { toast } = useToast();
  const user = useUser();

  useEffect(() => {
    const unsubscribe = auctionService.listenActiveAuctions(
      (newActiveAuctions, error) => {
        if (error) {
          toast({
            title: "Error",
            description: error,
            variant: "destructive",
          });
        } else {
          activeAuctions.forEach(async (it) => {
            let resultSearch = newActiveAuctions.find(
              (auction) => auction.id === it.id,
            );

            if (resultSearch == undefined) {
              // const auctionData = useAuction(it.id);
              if (user) {
                const response = await bidService.getBidsAuction(it.id);
                if (response.success) {
                  const bids = response.data;
                  console.log("bids:", bids);
                  if (
                    bids.find((it) => it.bidderId === user.id) ||
                    it.sellerId === user.id
                  ) {
                    console.log(
                      "bids.find(it=>it.bidderId===user.id):",
                      bids.find((it) => it.bidderId === user.id),
                    );
                    bids.sort((a, b) => b.amount - a.amount);
                    if (bids[0].bidderId === user.id) {
                      toast({
                        title: "Enchère Terminé",
                        description: `Vous avez remporté l'enchère ${it.item.name}.`,
                        variant: "default",
                      });
                    } else {
                      toast({
                        title: "Enchère Terminé",
                        description: `L'enchère ${it.item.name} a été remporté par ${bids[0].bidder.name}.`,
                        variant: "default",
                      });
                    }
                  }
                } else {
                  toast({
                    title: "Error",
                    description: response.message,
                    variant: "destructive",
                  });
                }
              }
            }
          });

          setActiveAuctions(newActiveAuctions);
        }
      },
    );
    return () => {
      unsubscribe();
    };
  }, []);
  return activeAuctions;
}

export function useAuctionsSeller() {
  const [sellerAuctions, setsellerAuctions] = useState<Auction[]>([]);
  const { toast } = useToast();
  const user = useUser();

  useEffect(() => {
    if (user) {
      const unsubscribe = auctionService.listenAuctionsFromSeller(
        user.id,
        (sellerAuctions, error) => {
          if (error) {
            toast({
              title: "Error",
              description: error,
              variant: "destructive",
            });
          } else {
            setsellerAuctions(sellerAuctions);
          }
        },
      );
      return () => {
        unsubscribe();
      };
    }
  }, [user]);
  return sellerAuctions;
}

export function useAuctionsBidder() {
  const [bidderAuctions, setbidderAuctions] = useState<Auction[]>([]);
  const { toast } = useToast();
  const user = useUser();

  useEffect(() => {
    if (user) {
      const unsubscribe = auctionService.listenAuctionsFromBidder(
        user.id,
        (bidderAuctions, error) => {
          if (error) {
            toast({
              title: "Error",
              description: error,
              variant: "destructive",
            });
          } else {
            setbidderAuctions(bidderAuctions);
          }
        },
      );
      return () => {
        unsubscribe();
      };
    }
  }, [user]);

  return bidderAuctions;
}

// Convertir le temps restant en format mm:ss:mmm
export function formatTime(timeRemaining: number): string {
  const minutes = String(Math.floor(timeRemaining / 60000)).padStart(2, "0");
  const seconds = String(Math.floor((timeRemaining % 60000) / 1000)).padStart(
    2,
    "0",
  );
  const milliseconds = String(timeRemaining % 1000).padStart(3, "0");
  return `${minutes}:${seconds}:${milliseconds}`;
}

export function getTimeRemaining(endDate: Date): number {
  const currentTime = new Date().getTime();
  const endTime = endDate.getTime();

  return Math.max(0, endTime - currentTime); // Si le temps restant est négatif, le remettre à 0
}

export function useTimeRemaining(endTimestamp: Timestamp | null): string {
  if (endTimestamp == null) return formatTime(0);
  const endDate = endTimestamp.toDate();
  const [timeRemaining, setTimeRemaining] = useState<string>(
    formatTime(getTimeRemaining(endDate)),
  );

  useEffect(() => {
    // Mettre à jour le temps restant toutes les 100 millisecondes
    const interval = setInterval(() => {
      const remaining = getTimeRemaining(endDate);
      setTimeRemaining(formatTime(remaining));
    }, 100);
    return () => {
      clearInterval(interval);
    };
  }, [endDate]);

  // Retourner le temps restant au format mm:ss:mmm
  return timeRemaining;
}

export default useAuction;
