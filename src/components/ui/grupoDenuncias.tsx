import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import TypeReportIcon, {
  getStatus,
  getStatusColor,
} from "@/components/ui/typeReportIcon";
import { useState } from "react";

interface GrupoProps {
  grupo: any[];
  titulo: React.ReactNode;
  value: string;
  municipios: Record<number, string>;
  logradouros: Record<number, string>;
  onSelect?: (report: any) => void;
}

const GrupoDenuncias = ({
  grupo,
  titulo,
  value,
  municipios,
  logradouros,
  onSelect,
}: GrupoProps) => {
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const visiveis = mostrarTodos ? grupo : grupo.slice(0, 3);

  return (
    <AccordionItem value={value}>
      <AccordionTrigger
        className="justify-start text-left gap-2"
        disabled={grupo.length < 1}
      >
        <span className="flex items-center gap-2">
          {titulo} ({grupo.length})
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4">
          {visiveis.map((report) => (
            <div
              key={report.numero}
              className="flex justify-between items-center p-4 border rounded-lg hover:shadow-md transition"
              onClick={() => {
                onSelect?.(report);
              }}
            >
              <div className="flex gap-4 items-center">
                <TypeReportIcon status={report.status} type={report.type} />
                <div>
                  <h4 className="font-medium">
                    Denúncia nº {report.numero} -{" "}
                    {new Date(report.data).toLocaleDateString("pt-BR")}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {logradouros[report.endereco] || "Logradouro desconhecido"}{" "}
                    -{" "}
                    {municipios[report.municipio]?.toUpperCase() ||
                      "Município desconhecido"}
                  </p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  report.status
                )}`}
              >
                {getStatus(report.status)}
              </span>
            </div>
          ))}

          {grupo.length > 3 && (
            <div className="text-center">
              <button
                className="text-emerald-600 hover:underline text-sm"
                onClick={() => setMostrarTodos(!mostrarTodos)}
              >
                {mostrarTodos
                  ? "Mostrar menos"
                  : `Ver mais (${grupo.length - 3})`}
              </button>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default GrupoDenuncias;
