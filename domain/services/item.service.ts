import { Item, StatusItem } from "../types/items";
import { AddItemDto } from "../dto/addItem.dto";
import { DeleteItemDto } from "../dto/deleteItem.dto";
import { UpdateItemDto } from "../dto/updateItem.dto";
import { firestoreApp } from "../firebase/config";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  ErrorResponse,
  SuccessResponse,
} from "../interfaces/response.interface";

class ItemService {
  async createItem(
    dto: AddItemDto,
  ): Promise<SuccessResponse<string> | ErrorResponse> {
    try {
      const itemData = {
        ...dto,
        status: StatusItem.AVAILABLE,
        sold_price: "",
      };
      const itemCollectionRef = collection(firestoreApp, `items`);

      const existingItemQuery = query(
        itemCollectionRef,
        where("name", "==", dto.name),
        where("stockId", "==", dto.stockId),
      );

      const existingItemSnapshot = await getDocs(existingItemQuery);

      if (!existingItemSnapshot.empty) {
        return {
          success: false,
          message: "Cet article est déjà dans le stock",
        };
      }
      const itemRef = await addDoc(itemCollectionRef, itemData);
      return { success: true, data: itemRef.id };
    } catch (error) {
      console.error("Error creating the item:", error);
      return { success: false, message: "Error creating the item." };
    }
  }

  async getItem(
    itemId: string,
  ): Promise<SuccessResponse<Item> | ErrorResponse> {
    try {
      const itemRef = doc(firestoreApp, "items", itemId);
      const itemSnapshot = await getDoc(itemRef);

      if (itemSnapshot.exists()) {
        const itemData = itemSnapshot.data();
        return {
          success: true,
          data: { id: itemSnapshot.id, ...itemData } as Item,
        };
      } else {
        return { success: false, message: "Article introuvable." };
      }
    } catch (error) {
      console.error("Error retrieving the item:", error);
      return { success: false, message: "Error retrieving the item." };
    }
  }

  async updateItem(
    dto: UpdateItemDto,
  ): Promise<SuccessResponse<null> | ErrorResponse> {
    try {
      const itemRef = doc(firestoreApp, `items/${dto.itemId}`);
      const { itemId: id, stockId, ...updateData } = dto;
      await updateDoc(itemRef, { ...updateData });
      return { success: true, data: null };
    } catch (error) {
      console.error("Error updating the item:", error);
      return { success: false, message: "Error updating the item." };
    }
  }

  async setStatus(
    itemId: string,
    status: StatusItem,
  ): Promise<SuccessResponse<null> | ErrorResponse> {
    try {
      const itemRef = doc(firestoreApp, `items/${itemId}`);
      await updateDoc(itemRef, { status });
      return { success: true, data: null };
    } catch (error) {
      console.error("Error setting the item status:", error);
      return { success: false, message: "Error setting the item status." };
    }
  }

  async deleteItem(
    dto: DeleteItemDto,
  ): Promise<SuccessResponse<null> | ErrorResponse> {
    try {
      const itemRef = doc(firestoreApp, `items/${dto.itemId}`);
      const itemSnapshot = await getDoc(itemRef);
      const itemData = itemSnapshot.data() as Item;
      if (itemData.status === StatusItem.AUCTION) {
        return {
          success: false,
          message: "L'article est actuellement en plein enchère .",
        };
      }
      await deleteDoc(itemRef);
      return { success: true, data: null };
    } catch (error) {
      console.error("Error deleting the item:", error);
      return { success: false, message: "Error deleting the item." };
    }
  }
}

export default new ItemService();
