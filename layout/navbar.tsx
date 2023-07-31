import { Link, useNavigate } from "react-router-dom";
import {
  Navigation,
  NavigationItem,
  NavigationItemSection,
} from "../ui/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ThemeSwitcher } from "../feature/theme";
import { AuthContext } from "../feature/auth/context";
import { useContext } from "react";
import authService from "../domain/services/auth.service";
import { useToast } from "../ui/use-toast";
export function Navbar() {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const navigate = useNavigate();

  const { toast } = useToast();

  const handleLogout = async () => {
    const response = await authService.logout();
    if (response.success) {
      toast({
        title: "Success",
        description: `Déconnexion réussie`,
        variant: "default",
      });
      navigate("/");
    } else {
      toast({
        title: "Error",
        description: `${response.message}`,
        variant: "destructive",
      });
    }
  };

  return (
    <Navigation className="w-full flex justify-between items-center list-none px-8 py-1 h-20">
      <NavigationItem
        href="/"
        label={<label className="cursor-pointer font-lg">Auction System</label>}
      />
      <div className="flex gap-2">
        <ThemeSwitcher />
        {user ? (
          <NavigationItemSection label={<Profile />}>
            <button onClick={handleLogout}>Se déconnecter</button>
          </NavigationItemSection>
        ) : (
          <Link  to="/authentification">Se connecter</Link>
        )}
      </div>
    </Navigation>
  );
}

const Profile = () => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  if (!user) {
    // Vérifier si l'utilisateur est connecté
    return null; // Masquer l'avatar et le nom d'utilisateur si l'utilisateur n'est pas connecté
  }

  return (
    <>
      <Avatar>
        <AvatarImage src={"https://api.dicebear.com/6.x/thumbs/svg"} />
        <AvatarFallback>{user.name}</AvatarFallback>
      </Avatar>
      {user.name}
    </>
  );
};
