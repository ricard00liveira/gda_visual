import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { formatCPF } from "@/lib/formatCPF";
import { unmaskCPF } from "@/lib/unmaskCPF";
import { getProfile, loginRequest, updateLastLoginUser } from "@/services/auth";
import { ArrowLeft, Leaf, LogOut, UserCheck, UserPlus } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { login, user, logout } = useAuth();
  const { toast } = useToast();
  const { setTheme } = useTheme();

  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let cpfValido = unmaskCPF(cpf);
    if (!cpfValido.trim() || !password.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "CPF e senha não podem estar vazios.",
        variant: "destructive",
        duration: 2500,
      });
      return;
    }
    if (cpfValido.length !== 11 || !/^[0-9]+$/.test(cpfValido)) {
      toast({
        title: "Atenção",
        description:
          "O CPF informado deve conter exatamente 11 dígitos numéricos.",
        variant: "destructive",
        duration: 2500,
      });
      return;
    }

    setLoading(true);
    try {
      const { access, refresh } = await loginRequest(cpfValido, password);
      const profile = await getProfile(access);
      const tipo = profile.tipo_usuario;

      if (!["comum", "operador", "adm"].includes(tipo)) {
        throw new Error("Tipo de usuário inválido recebido da API.");
      }

      const user = {
        nome: profile.nome,
        cpf: profile.cpf,
        email: profile.email,
        tipo_usuario: tipo as "comum" | "operador" | "adm",
        imagem_perfil_url: profile.imagem_perfil_url,
        user_created: profile.user_created,
      };

      const conf_tema = profile.conf_tema || "light";
      const conf_notEmail = profile.conf_notEmail || false;
      const conf_notPush = profile.conf_notPush || false;
      const conf_notNewDenuncia = profile.conf_notNewDenuncia || false;

      login({
        token: access,
        refresh,
        user,
        conf_tema,
        conf_notEmail,
        conf_notPush,
        conf_notNewDenuncia,
      });
      if (["light", "dark"].includes(conf_tema)) {
        setTheme(conf_tema as "light" | "dark");
      }
      updateLastLoginUser();
      navigate(user.tipo_usuario === "comum" ? "/comum" : "/dashboard");
    } catch (err: any) {
      if (err.response?.status === 401) {
        toast({
          variant: "warning",
          title: "Erro no acesso",
          description: "Usuário não cadastrado ou senha incorreta.",
          duration: 3000,
        });
        setPassword("");
      } else {
        console.log(err);
        toast({
          variant: "destructive",
          title: "Erro ao tentar logar",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleContinuar = () => {
    if (user?.tipo_usuario === "comum") {
      navigate("/comum");
    } else {
      navigate("/dashboard");
    }
  };
  return (
    <div className="public-page min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-[1200px] flex flex-col lg:flex-row border border-black rounded-lg overflow-hidden shadow-lg">
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-[#1A1F2C] to-[#2A3441] text-white p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar para início</span>
            </Link>
            <div className="flex items-center gap-2 mb-8">
              <Leaf className="w-8 h-8 text-emerald-400" />
              <h1 className="text-3xl font-bold">GDA</h1>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 leading-tight">
              Gerenciador de <br /> Denúncias Ambientais
            </h2>
            <p className="text-gray-300 text-base lg:text-lg">
              Faça parte da mudança que queremos ver
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 p-8 lg:p-16 bg-white">
          <div className="max-w-md mx-auto">
            <div className="flex justify-end mb-12">
              <Link
                to="/register"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-all duration-300"
              >
                <span className="group-hover:text-emerald-600 transition-colors">
                  Não tem conta?
                </span>
                <UserPlus className="w-4 h-4 text-emerald-500 group-hover:text-emerald-600 transition-colors" />
              </Link>
            </div>

            {user ? (
              <div className="space-y-6 text-center">
                <UserCheck className="mx-auto w-10 h-10 text-emerald-500 mb-2" />
                <p className="text-lg font-medium">
                  Conectado como:{" "}
                  <span className="text-emerald-600">{user.nome}</span>
                </p>
                <div className="flex flex-col gap-4 mt-6">
                  <Button onClick={handleContinuar} className="w-full h-12">
                    Acessar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={logout}
                    className="w-full h-12"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-12">
                  <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
                    Bem-vindo de volta!
                  </h2>
                  <p className="text-lg lg:text-xl text-gray-600">
                    Conecte-se e continue contribuindo.
                  </p>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      CPF:
                    </label>
                    <Input
                      type="text"
                      value={cpf}
                      onChange={(e) => setCpf(formatCPF(e.target.value))}
                      className="h-12"
                      disabled={loading}
                      maxLength={14}
                      placeholder="Somente números"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Senha:
                    </label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12"
                      disabled={loading}
                      placeholder="Digite sua senha"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full text-lg h-12 bg-gradient-to-r from-emerald-600 to-emerald-500"
                    disabled={loading}
                  >
                    {loading ? "Acessando..." : "Entrar"}
                  </Button>
                  <div className="text-center">
                    <Link
                      to="/forgot-password"
                      className="text-sm text-gray-600 hover:text-primary transition-colors"
                    >
                      Esqueceu sua senha?
                    </Link>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
