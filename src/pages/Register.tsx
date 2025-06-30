import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { formatCPF } from "@/lib/formatCPF";
import { unmaskCPF } from "@/lib/unmaskCPF";
import { validateCpf } from "@/lib/validateCPF";
import { registerUser } from "@/services/auth";
import { ArrowLeft, ArrowRight, LogIn } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const Register = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    cpf?: boolean;
    nome?: boolean;
    email?: boolean;
    password?: boolean;
    confirmPassword?: boolean;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("CPF:", cpf);
    let cpfValido = unmaskCPF(cpf);
    setError(null);
    setLoading(true);
    const errors: typeof fieldErrors = {
      cpf: !validateCpf(cpfValido),
      nome: nome.trim().length < 3,
      email: !email.includes("@"),
      password: password.length < 6,
      confirmPassword: password !== confirmPassword,
    };

    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean)) {
      console.log("Errors:", errors);
      toast({
        title: "Atenção!",
        description: "Alguns campos estão inválidos.",
        variant: "warning",
        duration: 3000,
      });
      setLoading(false);
      return;
    }
    try {
      await registerUser({
        cpf: cpfValido,
        nome,
        email,
        password,
        self_registration: true,
      });
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Você será redirecionado em instantes.",
        variant: "success",
      });
      setTimeout(() => navigate("/login"), 3000);
    } catch (err: any) {
      const apiErrors = err?.response?.data;

      if (apiErrors?.cpf?.[0] === "user with this CPF already exists.") {
        toast({
          variant: "warning",
          title: "Atenção!",
          description:
            "Esse CPF já está registrado no sistema. Se necessário, recupere o acesso.",
          duration: 4000,
        });
        return;
      }

      if (apiErrors?.email?.[0] === "user with this Email already exists.") {
        toast({
          variant: "warning",
          title: "Atenção!",
          description:
            "Esse endereço de e-mail já está em uso. Se necessário, recupere o acesso.",
          duration: 4000,
        });
        return;
      }

      // fallback: exibe todos os erros genéricos
      if (apiErrors && typeof apiErrors === "object") {
        Object.entries(apiErrors).forEach(([field, messages]) => {
          const msg = Array.isArray(messages) ? messages.join(" ") : messages;
          toast({
            variant: "destructive",
            title: `Erro em ${field}`,
            description: "" + msg,
          });
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao cadastrar",
          description: "Verifique os dados e tente novamente.",
        });
      }
    } finally {
      setLoading(false);
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
              <img src="/logo_gda.png" alt="Logo GDA" className="w-10 h-10" />
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
                  <label className="block text-sm font-medium mb-2">CPF:</label>
                  <Input
                    type="text"
                    value={cpf}
                    onChange={(e) => setCpf(formatCPF(e.target.value))}
                    maxLength={14}
                    placeholder="Somente números (sem pontos ou traços)"
                    className={`h-12 ${
                      fieldErrors.cpf ? "border-red-500" : ""
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nome completo:
                  </label>
                  <Input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Nome completo"
                    className={`h-12 ${
                      fieldErrors.nome ? "border-red-500" : ""
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    E-mail:
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Seu e-mail"
                    className="h-12"
                    required
                  />
                </div>

                <p className="text-xs text-gray-500 mt-2 text-justify">
                  <strong className="text-red-600">Advertência:</strong>{" "}
                  cadastros contendo nomes inexistentes, inverídicos ou
                  ofensivos serão desconsiderados, e as respectivas denúncias
                  serão automaticamente descartadas. Utilize um endereço de
                  e-mail válido para garantir o recebimento de comunicações e
                  informações enviadas pelo sistema.
                </p>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Senha:
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha com mínimo de 6 caracteres"
                    className="h-12"
                    minLength={6}
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
                    placeholder="Confirme sua senha"
                    className={`h-12 ${
                      fieldErrors.confirmPassword ? "border-red-500" : ""
                    }`}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full text-lg h-12 bg-gradient-to-r from-emerald-600 to-emerald-500"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? "Validando..." : "Cadastrar"}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
