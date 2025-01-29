import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { SidebarHeader as Header, SidebarTrigger } from "@/components/ui/sidebar";

export const SidebarHeader = () => {
  return (
    <Header className="p-4">
      <div className="flex items-center justify-between">
        <Link 
          to="/dashboard" 
          className="text-2xl font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden"
        >
          GDA
        </Link>
        <SidebarTrigger className="hover:text-white">
          <Menu className="w-6 h-6" />
        </SidebarTrigger>
      </div>
      <div className="text-sm text-sidebar-foreground/70 mt-2 group-data-[collapsible=icon]:hidden">
        Gerenciador de
        <br />
        Denúncias Ambientais
      </div>
    </Header>
  );
};