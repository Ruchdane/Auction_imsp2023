import { Plus } from "lucide-react";
import { Card, CardContent } from "../../ui/card";
import { Modal, ModalBody, ModalTriger } from "../../ui/modal";
import { useState } from "react";
import CreateAuction from "../../form/createauction";
import { BidsCard } from "../../feature/auction/card";
import { useAuctionsSeller } from "../../feature/auction";
import List from "../../ui/list";
import { Auction } from "../../domain/types/auction";

export default function MyAuctions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sellerAuctions = useAuctionsSeller();
  const [sellerAuction, setsellerAuction] = useState<Auction | null>(null);
  return (
    <>
      <div className="flex justify-between">
        <h2 className="text-lg font-bold"> Les enchères </h2>
        <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
          <ModalTriger label="Créer un enchère" icon={<Plus size={24} />} />
          <ModalBody title="" isOpen={isModalOpen}>
            <CreateAuction />
          </ModalBody>
        </Modal>
      </div>
      <div className="grid grid-cols-3 items-center justify-center gap-4 pt-8">
        <Card className="w-fit h-fit">
          <CardContent>
            <List
              setActiveElement={setsellerAuction}
              activeElement={sellerAuction}
              elements={sellerAuctions}
              display={({ element }) => <>Ventes De {element.item.name}</>}
            />
          </CardContent>
        </Card>
        {sellerAuction && <BidsCard auction={sellerAuction} />}
      </div>
    </>
  );
}
