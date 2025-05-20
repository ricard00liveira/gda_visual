import { Asterisk, Bird, Dog, Trees } from "lucide-react";

interface Props {
  status: string;
  type: string;
}

// Função auxiliar para retornar a classe de cor
export function getStatusColor(status: string): string {
  const formato = "px-3 py-1 rounded-full text-xs font-medium";
  switch (status) {
    case "analise":
      return `${formato} bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300`;
    case "fila":
      return `${formato} bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300`;
    case "concluida":
      return `${formato} bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300`;
    case "rejeitada":
      return `${formato} bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300`;
    default:
      return `${formato} bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300`;
  }
}

// Função auxiliar para retornar o status formatado
export function getStatus(status: string): string {
  switch (status) {
    case "analise":
      return "Em Análise";
    case "fila":
      return "Na Fila";
    case "atendimento":
      return "Em Atendimento";
    case "concluida":
      return "Concluída";
    case "rejeitada":
      return "Rejeitada";
    default:
      return "Em Análise";
  }
}

// Componente principal
export default function TypeReportIcon({ status, type }: Props) {
  const getStatusIcon = () => {
    switch (type) {
      case "Desmatamento":
        return <Trees className="w-5 h-5" />;
      case "Maus-tratos":
        return <Dog className="w-5 h-5" />;
      case "Fauna":
        return <Bird className="w-5 h-5" />;
      default:
        return <Asterisk className="w-5 h-5" />;
    }
  };

  return (
    <div
      className={`w-10 h-10 ${getStatusColor(
        status
      )} rounded-lg flex items-center justify-center flex-shrink-0`}
    >
      {getStatusIcon()}
    </div>
  );
}
