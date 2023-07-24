"use client";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { ThemeContext } from "./context";
import { useContext, useMemo } from "react";

import { themes } from "./themes";
import { Button } from "../../ui/button";
export function ThemeSwitcher({ className }: { className?: string }) {
  const { state, toggleTheme } = useContext(ThemeContext);
  const currtheme = useMemo(() => {
    return themes.find((theme) => theme.className === state.className);
  }, [state.className]);
  return (
    <Popover>
      <PopoverTrigger className={className}>{currtheme?.icon}</PopoverTrigger>
      <PopoverContent className="w-fit">
        <ul>
          {themes.map((theme) => (
            <Button
              asChild
              key={theme.name}
              //@ts-ignore
              disabled={currtheme?.theme === theme.theme}
              onClick={() => toggleTheme(theme.className)}
              className="flex justify-between gap-1 bg-main"
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
