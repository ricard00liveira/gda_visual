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
import { toast } from "@/components/ui/use-toast";
import { getLogradouroById, getMunicipioById } from "@/services/locations";
import {
  deletarAnexo,
  editarDenuncia,
  getAnexosPorDenuncia,
  getDenunciaById,
  uploadAnexos,
} from "@/services/report";
import { Anexo, Report } from "@/types/report";
import {
  Download,
  Loader2,
  PenSquare,
  Trash2,
  Upload,
  UserPlus,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
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
  const [anexos, setAnexos] = useState<Anexo[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!report) return;
    console.log("ReportDetailsModal:", report);
    const localCpf = localStorage.getItem("cpf");
    const localTipo = localStorage.getItem("tipo_usuario");
    if (localCpf && !cpf) setCpf(localCpf);
    if (localTipo && !tipo) setTipo(localTipo);
    if (report?.numero) carregarAnexos();
    buscarRua();
    buscarMunicipio();
  }, [report]);

  const carregarAnexos = async () => {
    if (!report?.numero) return;
    setLoading(true);
    try {
      const data = await getAnexosPorDenuncia(report.numero);
      setAnexos(data);
      console.log("Anexos carregados:", data);
    } catch (error) {
      toast({ title: "Erro ao buscar anexos" });
    } finally {
      setLoading(false);
    }
  };
  const buscarRua = async () => {
    if (!report.endereco) return;
    try {
      const l = await getLogradouroById(report.endereco);
      setRua(l.nome);
    } catch (error) {
      console.error("Erro ao buscar logradouro:", error);
    }
  };

  const buscarMunicipio = async () => {
    if (!report.municipio) return;
    try {
      const m = await getMunicipioById(report.municipio);
      setCidade(m.nome.toUpperCase());
    } catch (error) {
      console.error("Erro ao buscar município:", error);
    }
  };
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files.length || !report) return;

    const file = files[0];
    const ext = file.name.split(".").pop()?.toLowerCase();
    const tiposValidos = ["jpg", "jpeg", "png", "mp4"];

    if (!tiposValidos.includes(ext || "")) {
      toast({
        title: "Arquivo inválido",
        description: "Apenas arquivos JPG, PNG e MP4 são permitidos.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Tamanho excedido",
        description: "Arquivos de até 5MB são permitidos.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("files", file);

    try {
      setLoading(true);
      await uploadAnexos(report.numero, [file]);
      toast({ title: "Anexo enviado com sucesso." });
      await carregarAnexos();
    } catch (error) {
      toast({
        title: "Erro ao enviar anexo",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteAnexo = async (anexoId: number) => {
    if (!confirm("Tem certeza que deseja excluir este anexo?")) return;
    try {
      console.log("Excluindo anexo:", anexoId);
      await deletarAnexo(anexoId);
      toast({
        title: "Anexo removido com sucesso.",
        duration: 2000,
        variant: "success",
      });
      carregarAnexos();
    } catch (error) {
      toast({
        title: "Erro ao excluir anexo",
        description: "Não foi possível remover o anexo.",
        variant: "destructive",
      });
    }
  };

  const handleEditClick = () => {
    if (!report) return;
    if (tipo === "comum" && report.status !== "analise") return;
    setIsEditing(true);
    setEditedReport(report);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedReport(null);
  };

  const handleSaveEdit = async () => {
    if (!editedReport) return;

    try {
      setLoading(true);

      const payload = {
        descricao: editedReport.descricao,
        nr_endereco: editedReport.nr_endereco,
        bairro: editedReport.bairro,
        ponto_referencia: editedReport.ponto_referencia,
        infrator: editedReport.infrator,
      };

      const updatedReport = await editarDenuncia(editedReport.numero, payload);

      toast({
        title: "Denúncia atualizada com sucesso.",
        variant: "success",
        duration: 2000,
      });
      setIsEditing(false);
      if (onSave) {
        onSave(updatedReport);
      }
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível atualizar a denúncia.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const atualizarDenuncia = async (denunciaId) => {
    try {
      const updatedReport = await getDenunciaById(denunciaId);
      report = updatedReport;
    } catch (error) {
      console.error("Erro ao atualizar denúncia:", error);
    }
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
        </div>
        <Tabs defaultValue="infos" className="space-y-4">
          <TabsList className="flex justify-center gap-2 w-full">
            <TabsTrigger value="infos">Informações</TabsTrigger>
            <TabsTrigger value="anexos">Anexos</TabsTrigger>
          </TabsList>

          {/* Conteúdo */}

          <TabsContent value="infos" className="space-y-4">
            <ScrollArea className="h-[calc(80vh-120px)] pr-4">
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
                    <p>
                      <label className="text-sm font-medium">Número:</label>{" "}
                      <Input
                        value={currentReport.nr_endereco || ""}
                        placeholder={
                          currentReport.nr_endereco
                            ? String(currentReport.nr_endereco)
                            : "Não informado"
                        }
                        disabled={!isEditing}
                        onChange={(e) =>
                          setEditedReport({
                            ...currentReport,
                            nr_endereco: e.target.value,
                          })
                        }
                      />
                    </p>
                    <p>
                      <label className="text-sm font-medium">Bairro:</label>{" "}
                      <Input
                        value={currentReport.bairro || ""}
                        placeholder={
                          currentReport.bairro
                            ? currentReport.bairro
                            : "Não informado"
                        }
                        disabled={!isEditing}
                        onChange={(e) =>
                          setEditedReport({
                            ...currentReport,
                            bairro: e.target.value,
                          })
                        }
                      />
                    </p>
                    <p>
                      <label className="text-sm font-medium">
                        Ponto de Referência:{" "}
                      </label>
                      <Input
                        value={currentReport.ponto_referencia || ""}
                        placeholder={
                          !currentReport.ponto_referencia && "Não informado"
                        }
                        disabled={!isEditing}
                        onChange={(e) =>
                          setEditedReport({
                            ...currentReport,
                            ponto_referencia: e.target.value,
                          })
                        }
                      />
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
                        <Input
                          value={currentReport.fato || ""}
                          disabled={!isEditing}
                          onChange={(e) =>
                            setEditedReport({
                              ...currentReport,
                              fato: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Subfato</label>
                        <Input
                          value={currentReport.subfato || ""}
                          disabled={!isEditing}
                          onChange={(e) =>
                            setEditedReport({
                              ...currentReport,
                              subfato: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Prioridade
                        </label>
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
                      placeholder={
                        currentReport.infrator
                          ? currentReport.infrator
                          : "Não informado"
                      }
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
                    <label className="text-sm font-medium">
                      Data de Criação:
                    </label>{" "}
                    {currentReport.data
                      ? new Date(currentReport.data).toLocaleDateString("pt-BR")
                      : "Não informada"}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 justify-center pt-4">
                  {!isEditing && tipo !== "comum" && (
                    <>
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
                    </>
                  )}
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
                        Editar informações
                        <PenSquare className="h-5 w-5" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="anexos" className="space-y-4">
            <ScrollArea className="h-[calc(80vh-120px)] pr-4">
              <div className="space-y-6">
                <div className="flex flex-col justify-center items-center">
                  <div>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.mp4"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileUpload}
                    />

                    {loading ? (
                      <div className="flex justify-center items-center h-40">
                        <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
                      </div>
                    ) : anexos.length === 0 ? (
                      <p className="text-center text-sm text-muted-foreground">
                        Nenhum anexo encontrado.
                      </p>
                    ) : (
                      <div className="flex flex-col items-center gap-6 p-4">
                        {anexos.map((anexo) => {
                          const isImage = /\.(jpg|jpeg|png)$/i.test(
                            anexo.arquivo_url || anexo.arquivo
                          );
                          return (
                            <div
                              key={anexo.id}
                              className="flex flex-col items-center text-center relative"
                            >
                              <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 z-10"
                                onClick={() => handleDeleteAnexo(anexo.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              {isImage ? (
                                <a
                                  href={anexo.arquivo_url || anexo.arquivo}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:opacity-75 transition"
                                >
                                  <img
                                    src={anexo.arquivo_url || anexo.arquivo}
                                    alt="Anexo"
                                    className="w-full h-24 object-cover rounded"
                                  />
                                </a>
                              ) : (
                                <video
                                  controls
                                  src={anexo.arquivo_url || anexo.arquivo}
                                  className="rounded-lg shadow max-w-[280px] max-h-[280px] object-contain"
                                />
                              )}
                              <p className="text-xs mt-1 text-muted-foreground">
                                Enviado em{" "}
                                {new Date(anexo.data_upload).toLocaleString()}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <p className="py-4">
                    <Button
                      variant="default"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={loading || anexos.length >= 4}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Adicionar Anexo
                    </Button>
                  </p>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
