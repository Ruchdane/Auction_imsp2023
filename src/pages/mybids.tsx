import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Modal, ModalBody, ModalTriger } from "../../ui/modal";
import { useState } from "react";
import { ProductDataTable } from "../../feature/product/data-table";
import MakeBid from "../../form/makebid";
import BidAgain from "../../form/bidagain";



export default function MyBids(){
    const [isModalOpen, setIsModalOpen] = useState(false);
    return(
        <Card>
        <CardHeader className="flex justify-between item-center gap-4">
            <CardTitle></CardTitle>
        </CardHeader>
        <CardContent>
            <BidAgain />
        </CardContent>
        </Card>
    )
}