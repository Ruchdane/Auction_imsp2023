import { CreateStockDto } from "@/dto/createStock.dto";
import { firestoreApp } from "@/firebase/config";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";



class StockService {

    async createStock(dto: CreateStockDto) {
        try {
          const newStock = {
            "ownerId": dto.ownerId,
            "items": [], 
          };
          const docRef = await addDoc(collection(firestoreApp, "stocks"), newStock);
    
          return docRef.id; 
        } catch (error) {
          console.log("Erreur lors de la création du stock:", error);
          throw error;
        }
    }

    async getStock(stockId:number) {
      try {
        const stockRef = doc(firestoreApp, `stocks/${stockId}`);
        const stockSnapshot = await getDoc(stockRef);
  
        if (stockSnapshot.exists()) 
          return { id: stockSnapshot.id, ...stockSnapshot.data() };
        else
          return { id: -1 };
      } catch (error) {
        console.log("Erreur lors de la récupération du stock :", error);
        throw error;
      }
    }

}

export default new StockService();