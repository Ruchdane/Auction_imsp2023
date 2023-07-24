import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { ArrowDown } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "../utils";
import { Link } from "react-router-dom";

const Navigation = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <NavigationMenu.Root
      className={cn("sticky border border-primary bg-secondary", className)}
    >
      {children}
    </NavigationMenu.Root>
  );
};

const NavigationSection = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <NavigationMenu.List className={cn("list-none", className)}>
      {children}
    </NavigationMenu.List>
  );
};

export interface NavigationItemSectionProps {
  label: ReactNode;
  children: ReactNode;
}
const NavigationItemSection = ({
  label,
  children,
}: NavigationItemSectionProps) => {
  return (
    <NavigationMenu.Item>
      <NavigationMenu.Trigger className="flex select-none items-center justify-between gap-1 px-3 py-2  font-medium leading-none outline-none ">
        {label}{" "}
      </NavigationMenu.Trigger>
      <NavigationMenu.Content className="absolute z-50 w-fit rounded-md border p-4 shadow-md bg-muted outline-none animate-in ">
        {children}
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  );
};

export interface NavigationItemProps {
  label: ReactNode;
  href: string;
  className?: string;
}

const NavigationItem = ({ href, label, className }: NavigationItemProps) => {
  return (
    <Link to={href}>
    <NavigationMenu.Item className={className}>
      <NavigationMenu.Link>      
        {label}
      </NavigationMenu.Link>
    </NavigationMenu.Item>
    </Link>

  );
};

export { Navigation, NavigationSection, NavigationItemSection, NavigationItem };
