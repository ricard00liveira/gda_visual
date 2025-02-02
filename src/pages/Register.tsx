import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Leaf, LogIn } from "lucide-react";
import { useState } from "react";
import api from "@/lib/axiosConfig";
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastViewport,
} from "@/components/ui/toast";

const Register = () => {
  const navigate = useNavigate();
  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    cpf?: boolean;
    nome?: boolean;
    email?: boolean;
    password?: boolean;
    confirmPassword?: boolean;
  }>({});

  const validateCpf = (value: string) => /^[0-9]{11}$/.test(value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const errors: typeof fieldErrors = {
      cpf: !validateCpf(cpf),
      nome: nome.trim().length < 3,
      email: !email.includes("@"),
      password: password.length < 6,
      confirmPassword: password !== confirmPassword,
    };

    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean)) {
      setError("Preencha todos os campos corretamente.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/usuarios/create/", {
        cpf,
        nome,
        email,
        password,
        self_registration: true,
      });
      setShowToast(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.log(err);
      setError("Erro ao cadastrar. Verifique os dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToastProvider>
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
                  to="/login"
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-all duration-300"
                >
                  <span className="group-hover:text-emerald-600 transition-colors">
                    Já tem conta?
                  </span>
                  <LogIn className="w-4 h-4 text-emerald-500 group-hover:text-emerald-600 transition-colors" />
                </Link>
              </div>

              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
                    Criar Conta
                  </h2>
                  <p className="text-lg lg:text-xl text-gray-600">
                    Faça parte da mudança que queremos ver
                  </p>
                </div>

                {error && (
                  <p className="text-red-500 text-center mb-4">{error}</p>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      CPF:
                    </label>
                    <Input
                      type="text"
                      value={cpf}
                      onChange={(e) => setCpf(e.target.value)}
                      className={`h-12 ${
                        fieldErrors.cpf ? "border-red-500" : ""
                      }`}
                      required
                    />
                    {fieldErrors.cpf && (
                      <p className="text-red-500 text-sm mt-1">CPF inválido.</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Nome completo:
                    </label>
                    <Input
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className={`h-12 ${
                        fieldErrors.nome ? "border-red-500" : ""
                      }`}
                      required
                    />
                    {fieldErrors.nome && (
                      <p className="text-red-500 text-sm mt-1">
                        Nome inválido.
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      E-mail:
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12"
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
                      minLength={6} // Placeholder for minimum 6 characters
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Confirmar senha:
                    </label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-12"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full text-lg h-12 bg-gradient-to-r from-emerald-600 to-emerald-500"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? "Cadastrando..." : "Cadastrar"}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showToast && (
        <Toast>
          <ToastTitle>Cadastro realizado com sucesso!</ToastTitle>
          <ToastDescription>
            Você será redirecionado para o login.
          </ToastDescription>
        </Toast>
      )}
      <ToastViewport />
    </ToastProvider>
  );
};

export default Register;
