import { onAuthStateChanged } from "firebase/auth";
import React, { createContext, useState, useEffect, useContext } from "react";
import { authApp } from "../../domain/firebase/config";
import authService from "../../domain/services/auth.service";
import { User } from "../../domain/types/user";

// Définir le type de l'utilisateur authentifié

// Définir le type du contexte
type AuthContextType = {
  user: User | null;
};

// Créer le contexte
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

// Créer le composant fournisseur (Provider) pour envelopper votre application avec le contexte d'authentification
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  console.log("user:ssss");

  // Utiliser useEffect pour observer le changement d'état d'authentification
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authApp, async (authUser) => {
      if (authUser) {
        console.log("authUser:", authUser);
        // L'utilisateur est connecté
        const response = await authService.getUser(authUser.uid);
        if (response.success) {
          setUser(response.data);
        } else {
          setUser(null);
          console.log("error login uid");
        }
      } else {
        // L'utilisateur n'est pas connecté
        setUser(null);
      }
    });

    // Nettoyer l'abonnement lors du démontage du composant
    return () => unsubscribe();
  }, []);

  // Valeur fournie par le contexte
  const contextValue: AuthContextType = {
    user,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
