import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Modal, ModalBody, ModalTriger } from "../../ui/modal";

import { useState } from "react";
import { ProductDataTable } from "./data-table";
import CreateItem from "../../form/createitem";

export default function ProductCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <Card>
      <CardHeader className="flex justify-between item-center gap-4">
        <CardTitle> Les Produits</CardTitle>
        <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
          <ModalTriger label="Ajouté un produit" icon={<Plus size={24} />} />
          <ModalBody title="Ajouter un produit" isOpen={isModalOpen}>
            <CreateItem />
          </ModalBody>
        </Modal>
      </CardHeader>
      <CardContent>
        <ProductDataTable />
      </CardContent>
    </Card>
  );
}
