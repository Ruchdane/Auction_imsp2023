"use client";
import { Sun, Moon, Monitor } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import { ThemeContext, Theme } from "./context";
import { useContext, useMemo } from "react";
import { Button } from "@/ui/button";
const themes = [
  {
    icon: <Sun />,
    theme: Theme.Light,
    name: "Light",
  },
  {
    icon: <Moon />,
    theme: Theme.Dark,
    name: "Dark",
  },
  {
    icon: <Monitor />,
    theme: Theme.System,
    name: "System",
  },
];
export function ThemeSwitcher({ className }: { className?: string }) {
  const { state, toggleTheme } = useContext(ThemeContext);
  const currtheme = useMemo(() => {
    return themes.find((theme) => theme.theme === state.theme);
  }, [state.theme]);
  return (
    <Popover>
      <PopoverTrigger className={className}>{currtheme?.icon}</PopoverTrigger>
      <PopoverContent className="w-fit">
        <ul>
          {themes.map((theme) => (
            <Button
              asChild
              key={theme.name}
              disabled={currtheme?.theme === theme.theme}
              onClick={() => toggleTheme(theme.theme)}
              className="flex justify-between gap-1"
            >
              <li>
                {theme.icon} <span> {theme.name}</span>
              </li>
            </Button>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
