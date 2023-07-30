import { CreateStockDto } from "../dto/createStock.dto";
import { firestoreApp } from "../firebase/config";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
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
      console.error("Error during stock creation:", error);
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
      console.error("Error during retrieval of user's stock:", error);
      return {
        success: false,
        message: "L'extraction des articles du stock a échoué.",
      };
    }
  }
  listenStockUser(
    userId: string,
    callback: (stock: Stock | null, error: string | null) => void,
  ): () => void {
    const userRef = doc(firestoreApp, "users", userId);

    // Commencez à écouter les mises à jour en temps réel
    const unsubscribe = onSnapshot(
      userRef,
      async (userSnapshot) => {
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data() as User;

          const stockRef = doc(firestoreApp, "stocks", userData.stockId);
          const stockSnapshot = await getDoc(stockRef);

          if (stockSnapshot.exists()) {
            const stockData = {
              id: stockSnapshot.id,
              ...stockSnapshot.data(),
            } as Stock;

            // Écoutez les mises à jour sur la collection "items" correspondant au stock
            const itemCollectionRef = collection(firestoreApp, "items");
            const itemsQuery = query(
              itemCollectionRef,
              where("stockId", "==", userData.stockId),
              where("status", "in", [StatusItem.AUCTION, StatusItem.AVAILABLE]),
            );

            const unsubscribeItems = onSnapshot(
              itemsQuery,
              (itemsSnapshot) => {
                const items: Item[] = [];
                itemsSnapshot.forEach((itemDoc) => {
                  items.push({ id: itemDoc.id, ...itemDoc.data() } as Item);
                });

                // Mettre à jour les items dans le stock
                stockData.items = items;
                callback(stockData, null);
              },
              (error) => {
                // En cas d'erreur pendant l'écoute, appeler le rappel avec une chaîne d'erreur et des enchères vides
                console.error(
                  "Erreur lors l'écoute des articles du stock d'un utilisateur : " +
                    error.message,
                );

                callback(null, "L'extraction des articles du stock a échoué.");
              },
            );

            // Retourner la fonction de désabonnement pour l'écoute des items
            return () => unsubscribeItems();
          } else {
            // Stock introuvable
            callback(null, "Stock introuvable");
          }
        } else {
          // Utilisateur introuvable
          callback(null, "Utilisateur introuvable.");
        }
      },
      (error) => {
        // En cas d'erreur pendant l'écoute, appeler le rappel avec une chaîne d'erreur et des enchères vides
        console.error(
          "Erreur lors l'écoute des utilisateurs: " + error.message,
        );
      },
    );

    // Retourner la fonction de désabonnement pour l'écoute du stock
    return unsubscribe;
  }
}

export default new StockService();
