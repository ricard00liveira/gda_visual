import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, Menu, Settings, User, UserCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
            {user?.imagem_perfil_url ? (
              <img
                src={user.imagem_perfil_url}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover flex-shrink-0 border"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  (
                    e.target as HTMLImageElement
                  ).nextElementSibling?.classList.remove("hidden");
                }}
              />
            ) : null}
            <UserCircle2
              className={`w-8 h-8 text-muted-foreground flex-shrink-0 ${
                user?.imagem_perfil_url ? "hidden" : ""
              }`}
            />
            <div className="text-sm">
              <p className="font-medium">{user?.nome || "Carregando..."}</p>
              <p className="text-muted-foreground">
                {user?.tipo_usuario
                  ? getUserRole(user.tipo_usuario)
                  : "Carregando..."}
              </p>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem
            onClick={() =>
              navigate(
                user?.tipo_usuario === "comum"
                  ? "/comum/perfil"
                  : "/dashboard/perfil"
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
                user?.tipo_usuario === "comum"
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
