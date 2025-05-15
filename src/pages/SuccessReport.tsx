import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const SuccessReport = () => {
  const location = useLocation();
  const isCommonUser = location.pathname.includes("/comum");
  const returnPath = isCommonUser ? "/comum" : "/dashboard";

  return (
    <div className="flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-6 border border-emerald-100">
        <div className="flex justify-center animate-fade-in">
          <CheckCircle2 className="w-20 h-20 text-emerald-500 drop-shadow-md" />
        </div>

        <h1 className="text-3xl font-bold text-gray-800">
          Denúncia enviada com sucesso!
        </h1>

        <p className="text-gray-600 text-sm leading-relaxed">
          Agradecemos sua contribuição para a proteção do meio ambiente.
        </p>

        <div className="flex items-start gap-3 bg-yellow-50 border-l-4 border-[#FFD54F] rounded-md p-4 text-left">
          <span className="mt-1 w-3 h-3 rounded-full bg-[#FFD54F]"></span>
          <div>
            <p className="font-semibold text-yellow-800">🕵️‍♂️ Em Análise</p>
            <p className="text-gray-700 text-sm">
              Sua denúncia foi recebida e está sendo avaliada por nossa equipe.
            </p>
          </div>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed mt-2">
          Você receberá um e-mail com todos os detalhes da sua denúncia.
          <br />
          Para acompanhar o andamento, acesse a seção{" "}
          <span className="font-semibold text-emerald-600">
            "Minhas Denúncias"
          </span>{" "}
          em nosso site ou verifique seu e-mail periodicamente.
        </p>

        <p>
          <Link to={returnPath}>
            <Button
              className="w-full bg-emerald-500 hover:bg-emerald-600 hover:shadow-lg transition-all"
              size="lg"
            >
              Voltar para a página inicial
            </Button>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SuccessReport;
