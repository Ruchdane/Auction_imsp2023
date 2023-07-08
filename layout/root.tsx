import { ReactNode } from "react";
import ThemeProvider from "../feature/theme/context";
import { ThemeSwitcher } from "../feature/theme";
import { Toaster } from "../ui/toaster";

interface LayoutProps {
  children: ReactNode;
}
export default function(props: LayoutProps) {
  return <ThemeProvider>
    {props.children}
    <ThemeSwitcher className="absolute bottom-8 right-8" />
    <Toaster />
  </ThemeProvider>;
}
