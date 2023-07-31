import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context";
import { useNavigate } from "react-router-dom";

export function useUser() {
  const authContext = useContext(AuthContext);
  const [user, setUser] = useState(authContext?.user || null);

  useEffect(() => {
    const updateUser = async () => {
      if (authContext?.user) {
        setUser(authContext.user);
      } else {
        setUser(null);
      }
    };

    updateUser();
  }, [authContext]);

  return user;
}

export function useRedirectUserToLogin(pathname:string) {
  const user = useUser();
  const navigate = useNavigate();

  const privateLinks = ["/mes_encheres","/mes_produits","/mes_offres"];

  useEffect(() => {
    const checkAuth = async () => {
      if (!user && privateLinks.includes(pathname)) {
        navigate("/authentification", { state: { from: pathname } });
      }
    };

    checkAuth();
  }, [pathname, navigate,user]);

  return user;
}
