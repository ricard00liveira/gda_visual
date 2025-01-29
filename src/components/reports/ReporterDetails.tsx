import { Button } from "@/components/ui/button";
import { Reporter } from "@/types/reporter";

interface ReporterDetailsProps {
  reporter: Reporter;
  onRemove: () => void;
}

export const ReporterDetails = ({ reporter, onRemove }: ReporterDetailsProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Denunciante</h2>
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-start">
          <div>
            <p>
              <strong>Nome:</strong> {reporter.name}
            </p>
            <p>
              <strong>CPF:</strong> {reporter.cpf}
            </p>
            <p>
              <strong>Telefone:</strong> {reporter.phone}
            </p>
          </div>
          <Button variant="destructive" size="sm" onClick={onRemove}>
            Remover
          </Button>
        </div>
      </div>
    </div>
  );
};