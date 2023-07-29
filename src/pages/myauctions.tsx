import { Plus } from "lucide-react";
import { Card, CardContent } from "../../ui/card";
import { Modal, ModalBody, ModalTriger } from "../../ui/modal";
import { useState } from "react";
import CreateAuction from "../../form/createauction";
import { BidsCard } from "../../feature/auction/card";
import { useActiveAuctions } from "../../feature/auction";
import List from "../../ui/list";
import { Auction } from "../../domain/types/auction";

export default function MyAuctions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const activeAuctions = useActiveAuctions();
  const [activeAuction, setActiveAuction] = useState<Auction | null>(null);
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
              setActiveElement={setActiveAuction}
              activeElement={activeAuction}
              elements={activeAuctions}
              display={({ element }) => <>Ventes De {element.item.name}</>}
            />
          </CardContent>
        </Card>
        {activeAuction && <BidsCard auctionId={activeAuction.id} />}
      </div>
    </>
  );
}
