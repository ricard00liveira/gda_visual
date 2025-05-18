import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Report } from "@/types/report";
import { Download, PenSquare, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { getStatus, getStatusColor } from "../ui/typeReportIcon";

interface ReportDetailsModalProps {
  report: Report | null;
  onClose: () => void;
  onSave?: (report: Report) => void;
}

export const ReportDetailsModal = ({
  report,
  onClose,
  onSave,
}: ReportDetailsModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedReport, setEditedReport] = useState<Report | null>(null);
  const [cidade, setCidade] = useState("");
  const [rua, setRua] = useState("");
  const [cpf, setCpf] = useState("");
  const [tipo, setTipo] = useState("");

  useEffect(() => {
    if (!report) return;
    console.log("Report:", report);
    const localCpf = localStorage.getItem("cpf");
    const localTipo = localStorage.getItem("tipo_usuario");

    if (localCpf) setCpf(localCpf);
    if (localTipo) setTipo(localTipo);

    // const buscarRua = async () => {
    //   if (!report.endereco) return;
    //   try {
    //     const l = await getLogradouroById(report.endereco);
    //     setRua(l.nome);
    //   } catch (error) {
    //     console.error("Erro ao buscar logradouro:", error);
    //   }
    // };

    //   const buscarMunicipio = async () => {
    //     if (!report.municipio) return;
    //     try {
    //       const m = await getMunicipioById(report.municipio);
    //       setCidade(m.nome.toUpperCase());
    //     } catch (error) {
    //       console.error("Erro ao buscar município:", error);
    //     }
    //   };

    //   buscarMunicipio();
    //   buscarRua();
    // }, [report]);
  });

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedReport(report);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedReport(null);
  };

  const handleSaveEdit = () => {
    if (editedReport && onSave) {
      onSave(editedReport);
    }
    setIsEditing(false);
  };

  const handleExport = () => {
    console.log("Exportando denúncia");
  };

  const handleAddToFieldAgent = () => {
    console.log("Adicionando ao agente de campo");
  };

  if (!report) return null;
  const currentReport = isEditing ? editedReport : report;
  if (!currentReport) return null;

  return (
    <Dialog open={!!report} onOpenChange={onClose}>
      <DialogHeader className="hidden">
        <DialogTitle className="hidden">Detalhes da denúncia</DialogTitle>
        <DialogDescription className="hidden">
          Denúncia {currentReport.numero}/{currentReport.data.slice(0, 4)}
        </DialogDescription>
      </DialogHeader>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Detalhes da Denúncia nº {currentReport.numero}/
            {currentReport.data.slice(0, 4)}
          </h2>
          {/* {!isEditing ? (
            <>
              <Button variant="ghost" size="icon" onClick={handleEditClick}>
                <PenSquare className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={handleCancelEdit}>
                <X className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleSaveEdit}>
                <Save className="h-4 w-4" />
              </Button>
            </div>
          )} */}
        </div>

        {/* Conteúdo */}
        <ScrollArea className="h-[calc(90vh-120px)] pr-4">
          <div className="space-y-6">
            <div>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      currentReport.status
                    )}`}
                  >
                    {getStatus(currentReport.status)}
                  </span>
                </p>
                <p>
                  <strong>Cidade:</strong> {cidade}
                </p>
                <p>
                  <strong>Endereço:</strong> {rua}
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Descrição</label>
                <Textarea
                  value={currentReport.descricao || ""}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setEditedReport({
                      ...currentReport,
                      descricao: e.target.value,
                    })
                  }
                />
              </div>

              {tipo !== "comum" && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Fato</label>
                    {/* <Input
                      value={currentReport.fato || ""}
                      disabled={!isEditing}
                      onChange={(e) =>
                        setEditedReport({
                          ...currentReport,
                          fato: Number(e.target.value),
                        })
                      }
                    /> */}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subfato</label>
                    {/* <Input
                      value={currentReport.subfato.id || ""}
                      disabled={!isEditing}
                      onChange={(e) =>
                        setEditedReport({
                          ...currentReport,
                          subfato: Number(e.target.value),
                        })
                      }
                    /> */}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Prioridade</label>
                    <Input
                      value={currentReport.prioridade || ""}
                      disabled={!isEditing}
                      onChange={(e) =>
                        setEditedReport({
                          ...currentReport,
                          prioridade: e.target.value,
                        })
                      }
                    />
                  </div>
                </>
              )}

              {currentReport.denunciante !== cpf && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Denunciante</label>
                  <Input
                    value={
                      currentReport.anonima
                        ? "Anônimo"
                        : currentReport.denunciante || ""
                    }
                    disabled
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Bairro</label>
                <Input
                  value={currentReport.bairro || ""}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setEditedReport({
                      ...currentReport,
                      bairro: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Número</label>
                <Input
                  value={currentReport.nr_endereco || ""}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setEditedReport({
                      ...currentReport,
                      nr_endereco: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Ponto de Referência
                </label>
                <Input
                  value={currentReport.ponto_referencia || ""}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setEditedReport({
                      ...currentReport,
                      ponto_referencia: e.target.value,
                    })
                  }
                />
              </div>

              {tipo !== "comum" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Responsável</label>
                  <Input
                    value={currentReport.responsavel || ""}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setEditedReport({
                        ...currentReport,
                        responsavel: e.target.value,
                      })
                    }
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Infrator</label>
                <Input
                  value={currentReport.infrator || ""}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setEditedReport({
                      ...currentReport,
                      infrator: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Data de Criação</label>
                <Input
                  value={
                    currentReport.data
                      ? new Date(currentReport.data).toLocaleDateString("pt-BR")
                      : "Não informada"
                  }
                  disabled
                />
              </div>
            </div>

            {!isEditing && tipo !== "comum" && (
              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <Button
                  onClick={handleExport}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
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
            )}
            <div className="flex flex-col sm:flex-row gap-2 justify-center pt-4">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleCancelEdit}
                    variant="destructive"
                    className="w-full sm:w-auto"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSaveEdit}
                    variant="default"
                    className="w-full sm:w-auto"
                  >
                    Salvar Alterações
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleEditClick}
                    variant="warning"
                    className="w-full sm:w-auto"
                  >
                    Editar <PenSquare className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
