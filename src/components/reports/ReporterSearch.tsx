import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ReporterSearchProps {
  reporterSearch: string;
  onSearchChange: (value: string) => void;
  onNewReporter: () => void;
}

export const ReporterSearch = ({
  reporterSearch,
  onSearchChange,
  onNewReporter,
}: ReporterSearchProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Denunciante</h2>
      <div className="flex gap-2">
        <Input
          placeholder="Buscar por nome ou CPF"
          value={reporterSearch}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <Button type="button" onClick={onNewReporter}>
          Novo Denunciante
        </Button>
      </div>
    </div>
  );
};