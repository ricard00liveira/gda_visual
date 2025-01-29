import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { CommonSidebarHeader } from "./sidebar/CommonSidebarHeader";
import { CommonMainMenu } from "./sidebar/CommonMainMenu";

export const CommonSidebar = () => {
  return (
    <Sidebar collapsible="icon">
      <CommonSidebarHeader />
      <SidebarContent>
        <SidebarMenu>
          <CommonMainMenu />
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};