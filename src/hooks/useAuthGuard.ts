import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const useAuthGuard = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const tipo = localStorage.getItem("tipo"); // O backend deve retornar o tipo do usuário

    if (!token) {
      navigate("/login"); // Redireciona para login se não estiver autenticado
    } else {
      setUserType(tipo);
    }
  }, [navigate]);

  return { userType };
};
