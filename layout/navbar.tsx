import { LogOut } from "lucide-react";
import {
  Navigation,
  NavigationItem,
  NavigationItemSection,
} from "../ui/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ThemeSwitcher } from "../feature/theme";
export function Navbar() {
  return (
    <Navigation className="w-full flex justify-between items-center list-none px-8 py-2">
      <NavigationItem
        href="/"
        label={<label className="cursor-pointer font-lg">Auction System</label>}
      />
      <div className="flex gap-2">
        <ThemeSwitcher />
        <NavigationItemSection label={<Profile />}>
          <NavigationItem
            href="/logOut"
            label={
              <div className="flex gap-2">
                <LogOut size={24} />
                {"Se déconecter"}
              </div>
            }
          />
        </NavigationItemSection>
      </div>
    </Navigation>
  );
}
function useUser() {
  return {
    name: "John Doe",
    img: "https://api.dicebear.com/6.x/thumbs/svg", //some imageLink
  };
}

const Profile = () => {
  let user = useUser();
  return (
    <>
      <Avatar>
        <AvatarImage src={user.img} />
        <AvatarFallback>{user.name}</AvatarFallback>
      </Avatar>
      {user.name}
    </>
  );
};
