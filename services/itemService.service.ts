import { AddItemDto } from "@/dto/addItem.dto";
import { DeleteItemDto } from "@/dto/deleteItem.dto";
import { UpdateItemDto } from "@/dto/updateItem.dto";
import { firestoreApp } from "@/firebase/config";
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";

class ItemService {
    async createItem(dto:AddItemDto){
        try {
            const itemData = {
                ...dto,
                status:'available'
            };

            const docRef = await addDoc(collection(firestoreApp, `stocks/${dto.stockId}/items`), itemData);
        
            return docRef.id;

        } catch (error) {
             console.log("Erreur lors de la création de l'article:", error);
            throw error;
        }
        
    }
    
    async updateItem(dto :UpdateItemDto) {
        try {
          const itemRef = doc(firestoreApp,`stocks/${dto.stockId}/items/${dto.itemId}`);
          const { itemId: id, ...updateData } = dto;

          await updateDoc(itemRef, updateData);
          console.log("Article mis à jour avec succès !");
        } catch (error) {
          console.log("Erreur lors de la mise à jour de l'article :", error);
          throw error;
        }
    }

    async deleteItem(dto:DeleteItemDto) {
        try {
          const itemRef = doc(firestoreApp, `stocks/${dto.stockId}/items/${dto.itemId}`);

          await deleteDoc(itemRef);
          console.log("Article supprimé avec succès !");
        } catch (error) {
          console.log("Erreur lors de la suppression de l'article :", error);
          throw error;
        }
      }
}

export default new ItemService();