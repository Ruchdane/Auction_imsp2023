import { ReactNode } from "react";
import ThemeProvider from "../feature/theme/context";
import { Toaster } from "../ui/toaster";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";

interface LayoutProps {
  children: ReactNode;
}
export default function(props: LayoutProps) {
  return (
    <ThemeProvider>
      <div className="h-screen w-screen overflow-hidden">
        <Navbar />
        <div className="h-full w-full flex">
          <Sidebar />
          <main className="p-4 pb-32 overflow-y-scroll overflow-x w-full h-full">
            {props.children}
          </main>
        </div>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
