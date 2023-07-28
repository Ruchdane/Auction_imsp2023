import { useActiveAuctions } from "../../feature/auction";
import AuctionCard from "../../feature/auction/card";

export default function Home() {
  const auctions = useActiveAuctions();
  return (
    <>
      <h2 className="text-lg font-bold"> Auctions </h2>
      <div className="pt-8 flex flex-wrap gap-4 mx-auto">
        {auctions.map((auction, key) => (
          <AuctionCard key={key} data={auction} />
        ))}
      </div>
    </>
  );
}
