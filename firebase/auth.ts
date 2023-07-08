import { authApp } from "@/firebase/config";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

class AuthFirebase {
  createUserWithEmailAndPassword(
    email: string,
    password: string,
  ): Promise<UserCredential> {
    return createUserWithEmailAndPassword(authApp, email, password);
  }
  signInWithEmailAndPassword(
    email: string,
    password: string,
  ): Promise<UserCredential> {
    return signInWithEmailAndPassword(authApp, email, password);
  }
  signOut(): Promise<void> {
    return signOut(authApp);
  }

  signInWithGoogle(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(authApp, provider);
  }
  signInWithFacebook(): Promise<UserCredential> {
    const provider = new FacebookAuthProvider();
    return signInWithPopup(authApp, provider);
  }
}

export default new AuthFirebase();
