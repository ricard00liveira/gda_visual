// src/components/reports/ReportDetailsModal.tsx

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { getLogradouroById, getMunicipioById } from "@/services/locations";
import {
  deletarAnexo,
  editarDenuncia,
  getAnexosPorDenuncia,
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
import { Label } from "../ui/label";
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
    const localCpf = localStorage.getItem("cpf");
    const localTipo = localStorage.getItem("tipo_usuario");
    if (localCpf && !cpf) setCpf(localCpf);
    if (localTipo && !tipo) setTipo(localTipo);
    if (report?.numero) {
      carregarAnexos();
      buscarRua();
      buscarMunicipio();
    }
  }, [report]);

  const carregarAnexos = async () => {
    if (!report?.numero) return;
    setLoading(true);
    try {
      const data = await getAnexosPorDenuncia(report.numero);
      setAnexos(data);
    } catch (error) {
      toast({ title: "Erro ao buscar anexos", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const buscarRua = async () => {
    if (!report?.endereco) return;
    try {
      const l = await getLogradouroById(report.endereco);
      setRua(l.nome);
    } catch (error) {
      console.error("Erro ao buscar logradouro:", error);
    }
  };

  const buscarMunicipio = async () => {
    if (!report?.municipio) return;
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
      return toast({
        title: "Arquivo inválido",
        description: "Apenas arquivos JPG, PNG e MP4 são permitidos.",
        variant: "destructive",
      });
    }

    if (file.size > 5 * 1024 * 1024) {
      return toast({
        title: "Tamanho excedido",
        description: "Arquivos de até 5MB são permitidos.",
        variant: "destructive",
      });
    }

    setLoading(true);
    try {
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
    if (tipo === "comum" && report.status !== "analise") {
      toast({
        title: "Edição não permitida",
        description: "A denúncia já foi aprovada e não pode mais ser editada.",
        variant: "warning",
      });
      return;
    }
    setIsEditing(true);
    setEditedReport({ ...report });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedReport(null);
  };

  const handleSaveEdit = async () => {
    if (!editedReport) return;
    setLoading(true);
    try {
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

  if (!report) return null;
  const currentReport = isEditing ? editedReport : report;
  if (!currentReport) return null;

  const handleExport = () => {};
  const handleAddToFieldAgent = () => {};

  return (
    <ResponsiveDialog open={!!report} onOpenChange={onClose}>
      <ResponsiveDialogContent className="sm:max-w-[600px]">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            Detalhes da Denúncia nº {currentReport.numero}/
            {currentReport.data.slice(0, 4)}
          </ResponsiveDialogTitle>
        </ResponsiveDialogHeader>

        <Tabs defaultValue="infos" className="flex flex-col flex-1 min-h-0">
          <TabsList className="flex justify-center gap-2 w-full">
            <TabsTrigger value="infos">Informações</TabsTrigger>
            <TabsTrigger value="anexos">Anexos</TabsTrigger>
          </TabsList>

          <TabsContent value="infos" className="flex-1 min-h-0">
            <ResponsiveDialogBody>
              <div className="space-y-4">
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

                  <div className="space-y-2 pt-2">
                    <Label className="text-sm font-medium">Número:</Label>
                    <Input
                      value={currentReport.nr_endereco || ""}
                      placeholder={
                        currentReport.nr_endereco
                          ? String(currentReport.nr_endereco)
                          : "Não informado"
                      }
                      disabled={!isEditing}
                      onChange={(e) =>
                        setEditedReport((prev) =>
                          prev ? { ...prev, nr_endereco: e.target.value } : null
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2 pt-2">
                    <Label className="text-sm font-medium">Bairro:</Label>
                    <Input
                      value={currentReport.bairro || ""}
                      placeholder={
                        currentReport.bairro
                          ? currentReport.bairro
                          : "Não informado"
                      }
                      disabled={!isEditing}
                      onChange={(e) =>
                        setEditedReport((prev) =>
                          prev ? { ...prev, bairro: e.target.value } : null
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2 pt-2">
                    <Label className="text-sm font-medium">
                      Ponto de Referência:
                    </Label>
                    <Input
                      value={currentReport.ponto_referencia || ""}
                      placeholder={
                        !currentReport.ponto_referencia
                          ? "Não informado"
                          : undefined
                      }
                      disabled={!isEditing}
                      onChange={(e) =>
                        setEditedReport((prev) =>
                          prev
                            ? { ...prev, ponto_referencia: e.target.value }
                            : null
                        )
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Descrição</Label>
                    <Textarea
                      value={currentReport.descricao || ""}
                      disabled={!isEditing}
                      onChange={(e) =>
                        setEditedReport((prev) =>
                          prev ? { ...prev, descricao: e.target.value } : null
                        )
                      }
                      className="min-h-[120px]"
                    />
                  </div>

                  {tipo !== "comum" && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Fato</Label>
                        <Input
                          value={currentReport.fato || ""}
                          disabled={!isEditing}
                          onChange={(e) =>
                            setEditedReport((prev) =>
                              prev
                                ? { ...prev, fato: Number(e.target.value) }
                                : null
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Subfato</Label>
                        <Input
                          value={currentReport.subfato || ""}
                          disabled={!isEditing}
                          onChange={(e) =>
                            setEditedReport((prev) =>
                              prev
                                ? { ...prev, subfato: Number(e.target.value) }
                                : null
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Prioridade
                        </Label>
                        <Input
                          value={currentReport.prioridade || ""}
                          disabled={!isEditing}
                          onChange={(e) =>
                            setEditedReport((prev) =>
                              prev
                                ? { ...prev, prioridade: e.target.value }
                                : null
                            )
                          }
                        />
                      </div>
                    </>
                  )}

                  {currentReport.denunciante !== cpf && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Denunciante</Label>
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
                      <Label className="text-sm font-medium">Responsável</Label>
                      <Input
                        value={currentReport.responsavel || ""}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setEditedReport((prev) =>
                            prev
                              ? { ...prev, responsavel: e.target.value }
                              : null
                          )
                        }
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Infrator</Label>
                    <Input
                      value={currentReport.infrator || ""}
                      placeholder={
                        currentReport.infrator
                          ? currentReport.infrator
                          : "Não informado"
                      }
                      disabled={!isEditing}
                      onChange={(e) =>
                        setEditedReport((prev) =>
                          prev ? { ...prev, infrator: e.target.value } : null
                        )
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Data de Criação:
                    </Label>
                    <p className="text-sm">
                      {currentReport.data
                        ? new Date(currentReport.data).toLocaleDateString(
                            "pt-BR"
                          )
                        : "Não informada"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 justify-center pt-4">
                  {/* Botões de Ação */}
                </div>
              </div>
            </ResponsiveDialogBody>
          </TabsContent>

          <TabsContent value="anexos" className="flex-1 min-h-0">
            <ResponsiveDialogBody>
              <div className="space-y-6">
                <div className="flex flex-col justify-center items-center">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {anexos.map((anexo) => {
                        const isImage = /\.(jpg|jpeg|png)$/i.test(
                          anexo.arquivo_url || anexo.arquivo
                        );
                        return (
                          <div
                            key={anexo.id}
                            className="flex flex-col items-center text-center relative group"
                          >
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 z-10 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
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
                                className="rounded-lg shadow max-w-full max-h-[280px] object-contain"
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
            </ResponsiveDialogBody>
          </TabsContent>
        </Tabs>

        <ResponsiveDialogFooter className="border-t pt-4">
          <div className="flex flex-col sm:flex-row gap-2 justify-end w-full">
            {!isEditing && tipo !== "comum" && (
              <>
                <Button onClick={handleExport} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
                <Button onClick={handleAddToFieldAgent} variant="outline">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Adicionar ao Agente de Campo
                </Button>
              </>
            )}
            {isEditing ? (
              <>
                <Button onClick={handleCancelEdit} variant="destructive">
                  Cancelar
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  variant="default"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="animate-spin mr-2" /> : null}{" "}
                  Salvar Alterações
                </Button>
              </>
            ) : (
              <Button onClick={handleEditClick} variant="secondary">
                <PenSquare className="h-5 w-5 mr-2" />
                Editar informações
              </Button>
            )}
          </div>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
