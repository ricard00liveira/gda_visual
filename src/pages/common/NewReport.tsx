import { Asterisk } from "@/components/ui/asterisk";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Loading from "@/components/ui/loading";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  getLogradourosPorMunicipio,
  getMunicipios,
} from "@/services/locations";
import { enviarDenunciaComum } from "@/services/reportCommon";
import { uploadAnexos } from "@/services/uploadFiles";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NewReport() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [municipios, setMunicipios] = useState([]);
  const [municipioId, setMunicipioId] = useState<number | null>(null);
  const [logradouroBusca, setLogradouroBusca] = useState("");
  const [logradouros, setLogradouros] = useState<any[]>([]);
  const [logradouroId, setLogradouroId] = useState<number | null>(null);
  const [mostrarSugestoesLogradouros, setMostrarSugestoesLogradouros] =
    useState(false);

  const [numero, setNumero] = useState("");
  const [semNumero, setSemNumero] = useState(false);
  const [complemento, setComplemento] = useState("");
  const [semComplemento, setSemComplemento] = useState(false);
  const [bairro, setBairro] = useState("");
  const [referencia, setReferencia] = useState("");
  const [historico, setHistorico] = useState("");
  const [validaLocalizacao, setValidaLocalizacao] = useState(false);
  const [validaHistorico, setValidaHistorico] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [infrator, setInfrator] = useState("");
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    getMunicipios().then(setMunicipios);
  }, []);

  useEffect(() => {
    const fetchLogradouros = async () => {
      if (municipioId && logradouroBusca.length >= 3) {
        const result = await getLogradourosPorMunicipio(
          municipioId,
          logradouroBusca
        );
        setLogradouros(result.results || []);
      }
    };

    if (logradouroBusca.length < 3) {
      setLogradouros([]);
      setMostrarSugestoesLogradouros(false);
      setLogradouroId(null);
    } else {
      fetchLogradouros();
    }
  }, [logradouroBusca, municipioId]);

  useEffect(() => {
    setValidaLocalizacao(municipioId !== null && logradouroId !== null);
  }, [municipioId, logradouroId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (historico.trim().length < 50) {
      toast({
        title: "Erro!",
        variant: "warning",
        description: "Descreva o fato com no mínimo 50 caracteres.",
      });
      return;
    }

    const payload: any = {
      descricao: historico,
      municipio: municipioId,
      endereco: logradouroId,
      numero: semNumero || numero.trim() === "" ? null : numero,
      complemento:
        semComplemento || complemento.trim() === "" ? null : complemento,
      bairro: bairro.trim() !== "" ? bairro : null,
      ponto_referencia: referencia.trim() !== "" ? referencia : null,
    };

    try {
      setModalAberto(true);
      const response = await enviarDenunciaComum(payload);
      if (response.numero && files.length > 0) {
        await uploadAnexos(response.numero, files);
      }
      toast({
        title: "Sucesso!",
        variant: "success",
        description: "Denúncia enviada com sucesso.",
      });
      navigate("/comum/nova-denuncia/success");
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Erro!",
        variant: "warning",
        description:
          error?.response?.data?.error || "Erro ao enviar a denúncia.",
      });
    } finally {
      limparCampos();
      setModalAberto(false);
    }
  };
  const limparCampos = () => {
    setMunicipioId(null);
    setLogradouroId(null);
    setLogradouroBusca("");
    setNumero("");
    setSemNumero(false);
    setComplemento("");
    setSemComplemento(false);
    setBairro("");
    setReferencia("");
    setHistorico("");
    setValidaLocalizacao(false);
    setValidaHistorico(false);
    setFiles([]);
    setInfrator("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
          Nova Denúncia
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mt-1">
          Registre uma nova denúncia ambiental.
        </p>
      </div>
      <Dialog open={modalAberto}>
        <DialogOverlay className="fixed inset-0 bg-black/50 z-50" />
        <DialogContent className="bg-white p-6 rounded shadow-lg max-w-sm mx-auto z-50 [&>button.absolute]:hidden">
          <DialogHeader>
            <DialogTitle>Enviando denúncia</DialogTitle>
            <DialogDescription>
              Aguarde enquanto processamos sua solicitação.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-center items-center mt-4">
            <Loading />
          </div>
        </DialogContent>
      </Dialog>
      {!modalAberto && (
        <div className="bg-card rounded-xl shadow-sm border p-4 md:p-6">
          <div className="max-w-2xl mx-auto p-4 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <p className="text-center">
                  Os campos irão aparecer automaticamente conforme você
                  preencher os dados.
                </p>
                <hr className="my-4" />
                <label className="font-medium">
                  Município:
                  <Asterisk />
                </label>
                <select
                  className={`w-full border rounded px-2 py-1 bg-white transition-colors
                    ${
                      municipioId
                        ? "border-emerald-200 text-gray-700 hover:border-emerald-400 placeholder:text-gray-400"
                        : "border-black text-black placeholder:text-gray-600"
                    }
                  `}
                  value={municipioId ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setMunicipioId(val ? Number(val) : null);
                    setLogradouros([]);
                    setLogradouroId(null);
                    setLogradouroBusca("");
                  }}
                >
                  <option value="">Selecione uma cidade</option>
                  {municipios.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nome}
                    </option>
                  ))}
                </select>
              </div>

              {municipioId && (
                <div className="relative">
                  <label className="block font-medium mb-1">
                    Logradouro:
                    <Asterisk />
                  </label>
                  <input
                    type="text"
                    className={`w-full border rounded px-2 py-1 bg-white transition-colors
                    ${
                      logradouroId
                        ? "border-emerald-200 text-gray-700 hover:border-emerald-400 placeholder:text-gray-400"
                        : "border-black text-black placeholder:text-gray-600"
                    }
                  `}
                    placeholder="Digite parte do nome da rua/avenida/travessa"
                    value={logradouroBusca}
                    onChange={(e) => {
                      setLogradouroBusca(e.target.value);
                      setMostrarSugestoesLogradouros(true);
                    }}
                    onFocus={() => setMostrarSugestoesLogradouros(true)}
                    onBlur={() =>
                      setTimeout(
                        () => setMostrarSugestoesLogradouros(false),
                        200
                      )
                    }
                  />
                  {mostrarSugestoesLogradouros && logradouros.length > 0 && (
                    <ul className="absolute z-50 w-full bg-white border rounded mt-1 shadow max-h-60 overflow-y-auto">
                      {logradouros.map((l) => (
                        <li
                          key={l.id}
                          onMouseDown={() => {
                            setLogradouroId(l.id);
                            setLogradouroBusca(l.nome);
                            setMostrarSugestoesLogradouros(false);
                          }}
                          className="px-2 py-1 hover:bg-emerald-100 cursor-pointer"
                        >
                          {l.nome}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {validaLocalizacao && (
                <>
                  <div className="flex gap-2 items-center">
                    <label className="block font-medium mb-1">Número:</label>
                    <Input
                      placeholder="Número"
                      className={`w-full border rounded px-2 py-1 bg-white transition-colors
                      ${
                        numero || semNumero
                          ? "border-emerald-200 text-gray-700 hover:border-emerald-400 placeholder:text-gray-400"
                          : "border-black text-black placeholder:text-gray-600"
                      }
                    `}
                      value={numero}
                      onChange={(e) => setNumero(e.target.value)}
                      disabled={semNumero}
                    />
                    <Checkbox
                      checked={semNumero}
                      onCheckedChange={(v) => {
                        const checked = v === true;
                        setSemNumero(checked);
                        if (checked) setNumero("");
                      }}
                    />
                    <span className="text-sm">Sem Número</span>
                  </div>

                  <div className="flex gap-2 items-center">
                    <label className="block font-medium mb-1">
                      Complemento:
                    </label>
                    <Input
                      placeholder="Apto, Bloco, Casa, etc."
                      value={complemento}
                      className={`w-full border rounded px-2 py-1 bg-white transition-colors
                      ${
                        complemento || semComplemento
                          ? "border-emerald-200 text-gray-700 hover:border-emerald-400 placeholder:text-gray-400"
                          : "border-black text-black placeholder:text-gray-600"
                      }
                    `}
                      onChange={(e) => setComplemento(e.target.value)}
                      disabled={semComplemento}
                    />
                    <Checkbox
                      checked={semComplemento}
                      onCheckedChange={(v) => {
                        const checked = v === true;
                        setSemComplemento(checked);
                        if (checked) setComplemento("");
                      }}
                    />
                    <span className="text-sm">Sem Complemento</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <label className="block font-medium mb-1">Bairro:</label>
                    <Input
                      placeholder="Digite seu bairro ou localidade"
                      value={bairro}
                      className={`w-full border rounded px-2 py-1 bg-white transition-colors
                    ${
                      bairro
                        ? "border-emerald-200 text-gray-700 hover:border-emerald-400 placeholder:text-gray-400"
                        : "border-black text-black placeholder:text-gray-600"
                    }
                  `}
                      onChange={(e) => setBairro(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <label className="block font-medium mb-1">
                      Ponto de Referência:
                    </label>
                    <Input
                      placeholder="Observações sobre local"
                      value={referencia}
                      className={`w-full border rounded px-2 py-1 bg-white transition-colors
                    ${
                      referencia
                        ? "border-emerald-200 text-gray-700 hover:border-emerald-400 placeholder:text-gray-400"
                        : "border-black text-black placeholder:text-gray-600"
                    }
                  `}
                      onChange={(e) => setReferencia(e.target.value)}
                    />
                  </div>
                  <hr className="my-4" />
                  <div>
                    <label className="block font-medium mb-1">
                      Descreva o fato:
                      <Asterisk />
                    </label>
                    <Textarea
                      placeholder="Descreva o que aconteceu com máximo de detalhes e informações possíveis."
                      value={historico}
                      maxLength={2000}
                      className={`w-full border rounded px-2 py-1 bg-white transition-colors
                    ${
                      historico.length >= 50
                        ? "border-emerald-200 text-gray-700 hover:border-emerald-400 placeholder:text-gray-400"
                        : "border-black text-black placeholder:text-gray-600"
                    }
                  `}
                      onChange={(e) => {
                        setHistorico(e.target.value);
                        historico.length < 50
                          ? setValidaHistorico(false)
                          : setValidaHistorico(true);
                      }}
                      onClick={() => {
                        !numero ? setSemNumero(true) : setSemNumero(false);
                        !complemento
                          ? setSemComplemento(true)
                          : setSemComplemento(false);
                      }}
                    />
                    <div className="flex justify-between text-sm">
                      <div
                        className={`text-left ${
                          historico.length < 50
                            ? "text-red-500 font-semibold"
                            : "invisible"
                        }`}
                      >
                        Mínimo de caracteres: {historico.length}/50
                      </div>
                      <div
                        className={`${
                          historico.length > 1800
                            ? "text-red-500 font-semibold"
                            : "text-gray-500"
                        }`}
                      >
                        {historico.length} / 2000 caracteres
                      </div>
                    </div>
                  </div>
                  {validaHistorico && (
                    <>
                      <hr className="my-4" />
                      <div>
                        <label className="block font-medium mb-1">
                          Anexe fotos ou vídeo (máx. 4) (Opcional)
                        </label>
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.mp4"
                          multiple
                          onChange={(e) => {
                            const tipos = ["jpg", "jpeg", "png", "mp4"];
                            const arqList = Array.from(e.target.files || []);
                            const arquivosValidos = arqList.filter((file) => {
                              const ext = file.name
                                .split(".")
                                .pop()
                                ?.toLowerCase();
                              const valido = tipos.includes(ext || "");
                              if (!valido) {
                                toast({
                                  title: "Arquivo inválido",
                                  description: `O arquivo ${file.name} não é permitido.`,
                                  variant: "destructive",
                                });
                              }
                              e.target.value = "";
                              return valido;
                            });
                            if (arquivosValidos.length + files.length > 4) {
                              e.target.files = null;
                              toast({
                                title: "Limite de arquivos excedido",
                                variant: "warning",
                              });
                              e.target.value = "";
                              return;
                            }
                            setFiles([...files, ...arquivosValidos]);
                          }}
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                          {files.map((file, index) => (
                            <div key={index} className="relative">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`preview-${index}`}
                                className="h-16 w-16 object-cover rounded border"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setFiles((prev) =>
                                    prev.filter((_, i) => i !== index)
                                  )
                                }
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p>
                          <label className="block font-medium mb-1">
                            Infrator (Opcional)
                          </label>
                        </p>
                        <Input
                          placeholder="Nome ou apelido dos envolvidos"
                          value={infrator}
                          className={`w-full border rounded px-2 py-1 bg-white transition-colors
                    ${
                      infrator
                        ? "border-emerald-200 text-gray-700 hover:border-emerald-400 placeholder:text-gray-400"
                        : "border-black text-black placeholder:text-gray-600"
                    }
                  `}
                          onChange={(e) => setInfrator(e.target.value)}
                        />
                      </div>
                    </>
                  )}
                  <hr className="my-4" />
                  <Button
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-600"
                    disabled={!validaLocalizacao || !validaHistorico}
                  >
                    Enviar Denúncia
                  </Button>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
