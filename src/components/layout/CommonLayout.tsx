import { SidebarProvider } from "@/components/ui/sidebar";
import { CommonSidebar } from "./CommonSidebar";
import { TopBar } from "./TopBar";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeProvider } from "next-themes";

interface CommonLayoutProps {
  children: React.ReactNode;
}

export const CommonLayout = ({ children }: CommonLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SidebarProvider defaultOpen={!isMobile}>
        <div className="min-h-screen flex w-full dark:bg-background">
          <CommonSidebar />
          <div className="flex-1 flex flex-col">
            <TopBar />
            <main className="flex-1 p-4 md:p-8 overflow-auto">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};