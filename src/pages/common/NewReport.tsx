import { Asterisk } from "@/components/ui/asterisk";
import AudioRecorder, {
  AudioRecorderHandles,
} from "@/components/ui/audioRecorder";
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
import { transcreverAudio, validarHistorico } from "@/services/report";
import { enviarDenunciaComum } from "@/services/reportCommon";
import { uploadAnexos } from "@/services/uploadFiles";
import { useEffect, useRef, useState } from "react";
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
  const [askFiles, setAskFiles] = useState(false);
  const [askInfrator, setAskInfrator] = useState(false);
  const gravadorRef = useRef<AudioRecorderHandles>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcrevendo, setTranscrevendo] = useState(false);
  const ultimoAudioUrl = useRef<string | null>(null);
  const [validandoHistorico, setValidandoHistorico] = useState(false);

  useEffect(() => {
    if (validaLocalizacao) {
      if (!audioUrl) return;
      if (audioUrl === ultimoAudioUrl.current) return;

      ultimoAudioUrl.current = audioUrl;
      transcrever();
    }
  }, [audioUrl]);

  useEffect(() => {
    if (historico.length >= 50) {
      setValidaHistorico(true);
    } else {
      setValidaHistorico(false);
    }
  }, [historico]);

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
    try {
      setValidandoHistorico(true);
      const resultado = await validarHistorico(historico);
      if (resultado === "irrelevante") {
        toast({
          title: "Conteúdo irrelevante",
          variant: "warning",
          description:
            "Seu histórico foi considerado irrelevante. Tente novamente.",
        });
        return;
      }
    } catch (error: any) {
      console.error("Erro ao validar histórico:", error);
    } finally {
      setValidandoHistorico(false);
    }
    const payload: any = {
      descricao: historico,
      municipio: municipioId,
      endereco: logradouroId,
      nr_endereco: semNumero || numero.trim() === "" ? null : numero,
      complemento:
        semComplemento || complemento.trim() === "" ? null : complemento,
      bairro: bairro.trim() !== "" ? bairro : null,
      ponto_referencia: referencia.trim() !== "" ? referencia : null,
      infrator: askInfrator && infrator.trim() !== "" ? infrator : null,
    };

    try {
      setModalAberto(true);
      const response = await enviarDenunciaComum(payload);
      if (response.numero && files.length > 0 && askFiles) {
        await uploadAnexos(response.numero, files);
      }
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
    setAskFiles(false);
    setAskInfrator(false);
    setLogradouros([]);
    setMostrarSugestoesLogradouros(false);
    setMunicipios([]);
    setAudioUrl(null);
    setAudioBlob(null);
    setTranscrevendo(false);
  };
  const transcrever = async () => {
    if (!audioBlob) return;
    try {
      setTranscrevendo(true);
      const resultado = await transcreverAudio(audioBlob);
      if (resultado.texto_final === "Irrelevante.") {
        toast({
          title: "Áudio irrelevante!",
          variant: "warning",
          duration: 3000,
          description: "O áudio não contém informações relevantes.",
        });
        setAudioBlob(null);
        setAudioUrl(null);
        resultado.texto_final = "";
        const temp = historico.trim();
        setHistorico(temp);
        return;
      } else {
        const historicoAtual = historico.trim();
        const novoHistorico = historicoAtual + " " + resultado.texto_final;
        setHistorico(novoHistorico);
      }
    } catch (error: any) {
      console.error("Erro ao transcrever áudio:", error);
    } finally {
      setAudioUrl(null);
      setAudioBlob(null);
      setTranscrevendo(false);
    }
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
        <DialogContent className="flex flex-col items-center justify-center text-center bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto z-50 [&>button.absolute]:hidden">
          <img
            src="/logo_gda.png"
            alt="Logo GDA"
            className="w-20 h-20 mb-4 object-contain"
          />

          <DialogHeader className="space-y-2">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Enviando denúncia
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Aguarde enquanto processamos sua solicitação.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6">
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
                      disabled={transcrevendo}
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
                    <div className="flex flex-wrap justify-between items-start gap-4 text-sm w-full p-2">
                      {transcrevendo ? (
                        <div className="flex flex-col items-center justify-center gap-2 text-center text-red-500 font-semibold min-w-[120px] basis-full justify-center">
                          <span className="animate-pulse">
                            Aguarde, transcrevendo...
                          </span>
                          <div className="w-6 h-6 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                        </div>
                      ) : (
                        <>
                          {" "}
                          <div
                            className={`flex-1 min-w-[120px] ${
                              historico.length < 50
                                ? "text-red-500 font-semibold"
                                : "invisible"
                            }`}
                          >
                            Mínimo de caracteres: {historico.length}/50
                          </div>
                          <div className="flex-1 min-w-[200px] flex flex-col items-center text-center">
                            <AudioRecorder
                              ref={gravadorRef}
                              onAudioFinalizado={(blob, url, tempo) => {
                                if (tempo < 5) {
                                  toast({
                                    title: "Áudio muito curto!",
                                    variant: "warning",
                                    description:
                                      "O áudio deve ter pelo menos 5 segundos.",
                                    duration: 2000,
                                  });
                                  return;
                                } else {
                                  setAudioUrl(url);
                                  setAudioBlob(blob);
                                }
                              }}
                            />
                          </div>
                          <div
                            className={`flex-1 min-w-[120px] text-right ${
                              historico.length > 1800
                                ? "text-red-500 font-semibold"
                                : "text-gray-500"
                            }`}
                          >
                            {historico.length} / 2000 caracteres
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  {validaHistorico && (
                    <>
                      {/* Inicio upload */}
                      <hr className="my-4" />
                      <div>
                        <p>
                          Deseja enviar fotos ou vídeos na sua denúncia? Sim{" "}
                          <Checkbox
                            checked={askFiles}
                            onCheckedChange={(v) => {
                              const checked = v === true;
                              setAskFiles(checked);
                            }}
                          />
                        </p>
                        {askFiles && (
                          <>
                            <br />
                            <p>
                              <label className="block font-medium mb-1">
                                Anexe fotos ou vídeo (máx. 4) (Opcional)
                              </label>
                            </p>
                            <input
                              type="file"
                              accept=".jpg,.jpeg,.png,.mp4"
                              multiple
                              onChange={(e) => {
                                const tipos = ["jpg", "jpeg", "png", "mp4"];
                                const arqList = Array.from(
                                  e.target.files || []
                                );
                                const arquivosValidos = arqList.filter(
                                  (file) => {
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
                                  }
                                );
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
                          </>
                        )}
                      </div>
                      {/* Fim upload */}
                      <hr className="my-4" />
                      {/* Inicio infrator */}
                      <div>
                        <p>
                          Deseja incluir nomes ou apelido de algum envolvido ou
                          responsável? Sim{" "}
                          <Checkbox
                            checked={askInfrator}
                            onCheckedChange={(v) => {
                              const checked = v === true;
                              setAskInfrator(checked);
                            }}
                          />
                        </p>
                        {askInfrator && (
                          <>
                            <br />
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
                          </>
                        )}
                      </div>
                      {/* Fim infrator */}
                    </>
                  )}
                  <hr className="my-4" />
                  <Button
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-600"
                    disabled={
                      !validaLocalizacao ||
                      !validaHistorico ||
                      transcrevendo ||
                      validandoHistorico
                    }
                  >
                    {validandoHistorico ? "Validando..." : "Enviar Denúncia"}
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
