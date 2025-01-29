import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const SuccessAnonymous = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle2 className="w-20 h-20 text-emerald-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900">
          Obrigado! Sua denúncia foi enviada!
        </h1>
        
        <p className="text-gray-600">
          Agradecemos sua contribuição para a proteção do meio ambiente.
        </p>

        <Link to="/">
          <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
            Voltar para página inicial
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SuccessAnonymous;