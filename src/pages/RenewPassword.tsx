import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Key, Lock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { redefinirSenha, verificarTokenRecuperacao } from "@/services/recovery";

const RenewPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [token, setToken] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [cpf, setCpf] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleValidarToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await verificarTokenRecuperacao(token);
      setCpf(response.cpf); // Exibe CPF se token for válido
      toast({
        variant: "success",
        title: "Token validado com sucesso.",
        description: "Agora você pode redefinir sua senha.",
        duration: 3000,
      });
    } catch (error) {
      toast({
        variant: "warning",
        title: "Token inválido",
        description: "Verifique o código de recuperação e tente novamente.",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRedefinirSenha = async (e: React.FormEvent) => {
    e.preventDefault();

    if (novaSenha.length < 6) {
      toast({
        variant: "warning",
        title: "Senha muito curta",
        description: "A nova senha deve ter pelo menos 6 caracteres.",
        duration: 2000,
      });
      return;
    }

    setLoading(true);

    try {
      await redefinirSenha(token, novaSenha);
      toast({
        variant: "success",
        title: "Senha redefinida",
        description: "Sua senha foi alterada com sucesso.",
        duration: 2000,
      });
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast({
        variant: "warning",
        title: "Erro ao redefinir senha",
        description: "Tente novamente ou solicite nova recuperação.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-[500px] bg-white rounded-lg border border-black overflow-hidden shadow-lg p-8">
        <div className="mb-8">
          <Link
            to="/forgot-password"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <Key className="w-8 h-8 text-emerald-500" />
            <h1 className="text-2xl font-bold">Redefinir Senha</h1>
          </div>
          <p className="text-gray-600">
            {cpf
              ? `CPF identificado: ${cpf}`
              : "Digite o código de recuperação recebido por e-mail"}
          </p>
        </div>

        <form
          onSubmit={cpf ? handleRedefinirSenha : handleValidarToken}
          className="space-y-6"
        >
          <div>
            <label className="block text-sm font-medium mb-2">
              Código de recuperação:
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Digite o código/token"
                className="pl-10 h-12"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
                disabled={!!cpf}
              />
            </div>
          </div>

          {cpf && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Nova senha:
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Digite sua nova senha"
                  className="pl-10 h-12"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full text-lg h-12 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 transition-all duration-300"
            disabled={loading}
          >
            {loading
              ? "Processando..."
              : cpf
              ? "Salvar nova senha"
              : "Validar token"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RenewPassword;
