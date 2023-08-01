import { Eye, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Modal, ModalBody, ModalTriger } from "../../ui/modal";
import { useState } from "react";
import MakeBid from "../../form/makebid";
import {
  useAuctionHighBid,
  useEndAuction,
  useHigtestBid,
  useMyBid,
  useTimeRemaining,
} from ".";
import { useNavigate } from "react-router-dom";
import { Auction } from "../../domain/types/auction";
import { Bid } from "../../domain/types/bid";
import { useUser } from "../auth";
import BidAgain from "../../form/bidagain";
import { Timer } from "../../ui/timer";
import auth from "../../domain/firebase/auth";

interface AuctionCardProps {
  auction: Auction;
}

export default function AuctionCard({ auction }: AuctionCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const high = useHigtestBid(auction.id);
  const user = useUser();
  const navigate = useNavigate();
  // useEndAuction(timeRemaining, auction.id);

  const handleBidButtonClick = () => {
    if (!user) {
      navigate("/authentification");
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <Card>
      <CardHeader className="flex justify-between item-center gap-4">
        <CardTitle> {auction.item.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <img
          src={auction.item.imgUrl}
          style={{ width: "200px", height: "200px" }}
          className="bg-contrast"
          alt={auction.item.name}
        />
        <p>
            {" "}
            Temps restant:{}
            {auction.endDate ? <Timer endTime={auction.endDate} auction={auction}/> : "Auction Completed"}
          </p>
        <p> Plus Offrant : {high} XOF</p>
        <div className="flex justify-between items-center pt-4">
          {(!user || (user && user.id != auction.sellerId)) && (
            <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
              <ModalTriger
                label="Enchérir"
                icon={
                  <>
                    <Plus size={24} />
                    Enchérir
                  </>
                }
                onClick={handleBidButtonClick}
              />
              <ModalBody title="" isOpen={isModalOpen}>
                <MakeBid auctionId={auction.id} />
              </ModalBody>
            </Modal>
          )}
          <Modal>
            <ModalTriger icon={<Eye size={24} />} label="Détail" onClick={() => setIsModalOpen(true)} />
            <ModalBody title={`[${auction.item.category}] ${auction.item.name} `} isOpen={isModalOpen}>
              <div className="grid grid-cols-2 gap-2">
                <img src={auction.item.imgUrl} className="h-full" />
                <div>
                  <p> {auction.item.description} </p>
                  <p> x{auction.item.quantity}  à au moins {auction.item.initial_price} XOF </p>
                  <p> Enchere la plus Haute: {high} XOF </p>
                  <p> Enchere la plus Haute: {high} XOF </p>
                  <p> Enchere la plus Haute: {high} XOF </p>
                </div>
              </div>
            </ModalBody>
          </Modal>
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
            {auction.endDate ? <Timer endTime={auction.endDate} auction={auction} /> : "Auction Completed"}
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
          {high_bids.map((bid, index) => (
            <li
              key={bid.id}
              className="flex justify-between gap-16 border rounded-lg p-4 m-1"
            >
              <span className="p-2 rounded-lg border"> {index + 1}</span>
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
  const user = useUser();
  const myBid = useMyBid(user ? user.id : "", auction.id);
  // const endTime = useMemo(() => auction.endDate, [auction.endDate]);

  return auction !== null ? (
    <>
      <Card>
        <CardHeader className="flex justify-between item-center gap-4">
          <div>
            <p>
              {" "}
              Temps restant <br />
              {auction.endDate ? <Timer endTime={auction.endDate} auction={auction}/> : "Auction Completed"}
            </p>
          </div>
          <div>
            <p> Nom : {auction.item.name}</p>
            <p> Prix Minimum : {auction.item.initial_price} XOF</p>
            <p> Quantité : {auction.item.quantity} </p>
            <p> Plus Offrant : {high} XOF</p>
            {myBid && <p> Mon Offre Actuelle: {myBid.amount} XOF</p>}
          </div>
        </CardHeader>
      </Card>
      <BidAgain bid={myBid} />
    </>
  ) : (
    <> </>
  );
}
