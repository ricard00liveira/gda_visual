import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import TypeReportIcon from "@/components/ui/typeReportIcon";
import { useState } from "react";

interface GrupoProps {
  grupo: any[];
  titulo: React.ReactNode;
  value: string;
  municipios: Record<number, string>;
  logradouros: Record<number, string>;
}

const GrupoDenuncias = ({
  grupo,
  titulo,
  value,
  municipios,
  logradouros,
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
              <span className="text-sm font-medium text-right">
                {report.status === "analise" && "Em Análise"}
                {report.status === "fila" && "Na Fila"}
                {report.status === "atendimento" && "Em Atendimento"}
                {report.status === "concluida" && "Concluída"}
                {report.status === "rejeitada" && "Rejeitada"}
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
