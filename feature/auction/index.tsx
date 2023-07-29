import { useEffect, useState } from "react";
import auctionService from "../../domain/services/auction.service";
import { Auction } from "../../domain/types/auction";
import { Bid } from "../../domain/types/bid";
import bidService from "../../domain/services/bid.service";
import { Timestamp } from "firebase/firestore";
import { useToast } from "../../ui/use-toast";

export const useAuction = (auctionId: string): Auction | null => {
  const [auction, setAuction] = useState<Auction | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAuction = async () => {
      const response = await auctionService.getAuction(auctionId);
      if (response.success) {
        setAuction(response.data);
      } else {
        // Afficher un toast en cas d'erreur lors de la récupération de l'enchère
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
      }
    };

    // Appeler la fonction pour récupérer l'enchère spécifiée
    fetchAuction();
  }, [auctionId, toast]);

  return auction;
};

// Pour récupérer mon offre actuelle
export const useMyAmount = (userId: string, auctionId: string): number => {
  const [amount, setmyAmount] = useState<number>(0);

  useEffect(() => {
    const unsubscribe = bidService.listenCurrentBidUser(
      userId,
      auctionId,
      (myAmount) => {
        setmyAmount(myAmount);
      },
    );
    return () => {
      unsubscribe();
    };
  }, []);

  return amount;
};
// Pour récupérer la 1ère offre
export const useHigtestBid = (auctionId: string): number => {
  const [high, setHighBid] = useState<number>(0);

  useEffect(() => {
    const unsubscribe = bidService.listenHighestBid(auctionId, (high) => {
      setHighBid(high);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return high;
};
// Pour récupérer les 5 premières offres
export const useAuctionHighBid = (auctionId: string) => {
  const [bids, setBids] = useState<Bid[]>([]);

  useEffect(() => {
    const unsubscribe = bidService.listenBidsAuction(auctionId, (bids) => {
      bids.sort((a, b) => b.amount - a.amount);
      const highestBids = bids.slice(0, 5);

      setBids(highestBids);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return bids;
};

export function getAllAuction() {
  return Array.from(Array(100), (_, i) => i);
}

export function useActiveAuctions() {
  const [activeAuctions, setActiveAuctions] = useState<Auction[]>([]);

  useEffect(() => {
    const unsubscribe = auctionService.listenActiveAuctions(
      (activeAuctions) => {
        setActiveAuctions(activeAuctions);
      },
    );
    return () => {
      unsubscribe();
    };
  }, []);
  return activeAuctions;
}

// Convertir le temps restant en format mm:ss:mmm
function formatTime(timeRemaining: number): string {
  const minutes = String(Math.floor(timeRemaining / 60000)).padStart(2, "0");
  const seconds = String(Math.floor((timeRemaining % 60000) / 1000)).padStart(
    2,
    "0",
  );
  const milliseconds = String(timeRemaining % 1000).padStart(3, "0");
  return `${minutes}:${seconds}:${milliseconds}`;
}

function getTimeRemaining(endDate: Date): number {
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
    // Mettre à jour le temps restant toutes les 100 millisecondes (ou selon votre besoin)
    const interval = setInterval(() => {
      const remaining = getTimeRemaining(endDate);
      setTimeRemaining(formatTime(remaining));
    }, 100);

    // Nettoyer l'intervalle lorsque le composant est démonté
    return () => {
      clearInterval(interval);
    };
  }, [endDate]);

  // Retourner le temps restant au format mm:ss:mmm
  return timeRemaining;
}

export default useAuction;
