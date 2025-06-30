import { Asterisk } from "@/components/ui/asterisk";
import AudioRecorder, {
  AudioRecorderHandles,
} from "@/components/ui/audioRecorder";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Loading from "@/components/ui/loading";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  getLogradourosPorMunicipio,
  getMunicipios,
} from "@/services/locations";
import { transcreverAudio, validarHistorico } from "@/services/report";
import { enviarDenunciaAnonima } from "@/services/reportAnonymous";
import { uploadAnexos } from "@/services/uploadFiles";
import { AnonymousReportForm } from "@/types/reportAnonymous";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { ArrowLeft, HelpCircle, Shield, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface Municipio {
  id: number;
  nome: string;
}

interface Logradouro {
  id: number;
  nome: string;
}

const Anonymous = ({
  onValidChange,
}: {
  onValidChange?: (valid: boolean) => void;
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [municipioId, setMunicipioId] = useState<number | null>(null);
  const [logradouroId, setLogradouroId] = useState<number | null>(null);
  const [logradouros, setLogradouros] = useState<Logradouro[]>([]);
  const [logradouroBusca, setLogradouroBusca] = useState("");
  const [numero, setNumero] = useState<string>("");
  const [semNumero, setSemNumero] = useState(false);
  const [semComplemento, setSemComplemento] = useState(false);
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [referencia, setReferencia] = useState("");
  const [historico, setHistorico] = useState("");
  const [mostrarSugestoesLogradouros, setMostrarSugestoesLogradouros] =
    useState(false);
  const [validaLocalizacao, setValidaLocalizacao] = useState(false);
  const [validaHistorico, setValidaHistorico] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [infrator, setInfrator] = useState("");
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
    const fetchMunicipios = async () => {
      const data = await getMunicipios();
      setMunicipios(data);
    };
    fetchMunicipios();
  }, []);

  useEffect(() => {
    if (municipioId && logradouroId) {
      setValidaLocalizacao(true);
    } else {
      setValidaLocalizacao(false);
    }
  }, [municipioId, logradouroId]);

  useEffect(() => {
    if (historico.length >= 50 && historico.length <= 2000) {
      setValidaHistorico(true);
    } else {
      setValidaHistorico(false);
    }
  }, [historico]);

  useEffect(() => {
    const fetchLogradouros = async () => {
      if (municipioId && logradouroBusca.length >= 3) {
        const result = await getLogradourosPorMunicipio(
          municipioId,
          logradouroBusca
        );
        const lista = result.results || [];
        setLogradouros(lista);

        const correspondente = lista.find(
          (l: any) =>
            l.nome.toLowerCase().trim() === logradouroBusca.toLowerCase().trim()
        );

        if (!correspondente) {
          setLogradouroId(null);
        } else {
          setLogradouroId(correspondente.id);
        }
      } else {
        setLogradouros([]);
        setMostrarSugestoesLogradouros(false);
        setLogradouroId(null);
      }
    };

    fetchLogradouros();
  }, [logradouroBusca, municipioId]);

  useEffect(() => {
    if (onValidChange) {
      const isValid = municipioId !== null && logradouroId !== null;
      onValidChange(isValid);
    }
  }, [municipioId, logradouroId, onValidChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (selectedFiles.length + files.length > 4) {
      toast({
        variant: "warning",
        title: "Limite excedido",
        description: "Você pode enviar no máximo 4 arquivos.",
      });
      return;
    }

    const invalidFiles = selectedFiles.filter((file) => {
      const isValidType = ["image/jpeg", "image/png", "video/mp4"].includes(
        file.type
      );
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return !isValidType || !isValidSize;
    });

    if (invalidFiles.length > 0) {
      toast({
        variant: "warning",
        title: "Arquivo(s) inválido(s)",
        description: "Apenas arquivos JPG, PNG ou MP4 até 5MB são permitidos.",
      });
      return;
    }

    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const resetDenuncia = () => {
    setMunicipioId(null);
    setLogradouroId(null);
    setLogradouroBusca("");
    setNumero("");
    setSemNumero(false);
    setSemComplemento(false);
    setComplemento("");
    setBairro("");
    setReferencia("");
    setHistorico("");
    setFiles([]);
    setValidaLocalizacao(false);
    setValidaHistorico(false);
    setLogradouros([]);
    setMostrarSugestoesLogradouros(false);
    setLatitude(null);
    setLongitude(null);
    setInfrator("");
    setAudioUrl(null);
    setAudioBlob(null);
    setTranscrevendo(false);
    if (gravadorRef.current) {
      gravadorRef.current.pararGravacao();
    }
    setModalAberto(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (historico.trim().length < 50) {
      toast({
        title: "Descrição muito curta",
        variant: "warning",
        description: "A descrição deve ter pelo menos 50 caracteres.",
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

    const payload: AnonymousReportForm = {
      descricao: historico,
      municipio: municipioId,
      endereco: logradouroId,
    };

    if (!semNumero && numero.trim() !== "") {
      payload.nr_endereco = numero;
    }

    if (!semComplemento && complemento.trim() !== "") {
      payload.ponto_referencia = complemento;
    }

    if (bairro.trim() !== "") {
      payload.bairro = bairro;
    }

    if (referencia.trim() !== "") {
      payload.ponto_referencia = referencia;
    }

    if (latitude && longitude) {
      payload.latitude = latitude;
      payload.longitude = longitude;
    }
    if (infrator.trim() !== "") {
      payload.infrator = infrator;
    }

    try {
      setModalAberto(true);
      const response = await enviarDenunciaAnonima(payload);
      const numeroDenuncia = response.denuncia.numero;
      if (response.denuncia && numeroDenuncia && files.length > 0) {
        try {
          await uploadAnexos(numeroDenuncia, files);
        } catch (error: any) {
          toast({
            title: "Erro ao enviar anexos",
            variant: "warning",
            description:
              error?.error ||
              "Não foi possível enviar os anexos. Tente novamente.",
          });
        }
      }
      navigate("/anonymous/success");
    } catch (error: any) {
      console.error("Erro ao enviar denúncia:", error);
      toast({
        title: "Erro ao enviar denúncia",
        variant: "destructive",
        description:
          error?.response?.data?.error || "Não foi possível enviar a denúncia.",
      });
    } finally {
      resetDenuncia();
      setModalAberto(false);
    }
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
    <div className="public-page min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-emerald-200">
          <div className="flex items-center gap-2 mb-4 sm:mb-0">
            <img src="/logo_gda.png" alt="Logo GDA" className="w-10 h-10" />
            <h1 className="text-3xl font-bold text-emerald-700">GDA</h1>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Link to="/faq" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="gap-2 text-emerald-700 w-full hover:bg-emerald-50 border-emerald-200"
              >
                <HelpCircle className="w-4 h-4" />
                Ajuda
              </Button>
            </Link>
            <Link to="/" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="gap-2 text-emerald-700 w-full hover:bg-emerald-50 border-emerald-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-emerald-600" />
          <h1 className="text-3xl font-bold text-emerald-700">
            Denúncia Anônima
          </h1>
        </div>
        <Dialog open={modalAberto}>
          <DialogOverlay className="fixed inset-0 bg-black/50 z-50" />
          <DialogContent className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto z-50 text-center [&>button.absolute]:hidden">
            <img
              src="/logo_gda.png"
              alt="Logo GDA"
              className="w-10 h-10 mb-4 object-contain"
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
          <>
            {/* Localização */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative z-50 bg-white/80 backdrop-blur-sm rounded-lg p-4 md:p-6 space-y-4 shadow-lg border border-emerald-100 hover:shadow-xl hover:border-emerald-200 transition-all duration-500">
                <h2 className="text-xl font-semibold text-emerald-700 mb-4">
                  Localização
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block font-medium">
                      Município:
                      <Asterisk />
                    </label>
                    <select
                      className="w-full border rounded px-2 py-1 bg-white border-emerald-200 text-gray-700 placeholder:text-gray-400 hover:border-emerald-400 transition-colors"
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
                    <div className="relative z-60">
                      <label className="block font-medium mb-1">
                        Logradouro:
                        <Asterisk />
                      </label>
                      <input
                        type="text"
                        className="w-full border rounded px-2 py-1 bg-white border-emerald-200 text-gray-700 placeholder:text-gray-400 hover:border-emerald-400 transition-colors"
                        placeholder="Digite parte do nome da Rua/Avenida/Travessa (mín. 3 letras)"
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
                      {mostrarSugestoesLogradouros &&
                        logradouros.length > 0 && (
                          <ul className="absolute z-70 w-full bg-white border border-emerald-200 rounded shadow mt-1 max-h-60 overflow-y-auto">
                            {logradouros.map((l) => (
                              <li
                                key={l.id}
                                onMouseDown={() => {
                                  setLogradouroId(l.id);
                                  setLogradouroBusca(l.nome);
                                  setMostrarSugestoesLogradouros(false);
                                }}
                                className="z-50 px-2 py-1 hover:bg-emerald-100 cursor-pointer text-sm"
                              >
                                {l.nome}
                              </li>
                            ))}
                          </ul>
                        )}
                    </div>
                  )}

                  {logradouroId && (
                    <div className="relative z-0 space-y-2">
                      <div className="z-0 grid grid-cols-[auto_1fr_auto_auto] items-center gap-2">
                        <label className="block font-medium">Número:</label>
                        <Input
                          placeholder="Número da residência, prédio, ou numeral mais próximo do local"
                          className="bg-white border-emerald-200 text-gray-700 placeholder:text-gray-400 hover:border-emerald-400 transition-colors"
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
                      <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-2">
                        <label className="block font-medium">
                          Complemento:
                        </label>
                        <Input
                          placeholder="APT, Bloco, Andar, Casa 01 A, etc."
                          className="bg-white border-emerald-200 text-gray-700 placeholder:text-gray-400 hover:border-emerald-400 transition-colors"
                          value={complemento}
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
                      <div className="flex items-center gap-2">
                        <label className="block font-medium">Bairro:</label>
                        <Input
                          placeholder="Digite o bairro ou localidade"
                          value={bairro}
                          className="bg-white border-emerald-200 text-gray-700 placeholder:text-gray-400 hover:border-emerald-400 transition-colors"
                          onChange={(e) => setBairro(e.target.value)}
                          onClick={() => {
                            numero ? setSemNumero(false) : setSemNumero(true);
                            complemento
                              ? setSemComplemento(false)
                              : setSemComplemento(true);
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="block font-medium">Observações</label>
                        <Input
                          placeholder="Mais informações sobre o local ou ponto de referência."
                          value={referencia}
                          className="bg-white border-emerald-200 text-gray-700 placeholder:text-gray-400 hover:border-emerald-400 transition-colors"
                          onChange={(e) => setReferencia(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Informações do Fato */}
              <div className="relative z-0 bg-white/80 backdrop-blur-sm rounded-lg p-4 md:p-6 space-y-4 shadow-lg border border-emerald-100 hover:shadow-xl hover:border-emerald-200 transition-all duration-500">
                <h2 className="text-xl font-semibold text-emerald-700 mb-4">
                  Informações do Fato
                  <Asterisk />
                </h2>
                {validaLocalizacao ? (
                  <>
                    <Textarea
                      maxLength={2000}
                      placeholder={`Digite ou fale!\nNos conte o que aconteceu da forma mais completa que puder. Toda informação pode ajudar!\nO áudio transcrito por IA é apenas uma sugestão, você pode editar o texto.`}
                      className="bg-white border-emerald-200 text-gray-700 placeholder:text-gray-400 min-h-[150px] hover:border-emerald-400 transition-colors whitespace-pre-line"
                      onClick={() => {
                        numero ? setSemNumero(false) : setSemNumero(true);
                        complemento
                          ? setSemComplemento(false)
                          : setSemComplemento(true);
                      }}
                      onChange={(e) => {
                        setHistorico(e.target.value);
                      }}
                      value={historico}
                      disabled={!validaLocalizacao || transcrevendo}
                    />
                    <div className="flex flex-wrap justify-between items-start gap-4 text-sm w-full">
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
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center w-full">
                      <p className="text-sm text-gray-400">
                        Preencha o campo anterior.
                      </p>
                    </div>
                  </>
                )}
              </div>
              {/* Upload de Arquivos */}
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 md:p-6 space-y-4 shadow-lg border border-emerald-100 hover:shadow-xl hover:border-emerald-200 transition-all duration-500">
                <h2 className="text-xl font-semibold text-emerald-700 mb-4">
                  Evidências (Opcional)
                </h2>
                {validaHistorico && validaLocalizacao ? (
                  <>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-emerald-200 border-dashed rounded-lg cursor-pointer bg-emerald-50/50 hover:bg-emerald-50 hover:border-emerald-400 transition-all duration-300">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-emerald-600" />
                          <p className="text-sm text-gray-600">
                            Clique para upload ou arraste arquivos aqui
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            JPG, PNG ou MP4 (máx. 5MB cada)
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept=".jpg,.jpeg,.png,.mp4"
                          onChange={handleFileChange}
                          multiple
                        />
                      </label>
                    </div>

                    {files.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {files.map((file, index) => {
                          const isImage = file.type.startsWith("image/");
                          const previewURL = isImage
                            ? URL.createObjectURL(file)
                            : null;

                          return (
                            <div
                              key={index}
                              className="relative bg-white p-2 rounded-lg border border-emerald-200 shadow-sm group"
                            >
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Remover"
                              >
                                ×
                              </button>

                              {isImage ? (
                                <img
                                  src={previewURL!}
                                  alt={`Preview ${file.name}`}
                                  className="w-full h-24 object-cover rounded"
                                  onLoad={() =>
                                    URL.revokeObjectURL(previewURL!)
                                  }
                                />
                              ) : (
                                <div className="h-24 flex items-center justify-center text-sm text-gray-500">
                                  {file.name}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center w-full">
                    <p className="text-sm text-gray-400">
                      Preencha o campo anterior.
                    </p>
                  </div>
                )}
              </div>
              {/* Dados do Infrator */}
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 md:p-6 space-y-4 shadow-lg border border-emerald-100 hover:shadow-xl hover:border-emerald-200 transition-all duration-500">
                <h2 className="text-xl font-semibold text-emerald-700 mb-4">
                  Dados do Infrator (Opcional)
                </h2>
                {validaHistorico && validaLocalizacao ? (
                  <Input
                    value={infrator}
                    onChange={(e) => setInfrator(e.target.value)}
                    placeholder="Nome ou apelido dos responsáveis pela infração"
                    className="bg-white border-emerald-200 text-gray-700 placeholder:text-gray-400 hover:border-emerald-400 transition-colors"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full">
                    <p className="text-sm text-gray-400">
                      Preencha o campo anterior.
                    </p>
                  </div>
                )}
              </div>

              {/* Botão de Enviar Denúncia */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white py-6 text-lg font-semibold transition-all duration-300 shadow-xl hover:shadow-emerald-500/20 transform hover:-translate-y-0.5"
                disabled={
                  !validaLocalizacao ||
                  !validaHistorico ||
                  transcrevendo ||
                  validandoHistorico
                }
              >
                {validandoHistorico ? "Validando..." : "Enviar Denúncia"}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Anonymous;
