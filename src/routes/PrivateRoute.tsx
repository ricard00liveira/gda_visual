import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

const PrivateRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const tipo = localStorage.getItem("tipo");
    setUserType(tipo);
  }, []);

  if (userType === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        Carregando...
      </div>
    );
  }

  if (!userType) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userType)) {
    return (
      <Navigate to={userType === "comum" ? "/comum" : "/dashboard"} replace />
    );
  }

  return <Outlet />;
};

export default PrivateRoute;
