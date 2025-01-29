import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { ArrowLeft, Key, Mail } from "lucide-react";

const ForgotPassword = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você implementaria a lógica de recuperação de senha
    console.log("Recuperação de senha solicitada");
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
            Digite seu e-mail cadastrado para receber as instruções de recuperação de senha
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              E-mail:
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input 
                type="email" 
                placeholder="Digite seu e-mail"
                className="pl-10 h-12" 
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <Button 
              type="submit"
              className="w-full text-lg h-12 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 transition-all duration-300"
            >
              Enviar instruções
            </Button>

            <div className="text-center">
              <Link
                to="/renew-password"
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
              >
                Já tenho chave de validação
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
