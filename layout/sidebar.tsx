import {
  Navigation,
  NavigationItem,
  NavigationItemProps,
  NavigationSection,
} from "../ui/navigation";
import { isActive } from "../router";
import { cn } from "../utils";

const links: NavigationItemProps[] = [
  {
    label: "Acceuil",
    href: "/",
  },
  {
    label: "Mes produit",
    href: "/produit",
  },
  {
    label: "Mes ventes",
    href: "/ventes",
  },
  {
    label: "Mes enchères",
    href: "/enchere",
  },
];
export function Sidebar() {
  return (
    <Navigation className="h-full w-64">
      <NavigationSection className="flex flex-col">
        {links.map((link, key) => (
          <NavigationItem
            className={
              cn("px-4 py-6 cursor-pointer w-full",
                isActive(link.href) && "bg-primary hover:bg-muted")}
            key={key} {...link} />
        ))}
      </NavigationSection>
    </Navigation>
  );
}
