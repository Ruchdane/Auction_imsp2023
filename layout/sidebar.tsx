import { Navigation, NavigationItem, NavigationItemProps, NavigationSection, } from "../ui/navigation";
import { isActive } from "../router";

const links: NavigationItemProps[] = [{
  label: "Acceuil",
  href: "/"
}, {
  label: "Mes produit",
  href: "/produit"
}, {
  label: "Mes ventes",
  href: "/ventes"
}, {
  label: "Mes enchères",
  href: "/enchere"
}]
export function Sidebar() {
  return <Navigation>
    <NavigationSection>
      {
        links
          .map(
            (link, key) => (
              <NavigationItem key={key} {...link} isActive={isActive(link.href)} />
            )
          )
      }
    </NavigationSection>
  </Navigation>
}

