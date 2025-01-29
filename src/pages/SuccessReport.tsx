import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const SuccessReport = () => {
  const location = useLocation();
  const isCommonUser = location.pathname.includes("/comum");
  const returnPath = isCommonUser ? "/comum" : "/dashboard";

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card rounded-lg shadow-lg p-8 text-center space-y-6 border">
        <div className="flex justify-center">
          <CheckCircle2 className="w-20 h-20 text-emerald-500" />
        </div>
        
        <h1 className="text-2xl font-bold">
          Obrigado! Sua denúncia foi enviada para análise.
        </h1>
        
        <p className="text-muted-foreground">
          Nossa equipe irá avaliar sua denúncia e tomar as providências necessárias.
          Você pode acompanhar o status através do menu "Minhas Denúncias".
        </p>

        <Link to={returnPath}>
          <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
            Voltar para página inicial
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SuccessReport;