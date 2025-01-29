import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Leaf, UserPlus } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();

  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(cpf, password);
    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="public-page min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-[1200px] flex flex-col lg:flex-row border border-black rounded-lg overflow-hidden shadow-lg">
        {/* Lado esquerdo - Hero Section */}
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

        {/* Lado direito - Login Form */}
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

            <div className="mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
                Bem-vindo de volta!
              </h2>
              <p className="text-lg lg:text-xl text-gray-600">
                Conecte-se e continue contribuindo.
              </p>
            </div>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium mb-2">CPF:</label>
                <Input
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  className="h-12"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Senha:</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full text-lg h-12 bg-gradient-to-r from-emerald-600 to-emerald-500"
                disabled={loading}
              >
                {loading ? "Entrando..." : "Entrar"}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
