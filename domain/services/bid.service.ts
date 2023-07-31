import {
  CollectionReference,
  DocumentData,
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
import {
  ErrorResponse,
  SuccessResponse,
} from "../interfaces/response.interface";
import { MakeBidDto } from "../dto/makeBid.dto";
import { BidAgainDto } from "../dto/bidAgain.dto";
import { Bid } from "../types/bid";
import { User } from "../types/user";
import { Auction, StatusAuction } from "../types/auction";
import { Item } from "../types/items";

class BidService {
  async makeBid(
    dto: MakeBidDto,
  ): Promise<SuccessResponse<string> | ErrorResponse> {
    try {
      const userRef = doc(firestoreApp, "users", dto.bidderId);
      const userSnapshot = await getDoc(userRef);
      if (!userSnapshot.exists()) {
        return { success: false, message: "Utilisateur faisant l'offre introuvable." };
      }
      const auctionRef = doc(firestoreApp, "auctions", dto.auctionId);
      const auctionSnapshot = await getDoc(auctionRef);

      if (auctionSnapshot.exists()) {
        const auctionData = auctionSnapshot.data() as Auction;
        if (auctionData.status == StatusAuction.CLOSE)
          return {
            success: false,
            message:
              "L'enhère est déjà terminé vous ne pouvez plus faire d'offre.",
          };
        const itemRef = doc(firestoreApp, "items", auctionData.itemId);
        const itemSnapshot = await getDoc(itemRef);
        if (!itemSnapshot.exists())
          return { success: false, message: "Artcile introuvable" };

        const itemData = itemSnapshot.data() as Item;

        if (itemData.initial_price > dto.amount)
          return {
            success: false,
            message:
              "Le montant de l'offre doit être supérieur au prix de départ de l'article.",
          };

        const bidCollectionRef = collection(firestoreApp, "bids");

        const existingBidQuery = query(
          bidCollectionRef,
          where("auctionId", "==", dto.auctionId),
          where("bidderId", "==", dto.bidderId), // Vérifier si l'utilisateur a déjà une offre pour cette enchère
        );
        const existingBidSnapshot = await getDocs(existingBidQuery);

        if (!existingBidSnapshot.empty) {
          return {
            success: false,
            message: "Vous avez déjà une offre pour cette enchère.",
          };
        }

        const result = await this.checkBid(bidCollectionRef, dto.auctionId, dto.amount);
        if (!result.success) {
          return result
        }
        const newBidData = {
          ...dto,
          updatedDate: Timestamp.now(),
        };

        const newBidRef = await addDoc(bidCollectionRef, newBidData);

        return { success: true, data: newBidRef.id };
      } else {
        return { success: false, message: "Enchère introuvable." };
      }
    } catch (error) {
      console.error("Error making the bid:", error);
      return { success: false, message: "Error making the bid." };
    }
  }
  async bidAgain(
    dto: BidAgainDto,
  ): Promise<SuccessResponse<null> | ErrorResponse> {
    try {
      const bidRef = doc(firestoreApp, "bids", dto.bidId);
      const bidSnapshot = await getDoc(bidRef);

      if (bidSnapshot.exists()) {
        const bidData = bidSnapshot.data() as Bid;
        const bidCollectionRef = collection(firestoreApp, "bids");

        const result = await this.checkBid(bidCollectionRef, bidData.auctionId, dto.amount);
        if (!result.success) {
          return result
        }
        // Effectuez la mise à jour dans Firestore
        await updateDoc(bidRef, {
          amount: dto.amount,
          updatedDate: Timestamp.now(),
        });
        return { success: true, data: null };
      } else {
        return { success: false, message: "Offre introuvable." };
      }
    } catch (error) {
      console.error("Error updating the bid:", error);
      return { success: false, message: "Error updating the bid." };
    }
  }
  private async checkBid(
    bidCollectionRef: CollectionReference<DocumentData, DocumentData>,
    auctionId: string,
    amount: number,
  ):  Promise<SuccessResponse<null> | ErrorResponse> {
    const bidsQuery = query(
      bidCollectionRef,
      where("auctionId", "==", auctionId),
    );
    const bidsSnapshot = await getDocs(bidsQuery);
    const bids: Bid[] = [];

    bidsSnapshot.forEach((bidDoc) => {
      bids.push({ id: bidDoc.id, ...bidDoc.data() } as Bid);
    });

    let highestBid = 0;

    bids.forEach((bid) => {
      if (bid.amount > highestBid) highestBid = bid.amount;
    });

    if (amount <= highestBid) {
      return { success: false, message: "Le montant de l'offre doit être supérieur à l'offre la plus haute actuelle." };
    }
    return { success: true, data :null}
  }

  async getAuction(
    bidId: string,
  ): Promise<SuccessResponse<Bid> | ErrorResponse> {
    try {
      const bidRef = doc(firestoreApp, "bids", bidId);
      const bidSnapshot = await getDoc(bidRef);

      if (bidSnapshot.exists()) {
        const bidData = bidSnapshot.data();
        return {
          success: true,
          data: { id: bidSnapshot.id, ...bidData } as Bid,
        };
      } else {
        return { success: false, message: "Enchère introuvable" };
      }
    } catch (error) {
      console.error("Error retriving the bid:", error);
      return { success: false, message: "Error retriving the bid." };
    }
  }

  async getBidsAuction(
    auctionId: string,
  ): Promise<SuccessResponse<Bid[]> | ErrorResponse> {
    try {
      const bidCollectionRef = collection(firestoreApp, "bids");
      const userCollectionRef = collection(firestoreApp, "users");
      // Créez une requête pour récupérer les offres associées à l'enchère spécifiée (auctionId)
      const bidsQuery = query(
        bidCollectionRef,
        where("auctionId", "==", auctionId),
      );

      // Exécutez la requête et récupérez les offres (bids) correspondantes
      const bidsSnapshot = await getDocs(bidsQuery);

      // Convertissez les données snapshot en tableau d'objets Bid
      const bids: Bid[] = [];
      bidsSnapshot.forEach((bidDoc) => {
        bids.push({ id: bidDoc.id, ...bidDoc.data() } as Bid);
      });
      const bidderIds: string[] = bids.map((it) => it.bidderId);

      //const usersQuery = query(userCollectionRef, where("id", "in", bidderIds));

      // Exécuter la requête et récupérer les utilisateurs correspondants
      const usersSnapshot = await getDocs(userCollectionRef);

      // Convertir les données snapshot en tableau d'objets User
      const users: User[] = [];
      usersSnapshot.forEach((userDoc) => {
        users.push({ id: userDoc.id, ...userDoc.data() } as User);
      });

      //Correspondre chaque élément du tableau Bid à User
      const bidsWithBidders: Bid[] = bids.map((bid) => {
        const bidderId = bid.bidderId;
        const bidder = users.find((user) => user.id === bidderId);
        const bidderDetails = bidder ? bidder : ({} as User);
        let result = bid;
        result.bidder = bidderDetails;
        return result;
      });
      return { success: true, data: bidsWithBidders };
    } catch (error) {
      console.error("Error retriving the bids of an Auction :", error);
      return {
        success: false,
        message: "Error retriving the bids of an Auction.",
      };
    }
  }

  listenBidsAuction(
    auctionId: string,
    callback: (bids: Bid[], error: string | null) => void,
  ): () => void {
    const bidCollectionRef = collection(firestoreApp, "bids");
    const userCollectionRef = collection(firestoreApp, "users");

    // Créez une requête pour récupérer les offres associées à l'enchère spécifiée (auctionId)
    const bidsQuery = query(
      bidCollectionRef,
      where("auctionId", "==", auctionId),
    );

    // Commencez à écouter les mises à jour en temps réel
    const unsubscribe = onSnapshot(
      bidsQuery,
      async (snapshot) => {
        const bids: Bid[] = [];
        snapshot.forEach((bidDoc) => {
          bids.push({ id: bidDoc.id, ...bidDoc.data() } as Bid);
        });

        const bidderIds: string[] = bids.map((it) => it.bidderId);
        if (bidderIds.length === 0) {
          callback([], null);
          return;
        }
        //const usersQuery = query(userCollectionRef, where("id", "in", bidderIds));
        const usersSnapshot = await getDocs(userCollectionRef);

        const users: User[] = [];

        usersSnapshot.forEach((userDoc) => {
          users.push({ id: userDoc.id, ...userDoc.data() } as User);
        });
        const bidsWithBidders: Bid[] = bids.map((bid) => {
          const bidderId = bid.bidderId;
          const bidder = users.find((user) => user.id === bidderId);
          const bidderDetails = bidder ? bidder : ({} as User);
          let result = bid;
          result.bidder = bidderDetails;
          return result;
        });

        callback(bidsWithBidders, null);
      },
      (error) => {
        // En cas d'erreur pendant l'écoute, appeler le rappel avec une chaîne d'erreur et des enchères vides
        console.error(
          "Erreur lors de l'écoute des offres d'une enchère : " + error.message,
        );

        callback([], "L'extraction des offres d'une enchère a échoué ");
      },
    );

    // Retourner la fonction de désabonnement
    return () => unsubscribe();
  }
  async getBidsUser(
    userId: string,
  ): Promise<SuccessResponse<Bid[]> | ErrorResponse> {
    try {
      const bidCollectionRef = collection(firestoreApp, "bids");

      const bidsQuery = query(
        bidCollectionRef,
        where("bidderId", "==", userId),
      );

      const bidsSnapshot = await getDocs(bidsQuery);
      const bids: Bid[] = [];

      bidsSnapshot.forEach((bidDoc) => {
        bids.push({ id: bidDoc.id, ...bidDoc.data() } as Bid);
      });

      return { success: true, data: bids };
    } catch (error) {
      console.error("Error retriving the bids of an User :", error);
      return {
        success: false,
        message: "L'extraction des offres d'un utilisateur a échoué.",
      };
    }
  }
  async getHighestBid(
    auctionId: string,
  ): Promise<SuccessResponse<number> | ErrorResponse> {
    try {
      const bidCollectionRef = collection(firestoreApp, "bids");

      // Créez une requête pour récupérer les offres associées à l'enchère spécifiée (auctionId)
      const bidsQuery = query(
        bidCollectionRef,
        where("auctionId", "==", auctionId),
      );

      // Exécutez la requête et récupérez les offres (bids) correspondantes
      const bidsSnapshot = await getDocs(bidsQuery);

      // Trouver l'offre avec le montant le plus élevé
      let highestBid = 0;
      bidsSnapshot.forEach((bidDoc) => {
        const bidData = bidDoc.data() as Bid;
        if (bidData.amount > highestBid) {
          highestBid = bidData.amount;
        }
      });

      return { success: true, data: highestBid };
    } catch (error) {
      console.error("Error retriving the higthest bids of an Auction :", error);
      return {
        success: false,
        message: "L'extraction de la plus grand offre d'une enchère a échoué",
      };
    }
  }

  listenHighestBid(
    auctionId: string,
    callback: (highestBid: number, error: string | null) => void,
  ): () => void {
    const bidCollectionRef = collection(firestoreApp, "bids");

    // Créez une requête pour récupérer les offres associées à l'enchère spécifiée (auctionId)
    const bidsQuery = query(
      bidCollectionRef,
      where("auctionId", "==", auctionId),
    );

    // Commencez à écouter les mises à jour en temps réel
    const unsubscribe = onSnapshot(
      bidsQuery,
      (snapshot) => {
        let highestBid = 0;
        snapshot.forEach((bidDoc) => {
          const bidData = bidDoc.data() as Bid;
          if (bidData.amount > highestBid) {
            highestBid = bidData.amount;
          }
        });

        callback(highestBid, null);
      },
      (error) => {
        // En cas d'erreur pendant l'écoute, appeler le rappel avec une chaîne d'erreur et des enchères vides
        console.error(
          "Erreur lors de l'écoute de la plus grand offre d'une enchère : " +
            error.message,
        );

        callback(
          0,
          "L'extraction de la plus grand offre d'une enchère a échoué.",
        );
      },
    );

    // Retourner la fonction de désabonnement
    return () => unsubscribe();
  }

  async getCurrentBidUser(
    userId: string,
    auctionId: string,
  ): Promise<SuccessResponse<number> | ErrorResponse> {
    try {
      const bidCollectionRef = collection(firestoreApp, "bids");

      // Créez une requête pour récupérer l'offre actuelle soumise par l'utilisateur spécifié (userId) pour l'enchère donnée (auctionId)
      const userBidQuery = query(
        bidCollectionRef,
        where("auctionId", "==", auctionId),
        where("bidderId", "==", userId),
      );

      // Exécutez la requête et récupérez les offres (bids) correspondantes
      const userBidSnapshot = await getDocs(userBidQuery);

      // Vérifier s'il y a une offre de l'utilisateur pour cette enchère
      if (!userBidSnapshot.empty) {
        const userBidData = userBidSnapshot.docs[0].data() as Bid;
        return { success: true, data: userBidData.amount };
      } else {
        // Aucune offre de l'utilisateur pour cette enchère
        return { success: true, data: 0 };
      }
    } catch (error) {
      console.error(
        "Error retriving the current Bid of an User in an Auction:",
        error,
      );
      return {
        success: false,
        message:
          "L'extraction de l'offre actuelle d'un utilisateur d'une enchère a échoué.",
      };
    }
  }

  listenCurrentBidUser(
    userId: string,
    auctionId: string,
    callback: (currentBid: Bid |null, error: string | null) => void,
  ): () => void {
    const bidCollectionRef = collection(firestoreApp, "bids");

    // Créez une requête pour récupérer l'offre actuelle soumise par l'utilisateur spécifié (userId) pour l'enchère donnée (auctionId)
    const userBidQuery = query(
      bidCollectionRef,
      where("auctionId", "==", auctionId),
      where("bidderId", "==", userId),
    );

    // Commencez à écouter les mises à jour en temps réel
    const unsubscribe = onSnapshot(
      userBidQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          const userBidData = snapshot.docs[0].data();

          callback({id:snapshot.docs[0].id , ...userBidData} as Bid, null);
        } else {
          // Aucune offre de l'utilisateur pour cette enchère
          callback(null, null);
        }
      },
      (error) => {
        // En cas d'erreur pendant l'écoute, appeler le rappel avec une chaîne d'erreur et des enchères vides
        console.error(
          "Erreur lors l'écoute de l'offre actuelle d'un utilisateur d'une enchère : " +
            error.message,
        );

        callback(
          null,
          "L'extraction de l'offre actuelle d'un utilisateur d'une enchère a échoué.",
        );
      },
    );

    // Retourner la fonction de désabonnement
    return () => unsubscribe();
  }
}

export default new BidService();
