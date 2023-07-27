import AuthFirebase from "../firebase/auth";
import { RegisterDto } from "../dto/register.dto";
import { LoginDto } from "../dto/login.dto";
import {
  addDoc,
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestoreApp } from "../firebase/config";
import StockService from "./stock.service";

import {
  ErrorResponse,
  SuccessResponse,
} from "../interfaces/response.interface";
import { User } from "../types/user";
import { CreateStockDto } from "../dto/createStock.dto";

class AuthService {
  async signup(
    dto: RegisterDto,
  ): Promise<SuccessResponse<User> | ErrorResponse> {
    try {
      const userCollectionRef = collection(firestoreApp, "users");
      const existingUserQuery = query(
        userCollectionRef,
        where("name", "==", dto.name),
      );

      const existingUserSnapshot = await getDocs(existingUserQuery);

      if (!existingUserSnapshot.empty) {
        return { success: false, message: "You name is already taken" };
      }

      const { user } = await AuthFirebase.createUserWithEmailAndPassword(
        dto.email,
        dto.password,
      );
      const createdUser = await this.createUserWithName(user.uid, dto);
      return { success: true, data: createdUser };
    } catch (error) {
      console.log("Error during signup:", error);
      return { success: false, message: "Error during signup." };
    }
  }

  async login(dto: LoginDto): Promise<SuccessResponse<User> | ErrorResponse> {
    try {
      const { user } = await AuthFirebase.signInWithEmailAndPassword(
        dto.email,
        dto.password,
      );
      const loggedInUser = await this.getUser(user.uid);
      return { success: true, data: loggedInUser };
    } catch (error) {
      console.log("Error during login:", error);
      return { success: false, message: "Error during login." };
    }
  }

  async logout(): Promise<SuccessResponse<null> | ErrorResponse> {
    try {
      await AuthFirebase.signOut();
      return { success: true, data: null };
    } catch (error) {
      console.log("Error during logout:", error);
      return { success: false, message: "Error during logout." };
    }
  }

  private async createUserWithName(
    uid: string,
    dto: RegisterDto,
  ): Promise<User> {
    try {
      const { password, ...userData } = dto;

      const userCollectionRef = collection(firestoreApp, "users");
      const userRef = await addDoc(userCollectionRef, {
        uid,
        ...userData,
        stockId: "",
      });

      const stockData: CreateStockDto = { ownerId: userRef.id };
      const result = await StockService.createStock(stockData);
      let stockId: string;
      if (result.success) {
        stockId = result.data;
      } else {
        throw new Error("Error during createStock");
      }

      await updateDoc(userRef, { stockId });

      return {
        id: userRef.id,
        stockId,
        ...userData,
      };
    } catch (error) {
      console.log("Error during createUserWithName", error);
      throw error;
    }
  }

  private async getUser(uid: string): Promise<User> {
    try {
      const userCollectionRef = collection(firestoreApp, "users");
      const q = query(userCollectionRef, where("uid", "==", uid));
      const userQuerySnapshot = await getDocs(q);

      if (!userQuerySnapshot.empty) {
        const userData = userQuerySnapshot.docs[0].data();
        //@ts-ignore
        return {
          id: userQuerySnapshot.docs[0].id,
          ...userData,
        };
      } else {
        throw new Error("User not found.");
      }
    } catch (error) {
      console.log("Error during getUser", error);
      throw error;
    }
  }
}

export default new AuthService();
