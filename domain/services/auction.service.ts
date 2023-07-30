import { Auction, StatusAuction } from "../types/auction";
import { CreateAuctionDto } from "../dto/createAuction.dto";
import { EndAuctionDto } from "../dto/endAuction.dto";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestoreApp } from "../firebase/config";
import itemService from "./item.service";
import { Bid } from "../types/bid";
import {
  SuccessResponse,
  ErrorResponse,
} from "../interfaces/response.interface";
import { Item, StatusItem } from "../types/items";
import bidService from "./bid.service";
class AuctionService {
  async createAuction(
    dto: CreateAuctionDto,
  ): Promise<SuccessResponse<string> | ErrorResponse> {
    try {
      const auctionCollectionRef = collection(firestoreApp, "auctions");
      const existingAuctionQuery = query(
        auctionCollectionRef,
        where("itemId", "==", dto.itemId),
        where("status", "==", StatusAuction.OPEN),
      );

      const existingAuctionSnapshot = await getDocs(existingAuctionQuery);

      if (!existingAuctionSnapshot.empty) {
        return {
          success: false,
          message: "Il existe déjà une enchère en cours pour cet article.",
        };
      }
      const now = Timestamp.now();
      const startDate = now;
      const date = new Date(startDate.seconds * 1000);
      date.setMinutes(date.getMinutes() + 5);
      const endDate = Timestamp.fromDate(date);

      const newAuctionData = {
        ...dto,
        status: StatusAuction.OPEN,
        winner: "",
        startDate,
        endDate,
      };

      const newAuctionRef = await addDoc(auctionCollectionRef, newAuctionData);

      const result = await itemService.setStatus(
        dto.itemId,
        StatusItem.AUCTION,
      );
      if (result.success) {
        result.data;
      } else {
        return result;
      }
      return { success: true, data: newAuctionRef.id };
    } catch (error) {
      console.error("Error creating the auction :", error);
      return {
        success: false,
        message: "La création de l'enchère a échouée.",
      };
    }
  }

  async getAuction(
    auctionId: string,
  ): Promise<SuccessResponse<Auction> | ErrorResponse> {
    try {
      const auctionRef = doc(firestoreApp, "auctions", auctionId);
      const auctionSnapshot = await getDoc(auctionRef);

      if (auctionSnapshot.exists()) {
        const auctionData = auctionSnapshot.data();

        const itemRef = doc(firestoreApp, "items", auctionData.itemId);
        const itemSnapshot = await getDoc(itemRef);
        if (itemSnapshot.exists()) {
          const item = itemSnapshot.data() as Item;
          let result = auctionData;
          result.item = item;
          return {
            success: true,
            data: { id: auctionSnapshot.id, ...result } as Auction,
          };
        } else {
          return { success: false, message: "Article introuvable." };
        }
      } else {
        return { success: false, message: "Enchère introuvable." };
      }
    } catch (error) {
      console.error("Error retrieving auction:", error);
      return {
        success: false,
        message: "L'extraction des données de l'enchère a échoué.",
      };
    }
  }

  async endAuction(
    dto: EndAuctionDto,
  ): Promise<SuccessResponse<null> | ErrorResponse> {
    try {
      const auctionRef = doc(firestoreApp, "auctions", dto.auctionId);
      const result = await this.getAuction(dto.auctionId);
      let auctionData: Auction;
      if (result.success) {
        auctionData = result.data;
      } else {
        return result;
      }
      if (auctionData.status === StatusAuction.OPEN) {
        const response = await bidService.getBidsAuction(dto.auctionId);
        if (response.success) {
          const bids = response.data;

          if (bids.length == 0) {
            const responseRestart = await this.restartAuction(dto.auctionId);
            return responseRestart;
          } else {
            bids.sort((a, b) => b.amount - a.amount);
            const highestBid = bids[0];
            const itemRef = doc(firestoreApp, "items", auctionData.itemId);
            await updateDoc(auctionRef, {
              status: StatusAuction.CLOSE,
              winner: highestBid.bidder.name,
            });
            await updateDoc(itemRef, {
              status: StatusItem.SOLD,
              sold_price: highestBid.amount,
            });

            return { success: true, data: null };
          }
        } else {
          return response;
        }
      } else {
        return { success: false, message: "L'enchère est déjà fermée." };
      }
    } catch (error) {
      console.error("Error ending the auction :", error);
      return {
        success: false,
        message: "La fermerture de l'enchère a échouée.",
      };
    }
  }

