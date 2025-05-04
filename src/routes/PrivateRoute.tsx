import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthProvider";

interface ProtectedRouteProps {
  allowedRoles: ("comum" | "operador" | "adm")[];
}

const PrivateRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user } = useAuth();
  const { isLoading } = useContext(AuthContext);

  if (isLoading) return null; // ou um spinner de carregamento

  if (!user || !allowedRoles.includes(user.tipo)) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
