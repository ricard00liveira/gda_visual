import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarMenu,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { MainMenu } from "./sidebar/MainMenu";
import { AdminMenu } from "./sidebar/AdminMenu";

export const Sidebar = () => {
  return (
    <ShadcnSidebar collapsible="icon">
      <SidebarHeader />
      <SidebarContent>
        <SidebarMenu>
          <MainMenu />
          <SidebarSeparator className="my-4" />
          <AdminMenu />
        </SidebarMenu>
      </SidebarContent>
    </ShadcnSidebar>
  );
};