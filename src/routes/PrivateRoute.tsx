import { AuthContext } from "@/context/AuthProvider";
import { useAuth } from "@/hooks/useAuth";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles: ("comum" | "operador" | "adm")[];
}

const PrivateRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user } = useAuth();
  const { isLoading } = useContext(AuthContext);

  if (isLoading) return null;

  if (!user || !allowedRoles.includes(user.tipo_usuario)) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