  async getActiveAuctions(): Promise<
    SuccessResponse<Auction[]> | ErrorResponse
  > {
    try {
      const auctionCollectionRef = collection(firestoreApp, "auctions");
      const itemCollectionRef = collection(firestoreApp, "items");

      const q = query(
        auctionCollectionRef,
        where("status", "==", StatusAuction.OPEN),
      );
      const activeAuctionsSnapshot = await getDocs(q);
      let activeAuctions: Auction[] = [];

      activeAuctionsSnapshot.forEach((itemDoc) => {
        activeAuctions.push({ id: itemDoc.id, ...itemDoc.data() } as Auction);
      });

      const itemIds: string[] = activeAuctions.map((it) => it.itemId);
      if (itemIds.length === 0) return { success: true, data: [] };
      //const itemsQuery = query(itemCollectionRef, where("id", "in", itemIds));

      const itemsSnapshot = await getDocs(itemCollectionRef);

      const items: Item[] = [];
      itemsSnapshot.forEach((itemDoc) => {
        items.push({ id: itemDoc.id, ...itemDoc.data() } as Item);
      });

      //Correspondre chaque élément du tableau Bid à User
      const auctionsWithAuctionders: Auction[] = activeAuctions.map(
        (auction) => {
          const itemId = auction.itemId;
          const item = items.find((it) => it.id === itemId);
          const itemDetails = item ? item : ({} as Item);
          let result = auction;
          result.item = itemDetails;
          return result;
        },
      );

      return { success: true, data: auctionsWithAuctionders };
    } catch (error) {
      console.error("Error retrieving active auctions :", error);
      return {
        success: false,
        message: "L'extraction des enchères actives a échoué.",
      };
    }
  }

  private async restartAuction(
    auctionId: string,
  ): Promise<SuccessResponse<null> | ErrorResponse> {
    try {
      const itemRef = doc(firestoreApp, `auctions/${auctionId}`);
      const now = Timestamp.now();
      const startDate = now;
      const date = new Date(startDate.seconds * 1000);
      date.setMinutes(date.getMinutes() + 5);
      const endDate = Timestamp.fromDate(date);

      await updateDoc(itemRef, { startDate, endDate });
      return { success: true, data: null };
    } catch (error) {
      console.error("Error restarting the auction:", error);
      return { success: false, message: "La relance d'une enchère a échouée." };
    }
  }

