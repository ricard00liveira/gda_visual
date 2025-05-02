import { Link } from "react-router-dom";
import {
  Users,
  Building2,
  Map,
  Building,
  Database,
  ChevronDown,
} from "lucide-react";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

const adminMenuItems = [
  {
    title: "Usuários",
    icon: Users,
    href: "/dashboard/usuarios",
  },
  {
    title: "Logradouros",
    icon: Building2,
    href: "/dashboard/logradouros",
  },
  {
    title: "GeoP",
    icon: Map,
    href: "/dashboard/geop",
  },
  {
    title: "Municípios",
    icon: Building,
    href: "/dashboard/municipios",
  },
  {
    title: "Fatos e SubFatos",
    icon: Database,
    href: "/dashboard/fatos-subfatos",
  },
];

export const AdminMenu = () => {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  // arrumar open={false} para open={isAdminOpen}
  return (
    <Collapsible open={isAdminOpen} onOpenChange={setIsAdminOpen}>
      <CollapsibleTrigger className="w-full px-5 py-2 flex items-center justify-between text-xs font-medium text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden hover:text-sidebar-foreground">
        Administração
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isAdminOpen ? "transform rotate-180" : ""
          }`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        {adminMenuItems.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild>
              <Link
                to={item.href}
                className="flex items-center gap-2 w-full pl-5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:pl-0 group-data-[collapsible=icon]:hover:text-white"
              >
                <item.icon className="w-5 h-5" />
                <span className="group-data-[collapsible=icon]:hidden">
                  {item.title}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};
