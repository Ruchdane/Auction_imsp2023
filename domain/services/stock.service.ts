import { CreateStockDto } from "../dto/createStock.dto";
import { firestoreApp } from "../firebase/config";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { User } from "../types/user";
import { Item, StatusItem } from "../types/items";
import {
  ErrorResponse,
  SuccessResponse,
} from "../interfaces/response.interface";
import { Stock } from "../types/stock";

class StockService {
  async createStock(
    dto: CreateStockDto,
  ): Promise<SuccessResponse<string> | ErrorResponse> {
    try {
      const docRef = await addDoc(collection(firestoreApp, "stocks"), dto);
      return { success: true, data: docRef.id };
    } catch (error) {
      console.log("Error during stock creation:", error);
      return { success: false, message: "Error during stock creation." };
    }
  }

  async getStockUser(
    userId: string,
  ): Promise<SuccessResponse<Stock> | ErrorResponse> {
    try {
      const userRef = doc(firestoreApp, "users", userId);
      const userSnapshot = await getDoc(userRef);

      if (!userSnapshot.exists()) {
        return { success: false, message: "Utilisateur introuvable." };
      }

      const userData = userSnapshot.data() as User;

      const stockRef = doc(firestoreApp, "stocks", userData.stockId);
      const stockSnapshot = await getDoc(stockRef);

      if (!stockSnapshot.exists()) {
        return { success: false, message: "Stock introuvable." };
      }

      // Retrieve the items of the stock
      const itemCollectionRef = collection(firestoreApp, "items");
      const itemsQuery = query(
        itemCollectionRef,
        where("stockId", "==", userData.stockId),
        where("status", "in", [StatusItem.AUCTION, StatusItem.AVAILABLE]),
      );
      const itemsSnapshot = await getDocs(itemsQuery);

      const items: Item[] = [];

      itemsSnapshot.forEach((itemDoc) => {
        items.push({ id: itemDoc.id, ...itemDoc.data() } as Item);
      });

      return {
        success: true,
        data: {
          id: stockSnapshot.id,
          ...stockSnapshot.data(),
          items,
        } as Stock,
      };
    } catch (error) {
      console.log("Error during retrieval of user's stock:", error);
      return {
        success: false,
        message: "Error during retrieval of user's stock.",
      };
    }
  }
}

export default new StockService();
