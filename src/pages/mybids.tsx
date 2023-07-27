import { useEffect, useState } from "react";
import { Auction } from "../../domain/types/auction";
import auctionService from "../../domain/services/auction.service";

export default function MyBids() {
  const [activeAuctions, setActiveAuctions] = useState<Auction[]>([]);

  useEffect(() => {
    // const fetchActiveAuctions = async () => {
    //   const response = await auctionService.getActiveAuctions();
    //   if (response.success) {
    //     setActiveAuctions(response.data);
    //     console.log("response.data:", response.data);
    //   }
    // };

    // // Appeler la fonction pour récupérer les enchères actives et démarrer l'écoute en temps réel
    // fetchActiveAuctions();

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
      Liste des actives auctions :
      {activeAuctions.map((auction) => (
        <div key={auction.id}>{auction.item.name}</div>
      ))}
    </div>
  );
}
