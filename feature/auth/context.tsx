import { onAuthStateChanged } from "firebase/auth";
import React, { createContext, useState, useEffect } from "react";
import { authApp } from "../../domain/firebase/config";
import authService from "../../domain/services/auth.service";
import { User } from "../../domain/types/user";

type AuthContextType = {
  user: User | null;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authApp, async (authUser) => {
      if (authUser) {
        // L'utilisateur est connecté
        const response = await authService.getUser(authUser.uid);
        if (response.success) {
          setUser(response.data);
        } else {
          setUser(null);
          console.error("Error login uid");
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const contextValue: AuthContextType = {
    user,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
