import { ReactNode } from "react";
import ThemeProvider from "../feature/theme/context";
import { ThemeSwitcher } from "../feature/theme";
import { Toaster } from "../ui/toaster";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";

interface LayoutProps {
  children: ReactNode;
}
export default function (props: LayoutProps) {
  return (
    <ThemeProvider>
      <div className="h-screen w-screen overflow-hidden">
        <Navbar />
        <div className="h-full w-full flex">
          <Sidebar />
          <main className="overflow-y-auto overflow-x w-full">
            {props.children}
          </main>
        </div>
      </div>
      <ThemeSwitcher className="absolute bottom-8 right-8" />
      <Toaster />
    </ThemeProvider>
  );
}
