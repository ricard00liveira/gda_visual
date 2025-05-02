import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  allowedRoles: ("comum" | "operador" | "adm")[];
}

const PrivateRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.tipo)) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