  listenActiveAuctions(
    callback: (activeAuctions: Auction[], error: string | null) => void,
  ): () => void {
    const auctionCollectionRef = collection(firestoreApp, "auctions");
    const itemCollectionRef = collection(firestoreApp, "items");
    const q = query(
      auctionCollectionRef,
      where("status", "==", StatusAuction.OPEN),
    );

    // OnSnapshot écoute les mises à jour en temps réel
    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const activeAuctions: Auction[] = [];

        snapshot.forEach((itemDoc) => {
          activeAuctions.push({ id: itemDoc.id, ...itemDoc.data() } as Auction);
        });
        const itemIds: string[] = activeAuctions.map((it) => it.itemId);
        if (itemIds.length === 0) {
          callback([], null);
          return;
        }

        const itemsSnapshot = await getDocs(itemCollectionRef);

        const items: Item[] = [];
        itemsSnapshot.forEach((itemDoc) => {
          items.push({ id: itemDoc.id, ...itemDoc.data() } as Item);
        });

        const auctionsWithItem: Auction[] = activeAuctions.map((auction) => {
          const itemId = auction.itemId;
          const item = items.find((it) => it.id === itemId);
          const itemDetails = item ? item : ({} as Item);
          let result = auction;
          result.item = itemDetails;
          return result;
        });
        callback(auctionsWithItem, null);
      },
      (error) => {
        // En cas d'erreur pendant l'écoute, appeler le rappel avec une chaîne d'erreur et des enchères vides
        console.error(
          "Erreur lors de l'écoute des enchères actives : " + error.message,
        );

        callback([], "L'extraction des enchères actives a échoué.");
      },
    );

    // Retourner une fonction pour se désabonner lorsqu'elle n'est plus nécessaire
    return () => unsubscribe();
  }

  async getAuctionsFromSeller(
    userId: string,
  ): Promise<SuccessResponse<Auction[]> | ErrorResponse> {
    try {
      const auctionCollectionRef = collection(firestoreApp, "auctions");
      const itemCollectionRef = collection(firestoreApp, "items");
      const q = query(
        auctionCollectionRef,
        where("sellerId", "==", userId),
        where("status", "==", StatusAuction.OPEN),
      );
      const userAuctionsSnapshot = await getDocs(q);

      const userAuctions: Auction[] = [];

      userAuctionsSnapshot.forEach((itemDoc) => {
        userAuctions.push({ id: itemDoc.id, ...itemDoc.data() } as Auction);
      });

      const itemIds: string[] = userAuctions.map((it) => it.itemId);
      if (itemIds.length === 0) {
        return { success: true, data: [] };
      }

      const itemsSnapshot = await getDocs(itemCollectionRef);

      const items: Item[] = [];
      itemsSnapshot.forEach((itemDoc) => {
        items.push({ id: itemDoc.id, ...itemDoc.data() } as Item);
      });

      const auctionsWithItem: Auction[] = userAuctions.map((auction) => {
        const itemId = auction.itemId;
        const item = items.find((it) => it.id === itemId);
        const itemDetails = item ? item : ({} as Item);
        let result = auction;
        result.item = itemDetails;
        return result;
      });

      return { success: true, data: auctionsWithItem };
    } catch (error) {
      console.error(
        "Error retrieving auctions associated with the seller:",
        error,
      );
      return {
        success: false,
        message: "L'extraction des enchères du vendeur a échoué.",
      };
    }
  }

  listenAuctionsFromSeller(
    userId: string,
    callback: (updatedAuctions: Auction[], error: string | null) => void,
  ): () => void {
    const auctionCollectionRef = collection(firestoreApp, "auctions");
    const itemCollectionRef = collection(firestoreApp, "items");
    const q = query(
      auctionCollectionRef,
      where("sellerId", "==", userId),
      where("status", "==", StatusAuction.OPEN),
    );

    const unsubscribe = onSnapshot(
      q,
      async (querySnapshot) => {
        const updatedAuctions: Auction[] = [];

        querySnapshot.forEach((itemDoc) => {
          updatedAuctions.push({
            id: itemDoc.id,
            ...itemDoc.data(),
          } as Auction);
        });
        const itemIds: string[] = updatedAuctions.map((it) => it.itemId);
        if (itemIds.length === 0) {
          callback([], null);
          return;
        }

        const itemsSnapshot = await getDocs(itemCollectionRef);

        const items: Item[] = [];
        itemsSnapshot.forEach((itemDoc) => {
          items.push({ id: itemDoc.id, ...itemDoc.data() } as Item);
        });

        const auctionsWithItems: Auction[] = updatedAuctions.map((auction) => {
          const itemId = auction.itemId;
          const item = items.find((it) => it.id === itemId);
          const itemDetails = item ? item : ({} as Item);
          let result = auction;
          result.item = itemDetails;
          return result;
        });

        callback(auctionsWithItems, null);
      },
      (error) => {
        // En cas d'erreur pendant l'écoute, appeler le rappel avec une chaîne d'erreur et des enchères vides
        console.error(
          "Erreur lors de l'écoute des enchères du vendeur : " + error.message,
        );

        callback([], "L'extraction des enchères du vendeur a échoué ");
      },
    );

    // Retourner une fonction pour désabonner l'écoute en temps réel lorsque cela n'est plus nécessaire
    return unsubscribe;
  }

  async getAuctionsFromBidder(
    userId: string,
  ): Promise<SuccessResponse<Auction[]> | ErrorResponse> {
    try {
      const bidCollectionRef = collection(firestoreApp, "bids");
      const auctionsCollectionRef = collection(firestoreApp, "auctions");
      const itemCollectionRef = collection(firestoreApp, "items");
      const auctions: Auction[] = [];
      // Créez une requête pour récupérer les offres de l'utilisateur donné (userId)
      const bidsQuery = query(
        bidCollectionRef,
        where("bidderId", "==", userId),
      );

      // Exécutez la requête et récupérez les offres (bids) correspondantes
      const bidsSnapshot = await getDocs(bidsQuery);

      // Convertissez les données snapshot en tableau d'objets Bid
      const bids: Bid[] = [];
      bidsSnapshot.forEach((bidDoc) => {
        bids.push({ id: bidDoc.id, ...bidDoc.data() } as Bid);
      });
      if (bids.length == 0) {
        return { success: true, data: auctions };
      }

      // Récupérez les ID uniques des enchères associées aux offres
      const auctionIds: string[] = Array.from(
        new Set(bids.map((bid) => bid.auctionId)),
      );

      // Créez une requête pour récupérer les enchères associées aux ID récupérés
      const auctionsQuery = query(
        auctionsCollectionRef,
        where("id", "in", auctionIds),
        where("status", "==", StatusAuction.OPEN),
      );

      // Exécutez la requête et récupérez les enchères correspondantes
      const auctionsSnapshot = await getDocs(auctionsQuery);

      // Convertissez les données snapshot en tableau d'objets Auction

      auctionsSnapshot.forEach((auctionDoc) => {
        auctions.push({ id: auctionDoc.id, ...auctionDoc.data() } as Auction);
      });

      const itemIds: string[] = auctions.map((it) => it.itemId);
      if (itemIds.length === 0) {
        return { success: true, data: [] };
      }

      const itemsSnapshot = await getDocs(itemCollectionRef);

      const items: Item[] = [];
      itemsSnapshot.forEach((itemDoc) => {
        items.push({ id: itemDoc.id, ...itemDoc.data() } as Item);
      });

      const auctionsWithItem: Auction[] = auctions.map((auction) => {
        const itemId = auction.itemId;
        const item = items.find((it) => it.id === itemId);
        const itemDetails = item ? item : ({} as Item);
        let result = auction;
        result.item = itemDetails;
        return result;
      });

      return { success: true, data: auctionsWithItem };
    } catch (error) {
      console.error(
        "Error retrieving auctions associated with the bidder:",
        error,
      );
      return {
        success: false,
        message: "L'extraction des enchères de l'enchérisseur a échoué.",
      };
    }
  }

  listenAuctionsFromBidder(
    userId: string,
    callback: (updatedAuctions: Auction[], error: string | null) => void
  ): () => void {
    const bidCollectionRef = collection(firestoreApp, "bids");
    const auctionsCollectionRef = collection(firestoreApp, "auctions");
    const itemCollectionRef = collection(firestoreApp, "items");
  
    // Créez une requête pour récupérer les offres de l'utilisateur donné (userId)
    const bidsQuery = query(
      bidCollectionRef,
      where("bidderId", "==", userId),
    );
  
    // Démarrer l'écoute en temps réel des offres associées à l'enchérisseur spécifique
    const unsubscribe = onSnapshot(bidsQuery, async (bidsSnapshot) => {
      const auctions: Auction[] = [];
      const bids: Bid[] = [];
  
      bidsSnapshot.forEach((bidDoc) => {
        bids.push({ id: bidDoc.id, ...bidDoc.data() } as Bid);
      });
  
      if (bids.length === 0) {
        // Si l'enchérisseur n'a pas d'offres, appeler le rappel avec des enchères vides et null pour l'erreur
        callback(auctions, null);
        return;
      }
  
      // Récupérez les ID uniques des enchères associées aux offres
      const auctionIds: string[] = Array.from(
        new Set(bids.map((bid) => bid.auctionId)),
      );
  
      // Créez une requête pour récupérer les enchères associées aux ID récupérés
      const auctionsQuery = query(
        auctionsCollectionRef,
        where("id", "in", auctionIds),
        where("status", "==", StatusAuction.OPEN),
      );
  
      // Exécutez la requête et récupérez les enchères correspondantes
      const auctionsSnapshot = await getDocs(auctionsQuery);
  
      auctionsSnapshot.forEach((auctionDoc) => {
        auctions.push({ id: auctionDoc.id, ...auctionDoc.data() } as Auction);
      });
  
      const itemIds: string[] = auctions.map((it) => it.itemId);
      if (itemIds.length === 0) {
        // Si les enchères n'ont pas d'élément associé, appeler le rappel avec des enchères vides et null pour l'erreur
        callback(auctions, null);
        return;
      }
  
      const itemsSnapshot = await getDocs(itemCollectionRef);
  
      const items: Item[] = [];
      itemsSnapshot.forEach((itemDoc) => {
        items.push({ id: itemDoc.id, ...itemDoc.data() } as Item);
      });
  
      const auctionsWithItem: Auction[] = auctions.map((auction) => {
        const itemId = auction.itemId;
        const item = items.find((it) => it.id === itemId);
        const itemDetails = item ? item : ({} as Item);
        let result = auction;
        result.item = itemDetails;
        return result;
      });
  
      // Appeler le rappel avec les enchères mises à jour et null pour l'erreur
      callback(auctionsWithItem, null);
    }, (error) => {
      // En cas d'erreur pendant l'écoute, appeler le rappel avec une chaîne d'erreur et des enchères vides
      callback([], "Erreur lors de l'écoute des enchères de l'enchérisseur : " + error.message);
    });
  
    // Retourner une fonction pour désabonner l'écoute en temps réel lorsque cela n'est plus nécessaire
    return unsubscribe;
  }
  
}

export default new AuctionService();
