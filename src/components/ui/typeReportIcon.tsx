import { Asterisk, Bird, Dog, Trees } from "lucide-react";

interface Props {
  status: string;
  type: string;
}

// Função auxiliar para retornar a classe de cor
export function getStatusColor(status: string): string {
  switch (status) {
    case "analise":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
    case "fila":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
    case "concluida":
      return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
    case "rejeitada":
      return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
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
