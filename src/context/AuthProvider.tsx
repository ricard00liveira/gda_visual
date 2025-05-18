import { ReactNode, createContext, useEffect, useState } from "react";

type UserType = {
  tipo_usuario: "comum" | "operador" | "adm";
  nome: string;
  cpf: string;
  email: string;
  imagem_perfil_url?: string;
  user_created?: string;
};

type UserPreferences = {
  conf_tema: string;
  conf_notEmail: boolean;
  conf_notPush: boolean;
  conf_notNewDenuncia: boolean;
};

type AuthContextType = {
  user: UserType | null;
  token: string | null;
  isLoading: boolean;
  preferences: UserPreferences;
  login: (data: {
    token: string;
    refresh: string;
    user: UserType;
    conf_tema: string;
    conf_notEmail: boolean;
    conf_notPush: boolean;
    conf_notNewDenuncia: boolean;
  }) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>({
    conf_tema: "light",
    conf_notEmail: false,
    conf_notPush: false,
    conf_notNewDenuncia: false,
  });

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = {
      nome: localStorage.getItem("nome") || "",
      cpf: localStorage.getItem("cpf") || "",
      email: localStorage.getItem("email") || "",
      tipo_usuario: (localStorage.getItem("tipo_usuario") ||
        "") as UserType["tipo_usuario"],
      imagem_perfil_url: localStorage.getItem("imagem_perfil_url") || "",
    };

    const savedPreferences: UserPreferences = {
      conf_tema: localStorage.getItem("conf_tema") || "light",
      conf_notEmail: JSON.parse(
        localStorage.getItem("conf_notEmail") || "false"
      ),
      conf_notPush: JSON.parse(localStorage.getItem("conf_notPush") || "false"),
      conf_notNewDenuncia: JSON.parse(
        localStorage.getItem("conf_notNewDenuncia") || "false"
      ),
    };

    if (savedToken && savedUser.tipo_usuario) {
      setToken(savedToken);
      setUser(savedUser);
      setPreferences(savedPreferences);
    }
    setIsLoading(false);
  }, []);

  const login = ({
    token,
    refresh,
    user,
    conf_tema,
    conf_notEmail,
    conf_notPush,
    conf_notNewDenuncia,
  }: {
    token: string;
    refresh: string;
    user: UserType;
    conf_tema: string;
    conf_notEmail: boolean;
    conf_notPush: boolean;
    conf_notNewDenuncia: boolean;
  }) => {
    setToken(token);
    setUser(user);
    const newPrefs: UserPreferences = {
      conf_tema,
      conf_notEmail,
      conf_notPush,
      conf_notNewDenuncia,
    };
    setPreferences(newPrefs);

    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refresh);
    localStorage.setItem("nome", user.nome);
    localStorage.setItem("cpf", user.cpf);
    localStorage.setItem("email", user.email);
    localStorage.setItem("tipo_usuario", user.tipo_usuario);
    localStorage.setItem("imagem_perfil_url", user.imagem_perfil_url || "");
    localStorage.setItem("lastLogin", new Date().toISOString());
    localStorage.setItem("dateCreated", user.user_created || "");

    localStorage.setItem("conf_tema", conf_tema);
    localStorage.setItem("conf_not_email", JSON.stringify(conf_notEmail));
    localStorage.setItem("conf_not_push", JSON.stringify(conf_notPush));
    localStorage.setItem(
      "conf_not_newdenun",
      JSON.stringify(conf_notNewDenuncia)
    );
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setPreferences({
      conf_tema: "light",
      conf_notEmail: false,
      conf_notPush: false,
      conf_notNewDenuncia: false,
    });
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, preferences, login, logout }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
