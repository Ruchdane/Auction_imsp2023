import {
  Navigation,
  NavigationItem,
  NavigationItemProps,
  NavigationSection,
} from "../ui/navigation";
import { isActive } from "../router";
import { cn } from "../utils";
import { NavLink, useLocation } from "react-router-dom";

const links: NavigationItemProps[] = [
  {
    label: "Acceuil",
    href: "/",
  },
  {
    label: "Mes produit",
    href: "/mes_produits",
  },
  {
    label: "Mes enchères",
    href: "/mes_encheres",
  },
  {
    label: "Mes offres",
    href: "/mes_offres",
  }
];

/*export function Sidebar(){
  return (
    <Navigation className="h-full w-64">
      <NavigationSection className="flex flex-col">
        {links.map((link) => (
          <NavLink 
           to={`${link.href}`}
           className={({ isActive, isPending }) =>
                      isActive
                        ? "px-4 py-6 cursor-pointer w-full text-orange-500"
                        : "px-4 py-6 cursor-pointer w-full"
                    }
          >
            {`${link.label}`}
          </NavLink>
        ))}
      </NavigationSection>
    </Navigation>
  )
}*/

export function Sidebar() {
  const location = useLocation();
  return (
    <Navigation className="h-full w-64">
      <NavigationSection className="flex flex-col">
        {links.map((link, key) => (
          <NavLink
            to={link.href}
            className={cn(
              "px-4 py-6 cursor-pointer w-full",
              (location.pathname === link.href) && "bg-primary hover:bg-muted",
            )}
            key={key}
          >
            {link.label}
          </NavLink>
        ))}
      </NavigationSection>
    </Navigation>
  );
}
