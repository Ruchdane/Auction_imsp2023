import { LogOut } from "lucide-react";
import { Navigation, NavigationItem, NavigationItemSection, NavigationSection } from "../ui/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
export function Navbar() {

  return <Navigation>
    <NavigationSection>
      <label className="font-lg">
        Auction System
      </label>
    </NavigationSection>
    <NavigationItemSection
      label={<Profile />}
    >
      <NavigationItem href="" label={<>
        <LogOut size={24} />
        {"Se déconecter"}
      </>
      } />
    </NavigationItemSection>
  </Navigation>
}
function useUser() {
  return {
    name: "John Doe",
    img: "https://api.dicebear.com/6.x/thumbs/svg" //some imageLink
  }
}

const Profile = () => {
  let user = useUser();
  return <>
    <Avatar>
      <AvatarImage src={user.img} />
      <AvatarFallback>{user.name}</AvatarFallback>
    </Avatar>
    {user.name}
  </>
}