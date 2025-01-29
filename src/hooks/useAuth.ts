import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/axiosConfig";

export const useAuth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (cpf: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // obter o token
      const tokenResponse = await api.post("/token/", { cpf, password });

      if (!tokenResponse.data.access) {
        throw new Error("Resposta inválida do servidor");
      }

      const { access, refresh } = tokenResponse.data;
      localStorage.setItem("token", access);
      localStorage.setItem("refreshToken", refresh);

      // perfil do usuário
      const profileResponse = await api.get("/profile/", {
        headers: { Authorization: `Bearer ${access}` },
      });

      if (!profileResponse.data.tipo) {
        throw new Error("Não foi possível obter o tipo do usuário");
      }

      const userType = profileResponse.data.tipo;
      localStorage.setItem("tipo", userType);
      const userName = profileResponse.data.nome;
      localStorage.setItem("nome", userName);
      const cpfProfile = profileResponse.data.cpf;
      localStorage.setItem("cpf", cpfProfile);

      // tipo do usuário
      if (userType === "comum") {
        navigate("/comum", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }

      return true;
    } catch (err) {
      setError("Falha no login. Verifique seu CPF e senha.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
