import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Report } from "@/types/report";
import { X } from "lucide-react";

interface ReportContentProps {
  report: Report;
  isEditing: boolean;
  onReportChange: (updatedReport: Report) => void;
  onDeleteImage: (index: number) => void;
}
const getStatusColor = (status: string) => {
  switch (status) {
    case "analise":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
    case "fila":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
    case "concluida":
      return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
    case "negada":
      return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
  }
};
export const ReportContent = ({
  report,
  isEditing,
  onReportChange,
}: //onDeleteImage,
ReportContentProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-lg">{`Denúncia nº ${report.numero}`}</h3>
          {isEditing ? (
            <Input
              value={report.endereco}
              onChange={(e) =>
                onReportChange({ ...report, endereco: e.target.value })
              }
              className="text-sm text-muted-foreground mt-1"
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              {report.endereco} - {report.municipio.toUpperCase()}
            </p>
          )}
        </div>

        <div className="grid gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            {isEditing ? (
              <Input
                value={report.status}
                onChange={(e) =>
                  onReportChange({ ...report, status: e.target.value })
                }
              />
            ) : (
              <div className="flex items-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    report.status
                  )}`}
                >
                  {report.status === "analise" && "Em análise"}
                  {report.status === "fila" && "Aguardando atendimento"}
                  {report.status === "concluida" && "Atendimento concluído"}
                  {report.status === "negada" && "Denúncia rejeitada"}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Fato</label>
            {isEditing ? (
              <Input
                value={report.fato}
                onChange={(e) =>
                  onReportChange({ ...report, fato: e.target.value })
                }
              />
            ) : (
              <p className="text-sm">{report.fato}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">SubFato</label>
            {isEditing ? (
              <Input
                value={report.subfato}
                onChange={(e) =>
                  onReportChange({ ...report, subfato: e.target.value })
                }
              />
            ) : (
              <p className="text-sm">{report.subfato}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Descrição</label>
            {isEditing ? (
              <Textarea
                value={report.descricao}
                onChange={(e) =>
                  onReportChange({ ...report, descricao: e.target.value })
                }
              />
            ) : (
              <p className="text-sm">{report.descricao}</p>
            )}
          </div>

          {/* <div className="space-y-2">
            <label className="text-sm font-medium">Evidências</label>
            {isEditing ? (
              <Textarea
                value={report.evidence.description}
                onChange={(e) =>
                  onReportChange({
                    ...report,
                    evidence: {
                      ...report.evidence,
                      description: e.target.value,
                    },
                  })
                }
              />
            ) : (
              <p className="text-sm">{report.evidence.description}</p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
              {report.evidence.images.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden group"
                >
                  <img
                    src={image}
                    alt={`Evidência ${index + 1}`}
                    className="object-cover w-full h-full cursor-pointer hover:opacity-90 transition-opacity"
                  />
                  {isEditing && (
                    <button
                      onClick={() => onDeleteImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div> */}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Informações do Denunciante
            </label>
            <div className="text-sm space-y-1">
              {isEditing ? (
                <>
                  <Input
                    value={report.denunciante}
                    onChange={(e) =>
                      onReportChange({
                        ...report,
                        denunciante: report.denunciante,
                      })
                    }
                    placeholder="Nome"
                  />
                </>
              ) : (
                <>
                  <p>Nome: {report.denunciante}</p>
                </>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Data de Criação</label>
            <p className="text-sm">
              {new Date(report.data).toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
