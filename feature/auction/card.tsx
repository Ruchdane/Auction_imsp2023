import { ChevronDown, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Modal, ModalBody, ModalTriger } from "../../ui/modal";
import { useState } from "react";
import MakeBid from "../../form/makebid";
import useAuction, {
  useAuctionHighBid,
  useHigtestBid,
  useMyAmount,
  useTimeRemaining,
} from ".";
import { Link } from "react-router-dom";
import { Auction } from "../../domain/types/auction";
import { Bid } from "../../domain/types/bid";

interface AuctionCardProps {
  auctionId: string;
}
export default function AuctionCard({ auctionId }: AuctionCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const auction = useAuction(auctionId);
  const high = useHigtestBid(auctionId);
  if (auction === null) return <> </>;
  // const timeRemaining = useTimeRemaining(auction.endDate);

  return (
    <Card>
      <CardHeader className="flex justify-between item-center gap-4">
        <CardTitle> {auction.item.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <img
          src={auction.item.imgUrl}
          width="200"
          height="200"
          className="bg-contrast"
        />
        <p> Temps restant : {}</p>
        <p> Plus Offrant : {high} XOF</p>
        <div className="flex justify-between items-center pt-4">
          <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
            <ModalTriger
              label="Make bid"
              icon={
                <>
                  <Plus size={24} />
                  Enchérir
                </>
              }
            />
            <ModalBody title="" isOpen={isModalOpen}>
              <MakeBid />
            </ModalBody>
          </Modal>
          <Link to="/mes_encheres/detail" className="inline-flex">
            <ChevronDown size={24} />
            Détails
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

// function formatTime(date: Date): string {
//   const minutes = String(date.getMinutes()).padStart(2, "0");
//   const seconds = String(date.getSeconds()).padStart(2, "0");
//   const milli = String(date.getMilliseconds()).padStart(2, "0");
//   return `${minutes}:${seconds}:${milli}`;
// }

export function BidsCard({ auctionId }: AuctionCardProps) {
  const auction: Auction | null = useAuction(auctionId);
  const high_bids: Bid[] = useAuctionHighBid(auctionId);
  console.log('high_bids:', high_bids)

  // const timeRemaining = useTimeRemaining(auction?.endDate);

  if (auction === null) return <> </>;

  return (
    <Card className="col-span-2">
      <CardHeader>
        <div>
          <p>
            {" "}
            Temps restant <br /> {}
          </p>
        </div>
        <div>
          <p>Produit : {auction.item.name}</p>
          <p>Prix Minimum: {auction.item.initial_price}</p>
          <p>Quantity: {auction.item.quantity}</p>
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-semibold"> Top 5 Encheres </h3>
        <ul className="list-none">
          {high_bids.map((bid, key) => (
            <li className="flex justify-between gap-16 border rounded-lg p-4 m-1">
              <span className="p-2 rounded-lg border"> {key}</span>
              <span> Nom : {bid.bidder.name}</span>
              <span> Prix :{bid.amount}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function AuctionBidCard({ auctionId }: AuctionCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const auction = useAuction(auctionId);
  const high = useHigtestBid(auctionId);
  const userId = "8OJY14mamOUHY2nWKK0q";
  const myAmount = useMyAmount(userId, auctionId);
  if (auction === null) return <> </>;
  // const timeRemaining = useTimeRemaining(auction.endDate);
  return (
    <Card>
      <CardHeader className="flex justify-between item-center gap-4">
        <div>
          <p>
            {" "}
            Temps restant <br />
            {}
          </p>
        </div>
        <div>
          <p> Nom : {auction.item.name} XOF</p>
          <p> Prix Minimum : {auction.item.initial_price} XOF</p>
          <p> Quantité : {auction.item.quantity} </p>
          <p> Plus Offrant : {high} XOF</p>
          <p> Mon Offre Actuelle: {myAmount} XOF</p>
        </div>
      </CardHeader>
    </Card>
  );
}
