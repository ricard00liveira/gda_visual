import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarMenu,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { AdminMenu } from "./sidebar/AdminMenu";
import { MainMenu } from "./sidebar/MainMenu";
import { SidebarHeader } from "./sidebar/SidebarHeader";

export const Sidebar = () => {
  const { user } = useAuth();
  return (
    <ShadcnSidebar collapsible="icon">
      <SidebarHeader />
      <SidebarContent>
        <SidebarMenu>
          <MainMenu />
          {user.tipo_usuario === "adm" && (
            <>
              <SidebarSeparator className="my-4" />
              <AdminMenu />
            </>
          )}
        </SidebarMenu>
      </SidebarContent>
    </ShadcnSidebar>
  );
};
