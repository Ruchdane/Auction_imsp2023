import { ChevronDown, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Modal, ModalBody, ModalTriger } from "../../ui/modal";
import { useState } from "react";
import MakeBid from "../../form/makebid";
import useAuction, { useAuctionHighBid } from ".";
import { getProduct } from "../product";
import { Link } from "react-router-dom";

interface AuctionCardProps {
  auctionId: number;
}
export default function AuctionCard({ auctionId }: AuctionCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const auction = useAuction(auctionId);
  const product = getProduct(auction?.product);
  return auction === null ? (
    <></>
  ) : (
    <Card>
      <CardHeader className="flex justify-between item-center gap-4">
        <CardTitle> {product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <img
          src={product.src}
          width="200"
          height="200"
          className="bg-contrast"
        />
        <p> Temps restant : {formatTime(auction.time)}</p>
        <p> Plus Offrant : {auction.high_bid} XOF</p>
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

function formatTime(date: Date): string {
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const milli = String(date.getMilliseconds()).padStart(2, "0");
  return `${minutes}:${seconds}:${milli}`;
}

export function BidsCard({ auctionId }: AuctionCardProps) {
  const auction = useAuction(auctionId);
  const high_bids = useAuctionHighBid(auctionId);
  const product = getProduct(auction?.product);
  if (auction === null) return <> </>;
  return (
    <Card className="col-span-2">
      <CardHeader>
        <div>
          <p>
            {" "}
            Temps restant <br /> {formatTime(auction.time)}
          </p>
        </div>
        <div>
          <p>Produit : {product.name}</p>
          <p>Prix Minimum: {product.price}</p>
          <p>Quantity: {product.count}</p>
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-semibold"> Top 5 Encheres </h3>
        <ul className="list-none">
          {high_bids.map((bid, key) => (
            <li className="flex justify-between gap-16 border rounded-lg p-4 m-1">
              <span className="p-2 rounded-lg border"> {key}</span>
              <span> Nom : {bid.username}</span>
              <span> Prix :{bid.price}</span>
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
  const product = getProduct(auction?.product);
  return auction === null ? (
    <></>
  ) : (
    <Card>
      <CardHeader className="flex justify-between item-center gap-4">
        <div>
          <p> Temps restant <br />{formatTime(auction.time)}</p>
        </div>
        <div>

          <p> Nom : {product.name} XOF</p>
          <p> Prix Minimum : {product.price} XOF</p>
          <p> Quantité : {product.count} </p>
          <p> Plus Offrant : {auction.high_bid} XOF</p>
          <p> Mon Offre: {auction.high_bid} XOF</p>
        </div>
      </CardHeader>
    </Card>
  );
}
