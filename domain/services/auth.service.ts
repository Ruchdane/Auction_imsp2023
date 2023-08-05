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
        return {
          success: false,
          message: "Cet nom est déjà utilisé par un autre utilisateur.",
        };
      }

      const { user } = await AuthFirebase.createUserWithEmailAndPassword(
        dto.email,
        dto.password,
      );
      const createdUser = await this.createUserWithName(user.uid, dto);
      return { success: true, data: createdUser };
    } catch (error: any) {
      console.error("Error during signup:", error);
      let errorMessage =
        "Une erreur s'est produite lors de l'inscription. Veuillez réessayer plus tard.";

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Cet email est déjà utilisé par un autre utilisateur.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "L'adresse email fournie est invalide.";
      } else if (error.code === "auth/weak-password") {
        errorMessage =
          "Le mot de passe est trop faible. Veuillez choisir un mot de passe plus fort.";
      }
      return { success: false, message: errorMessage };
    }
  }

  async login(dto: LoginDto): Promise<SuccessResponse<User> | ErrorResponse> {
    try {
      const { user } = await AuthFirebase.signInWithEmailAndPassword(
        dto.email,
        dto.password,
      );

      const response = await this.getUser(user.uid);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return response;
      }
    } catch (error: any) {
      console.error("Error during login:", error);

      let errorMessage =
        "Une erreur s'est produite lors de la connexion. Veuillez réessayer plus tard.";

      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        errorMessage =
          "Identifiants incorrects. Veuillez vérifier votre email et votre mot de passe.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "L'adresse email fournie est invalide.";
      }

      return { success: false, message: errorMessage };
    }
  }

  async logout(): Promise<SuccessResponse<null> | ErrorResponse> {
    try {
      await AuthFirebase.signOut();
      return { success: true, data: null };
    } catch (error) {
      console.error("Error during logout:", error);
      return {
        success: false,
        message:
          "Une erreur s'est produite lors de la déconnexion. Veuillez réessayer plus tard.",
      };
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
      console.error("Error during createUserWithName", error);
      throw error;
    }
  }

  public async getUser(
    uid: string,
  ): Promise<SuccessResponse<User> | ErrorResponse> {
    try {
      const userCollectionRef = collection(firestoreApp, "users");
      const q = query(userCollectionRef, where("uid", "==", uid));
      const userQuerySnapshot = await getDocs(q);

      if (!userQuerySnapshot.empty) {
        const userData = userQuerySnapshot.docs[0].data();
        //@ts-ignore

        return {
          success: true,
          data: { id: userQuerySnapshot.docs[0].id, ...userData } as User,
        };
      } else {
        throw new Error("Utilisateur introuvable.");
      }
    } catch (error) {
      console.error("Error during getUser", error);
      throw error;
    }
  }
}

export default new AuthService();
