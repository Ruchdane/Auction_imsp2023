import { ChevronDown, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Modal, ModalBody, ModalTriger } from "../../ui/modal";
import { useState } from "react";
import MakeBid from "../../form/makebid";
import {
  useAuctionHighBid,
  useEndAuction,
  useHigtestBid,
  useMyAmount,
  useTimeRemaining,
} from ".";
import { Link } from "react-router-dom";
import { Auction } from "../../domain/types/auction";
import { Bid } from "../../domain/types/bid";
import { useUser } from "../auth";
import BidAgain from "../../form/bidagain";

interface AuctionCardProps {
  auction: Auction;
}
export default function AuctionCard({ data }: { data: Auction }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const high = useHigtestBid(data.id);
  const timeRemaining = useTimeRemaining(data.endDate);

  useEndAuction(timeRemaining, data.id);

  return (
    <Card>
      <CardHeader className="flex justify-between item-center gap-4">
        <CardTitle> {data.item.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <img
          src={data.item.imgUrl}
          style={{ width: "200px", height: "200px" }}
          className="bg-contrast"
          alt={data.item.name}
        />
        <p> Temps restant : {timeRemaining}</p>
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

export function BidsCard({ auction }: AuctionCardProps) {
  const high_bids: Bid[] = useAuctionHighBid(auction.id);
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

export function AuctionBidCard({ auction }: AuctionCardProps) {
  const high = useHigtestBid(auction.id);
  const user = useUser()
  const myAmount = useMyAmount(user ? user.id: "", auction.id);
  if (auction === null) return <> </>;
  // const timeRemaining = useTimeRemaining(auction.endDate);
  return (
    <><Card>
      <CardHeader className="flex justify-between item-center gap-4">
        <div>
          <p>
            {" "}
            Temps restant <br />

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
    </Card><BidAgain /></>
  );
}
