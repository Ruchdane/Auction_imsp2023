import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context";

export function useUser() {
  const authContext = useContext(AuthContext);
  const [user, setUser] = useState(authContext?.user || null);

  useEffect(() => {
    const updateUser = async () => {
      if (authContext?.user) {
        setUser(authContext.user);
      } else {
        setUser(null);
        console.log("No user");
      }
    };

    updateUser();
  }, [authContext]);

  return user;
}
