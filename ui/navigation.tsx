import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import { ArrowDown } from "lucide-react"
import { ReactNode } from "react"

const Navigation = ({ children }: { children: ReactNode }) => {
  return <NavigationMenu.Root className="relative z-[1] flex w-screen justify-center">
    {children}
  </NavigationMenu.Root>
}

const NavigationSection = ({ children }: { children: ReactNode }) => {
  return <NavigationMenu.List className="center shadow-blackA7 m-0 flex list-none rounded-[6px] bg-white p-1 shadow-[0_2px_10px]">
    {children}
  </NavigationMenu.List>
}

export interface NavigationItemSectionProps {
  label: ReactNode,
  children: ReactNode
}
const NavigationItemSection = ({ label, children }: NavigationItemSectionProps) => {
  return <NavigationMenu.Item>
    <NavigationMenu.Trigger className="text-violet11 hover:bg-violet3 focus:shadow-violet7 group flex select-none items-center justify-between gap-[2px] rounded-[4px] px-3 py-2 text-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]">
      {label}{' '}
      <ArrowDown
        className="text-violet10 relative top-[1px] transition-transform duration-[250] ease-in group-data-[state=open]:-rotate-180"
        aria-hidden
      />
    </NavigationMenu.Trigger>
    <NavigationMenu.Content>
      {children}
    </NavigationMenu.Content>
  </NavigationMenu.Item>

}

export interface NavigationItemProps {
  label: ReactNode,
  href: string,
  isActive?: boolean,
}
const NavigationItem = ({ href, label, isActive }: NavigationItemProps) => {
  return <NavigationMenu.Item>
    <NavigationMenu.Link
      href={href}
      className={"text-violet11 hover:bg-violet3 focus:shadow-violet7 block select-none rounded-[4px] px-3 py-2 text-[15px] font-medium leading-none no-underline outline-none focus:shadow-[0_0_0_2px]" + (isActive ? "bg-violet-600" : "")}>
      {label}
    </NavigationMenu.Link>
  </NavigationMenu.Item>
}

export {
  Navigation,
  NavigationSection,
  NavigationItemSection,
  NavigationItem
}