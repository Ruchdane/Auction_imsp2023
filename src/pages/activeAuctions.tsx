import { Auction } from "../../domain/types/auction";
import { useActiveAuctions } from "../../feature/auction";

export default function ActiveAuctions() {
  const activeAuctions = useActiveAuctions();
  return (
    <div>
      Liste des actives auctions
      {activeAuctions.map((auction) => (
        <div key={auction.id}>{auction.item.name}</div>
      ))}
    </div>
  );
}

export function getAuctions(): Auction[] {
  return [];
}
