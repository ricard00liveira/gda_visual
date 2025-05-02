import { createContext, useState, useEffect, ReactNode } from "react";

type UserType = {
  nome: string;
  cpf: string;
  tipo: "comum" | "operador" | "adm";
};

type AuthContextType = {
  user: UserType | null;
  token: string | null;
  login: (data: { token: string; refresh: string; user: UserType }) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Carrega sessão do localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = {
      nome: localStorage.getItem("nome") || "",
      cpf: localStorage.getItem("cpf") || "",
      tipo: (localStorage.getItem("tipo") || "") as UserType["tipo"],
    };
    if (savedToken && savedUser.tipo) {
      setToken(savedToken);
      setUser(savedUser);
    }
  }, []);

  // Login
  const login = ({
    token,
    refresh,
    user,
  }: {
    token: string;
    refresh: string;
    user: UserType;
  }) => {
    setToken(token);
    setUser(user);

    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refresh);
    localStorage.setItem("nome", user.nome);
    localStorage.setItem("cpf", user.cpf);
    localStorage.setItem("tipo", user.tipo);
  };

  // Logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
