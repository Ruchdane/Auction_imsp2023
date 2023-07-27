import { useEffect, useState } from "react";
import { Auction } from "../../domain/types/auction";
import auctionService from "../../domain/services/auction.service";

export default function ActiveAuctions() {
  const [activeAuctions, setActiveAuctions] = useState<Auction[]>([]);

  useEffect(() => {
    // Mettre en place l'écoute en temps réel avec onSnapshot pour les mises à jour
    const unsubscribe = auctionService.listenActiveAuctions(
      (activeAuctions) => {
        setActiveAuctions(activeAuctions);
      },
    );

    // Nettoyer l'abonnement lors du démontage du composant
    return () => {
      unsubscribe();
    };
  }, []);

  // Utilisez maintenant la variable activeAuctions pour afficher les enchères actives dans votre composant
  // Par exemple :
  return (
    <div>
      Liste des actives auctions
      {activeAuctions.map((auction) => (
        <div key={auction.id}>{auction.item.name}</div>
      ))}
    </div>
  );
}
