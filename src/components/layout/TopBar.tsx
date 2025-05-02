import { LogOut, Settings, User, UserCircle2, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";

export const TopBar = () => {
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  const { user, logout } = useAuth();

  const getUserRole = (tipo: string) => {
    switch (tipo) {
      case "comum":
        return "Pessoa Física";
      case "operador":
        return "Operador";
      case "adm":
        return "Administrador";
      default:
        return "Desconhecido";
    }
  };

  return (
    <div className="bg-background border-b p-4 flex justify-end items-center gap-4">
      {isMobile && (
        <Button
          variant="outline"
          size="icon"
          className="mr-auto"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-3 bg-card rounded-full px-4 py-2 shadow-sm border cursor-pointer">
            <UserCircle2 className="w-8 h-8 text-muted-foreground flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium">{user?.nome || "Carregando..."}</p>
              <p className="text-muted-foreground">
                {user?.tipo ? getUserRole(user.tipo) : "Carregando..."}
              </p>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem
            onClick={() =>
              navigate(
                user?.tipo === "comum" ? "/comum/perfil" : "/dashboard/perfil"
              )
            }
            className="cursor-pointer"
          >
            <User className="mr-2 h-4 w-4" />
            Meu Perfil
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              navigate(
                user?.tipo === "comum"
                  ? "/comum/configuracoes"
                  : "/dashboard/configuracoes"
              )
            }
            className="cursor-pointer"
          >
            <Settings className="mr-2 h-4 w-4" />
            Configurações
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={logout}
            className="cursor-pointer text-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
