import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Key, Mail, Lock } from "lucide-react";

const RenewPassword = () => {
  const navigate = useNavigate();
  const [isValidated, setIsValidated] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isValidated) {
      // Aqui você implementaria a lógica de salvar a nova senha
      console.log("Nova senha salva");
      navigate('/login');
    } else {
      // Aqui você implementaria a validação do código
      console.log("Código validado");
      setIsValidated(true);
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
            <h1 className="text-2xl font-bold">Renovar Senha</h1>
          </div>
          <p className="text-gray-600">
            {isValidated 
              ? "Digite sua nova senha"
              : "Digite seu e-mail e o código de validação recebido"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
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
                  disabled={isValidated}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Código de validação:
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input 
                  type="text" 
                  placeholder="Digite o código recebido"
                  className="pl-10 h-12" 
                  required
                  disabled={isValidated}
                />
              </div>
            </div>

            {isValidated && (
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
                    required
                  />
                </div>
              </div>
            )}
          </div>

          <Button 
            type="submit"
            className="w-full text-lg h-12 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 transition-all duration-300"
          >
            {isValidated ? "Salvar senha" : "Validar"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RenewPassword;