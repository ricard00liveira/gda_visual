import { Button } from "@/components/ui/button";
import { Download, UserPlus } from "lucide-react";

export const ReportActions = () => {
  const handleExport = () => {
    console.log("Exportando denúncia");
  };

  const handleAddToFieldAgent = () => {
    console.log("Adicionando ao agente de campo");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 pt-4">
      <Button onClick={handleExport} variant="outline" className="w-full sm:w-auto">
        <Download className="mr-2 h-4 w-4" />
        Exportar
      </Button>
      <Button
        onClick={handleAddToFieldAgent}
        variant="outline"
        className="w-full sm:w-auto"
      >
        <UserPlus className="mr-2 h-4 w-4" />
        Adicionar ao Agente de Campo
      </Button>
    </div>
  );
};