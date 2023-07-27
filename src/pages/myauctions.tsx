import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Modal, ModalBody, ModalTriger } from "../../ui/modal";
import { useState } from "react";
import CreateAuction from "../../form/createauction";
import ActiveAuctions from "./activeAuctions";
import { BidsCard } from "../../feature/auction/card";

export default function MyAuctions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
          <CardHeader className="flex justify-between item-center gap-4"></CardHeader>
          <CardContent>
            <ActiveAuctions />
          </CardContent>
        </Card>
        <BidsCard auctionId={0} />
      </div>
    </>
  );
}
