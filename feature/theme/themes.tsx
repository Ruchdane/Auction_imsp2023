"use client";
import { Sun, Moon, Monitor } from "lucide-react";
import { ReactNode } from "react";
import africaLogo from "../../assets/africa.svg";
import beninLogo from "../../assets/benin.svg";

export interface ThemeElement {
  icon: ReactNode;
  name: string;
  className: string;
}

export const themes: ThemeElement[] = [
  {
    icon: <Sun />,
    name: "Light",
    className: "light",
  },
  {
    icon: <Moon />,
    name: "Dark",
    className: "dark",
  }
];
