import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Key, UserSearch } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { solicitarRecuperacaoSenha } from "@/services/recovery";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [identificador, setIdentificador] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identificador.trim()) return;

    setLoading(true);
    try {
      const response = await solicitarRecuperacaoSenha(identificador.trim());

      toast({
        variant: "success",
        title: "Verifique seu e-mail",
        description: "Se o usuário existir, um link foi enviado.",
        duration: 3000,
      });

      console.log("[DEBUG] Resposta:", response);
    } catch (err: any) {
      const mensagem =
        err?.response?.data?.error || "Erro ao solicitar recuperação.";
      toast({
        variant: "destructive",
        title: "Erro na solicitação",
        description: mensagem,
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="public-page min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-[500px] bg-white rounded-lg border border-black overflow-hidden shadow-lg p-8">
        <div className="mb-8">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para login</span>
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <Key className="w-8 h-8 text-emerald-500" />
            <h1 className="text-2xl font-bold">Recuperar Senha</h1>
          </div>
          <p className="text-gray-600">
            Informe o seu CPF ou e-mail cadastrado para receber um link de
            redefinição de senha.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              CPF ou E-mail:
            </label>
            <div className="relative">
              <UserSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Digite seu CPF ou e-mail"
                value={identificador}
                onChange={(e) => setIdentificador(e.target.value)}
                className="pl-10 h-12"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full text-lg h-12 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 transition-all duration-300"
            >
              {loading ? "Solicitando..." : "Solicitar recuperação"}
            </Button>
            <Button
              type="button"
              onClick={() => {
                navigate("/renew-password");
              }}
              disabled={loading}
              className="w-full text-lg h-12 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 transition-all duration-300"
            >
              Já tenho chave de validação
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
