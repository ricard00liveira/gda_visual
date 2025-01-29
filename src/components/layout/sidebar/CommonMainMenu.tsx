import { Link } from "react-router-dom";
import { Plus, List } from "lucide-react";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

const commonMenuItems = [
  {
    title: "Nova Denúncia",
    icon: Plus,
    href: "/comum/nova-denuncia",
  },
  {
    title: "Minhas Denúncias",
    icon: List,
    href: "/comum/minhas-denuncias",
  },
];

export const CommonMainMenu = () => {
  return (
    <>
      {commonMenuItems.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild>
            <Link 
              to={item.href}
              className="flex items-center gap-2 w-full pl-5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:pl-0 group-data-[collapsible=icon]:hover:text-white"
            >
              <item.icon className="w-5 h-5" />
              <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
};