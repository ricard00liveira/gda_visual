import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Loading from "@/components/ui/loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import {
  Logradouro,
  Municipio,
  createLogradouro,
  deleteLogradouro,
  getLogradouroGeojson,
  getLogradourosPorMunicipio,
  getMunicipios,
  importarLogradouros,
  updateLogradouro,
  uploadArquivoIBGE,
} from "@/services/locations";
import { GoogleMap, Polyline, useJsApiLoader } from "@react-google-maps/api";
import { MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function Addresses() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCgunavWw1zPPLGG5CWOHFIf4N9NbLqrE0",
  }); //todo: move to env

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [logradouros, setLogradouros] = useState<Logradouro[]>([]);
  const [municipioSelecionado, setMunicipioSelecionado] = useState<
    number | null
  >(null);
  const [filtro, setFiltro] = useState<string>("");
  const [pagina, setPagina] = useState<number>(1);
  const [temMaisPaginas, setTemMaisPaginas] = useState<boolean>(false);
  const [logradouroEditando, setLogradouroEditando] =
    useState<Logradouro | null>(null);
  const [logradouroExcluindo, setLogradouroExcluindo] =
    useState<Logradouro | null>(null);
  const [logradouroSelecionado, setLogradouroSelecionado] =
    useState<Logradouro | null>(null);
  const [nomeLogradouro, setNomeLogradouro] = useState("");
  const [openLogradouroDialog, setOpenLogradouroDialog] = useState(false);
  const [openNovoLogradouroDialog, setOpenNovoLogradouroDialog] =
    useState(false);
  const [novoNomeLogradouro, setNovoNomeLogradouro] = useState("");
  const [novoMunicipioId, setNovoMunicipioId] = useState<number | "">("");
  const [openImportDialog, setOpenImportDialog] = useState(false);
  const [arquivoIBGE, setArquivoIBGE] = useState<File | null>(null);
  const [arquivoTemporario, setArquivoTemporario] = useState<string | null>(
    null
  );
  const [municipioImportacaoId, setMunicipioImportacaoId] = useState<
    number | ""
  >("");
  const [openMapaDialog, setOpenMapaDialog] = useState(false);
  const [geojsonTrecho, setGeojsonTrecho] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: -30.0,
    lng: -52.0,
  });
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    if (mapInstance && geojsonTrecho?.geometry?.coordinates?.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      geojsonTrecho.geometry.coordinates.forEach((segmento: any) => {
        segmento.forEach(([lng, lat]: [number, number]) => {
          bounds.extend(new google.maps.LatLng(lat, lng));
        });
      });
      mapInstance.fitBounds(bounds);
    }
  }, [mapInstance, geojsonTrecho]);

  useEffect(() => {
    const fetchMunicipios = async () => {
      setIsLoading(true);
      try {
        const data = await getMunicipios();
        setMunicipios(data);
      } catch (error) {
        toast({ title: "Erro ao buscar municípios", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchMunicipios();
  }, []);

  useEffect(() => {
    const fetchLogradouros = async () => {
      if (municipioSelecionado !== null) {
        setIsLoading(true);
        try {
          const response = await getLogradourosPorMunicipio(
            municipioSelecionado,
            filtro.length >= 3 ? filtro : "",
            pagina
          );
          setLogradouros(response.results);
          setTemMaisPaginas(response.next !== null);
        } catch (error) {
          toast({
            title: "Erro ao buscar logradouros",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(true);
        setLogradouros([]);
        setIsLoading(false);
      }
    };
    fetchLogradouros();
  }, [municipioSelecionado, filtro, pagina]);

  const handleEditLogradouro = (logradouro: Logradouro) => {
    setLogradouroSelecionado(logradouro);
    setNomeLogradouro(logradouro.nome);
    setOpenLogradouroDialog(true);
  };

  const handleSalvarLogradouro = async () => {
    if (!nomeLogradouro.trim() || !logradouroSelecionado) return;

    try {
      setIsLoading(true);
      await updateLogradouro(logradouroSelecionado.id, {
        nome: nomeLogradouro,
      });
      toast({
        title: "Logradouro atualizado com sucesso!",
        variant: "success",
      });

      setOpenLogradouroDialog(false);
      setLogradouroSelecionado(null);
      setNomeLogradouro("");

      // Atualizar a lista atual
      const response = await getLogradourosPorMunicipio(
        municipioSelecionado!,
        filtro.length >= 3 ? filtro : "",
        pagina
      );
      setLogradouros(response.results);
      setTemMaisPaginas(response.next !== null);
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao salvar logradouro",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLogradouro = async (logradouro: Logradouro) => {
    const confirmacao = window.confirm(
      `Tem certeza que deseja excluir o logradouro "${logradouro.nome}"?`
    );
    if (!confirmacao) return;

    try {
      setIsLoading(true);
      await deleteLogradouro(logradouro.id);
      toast({ title: "Logradouro excluído com sucesso" });

      // Atualiza a lista
      const response = await getLogradourosPorMunicipio(
        municipioSelecionado!,
        filtro.length >= 3 ? filtro : "",
        pagina
      );
      setLogradouros(response.results);
      setTemMaisPaginas(response.next !== null);
    } catch (error) {
      toast({ title: "Erro ao excluir logradouro", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCriarLogradouro = async () => {
    if (!novoNomeLogradouro.trim() || !novoMunicipioId) return;

    try {
      setIsLoading(true);
      await createLogradouro({
        nome: novoNomeLogradouro,
        cidade: Number(novoMunicipioId),
      });

      toast({
        title: "Logradouro criado com sucesso!",
        variant: "success",
      });

      setOpenNovoLogradouroDialog(false);
      setNovoNomeLogradouro("");
      setNovoMunicipioId("");

      if (municipioSelecionado === Number(novoMunicipioId)) {
        const response = await getLogradourosPorMunicipio(
          municipioSelecionado!,
          filtro.length >= 3 ? filtro : "",
          pagina
        );
        setLogradouros(response.results);
        setTemMaisPaginas(response.next !== null);
      }
    } catch (error) {
      console.log(error);
      if (
        error.response?.status === 400 &&
        error.response?.data?.nome[0] ===
          "Já existe um logradouro com este nome neste município."
      ) {
        toast({
          title: "Atenção!",
          description: `"${novoNomeLogradouro.toUpperCase()}" já existe neste município.`,
          variant: "warning",
          duration: 5000,
        });
      } else
        toast({
          title: "Erro ao criar logradouro.",
          variant: "destructive",
        });
    } finally {
      setIsLoading(false);
    }
  };
  // IMPORTAÇÃO DE LOGRADOUROS
  const handleUploadIBGE = async () => {
    if (!arquivoIBGE) return;
    try {
      setIsLoading(true);
      const result = await uploadArquivoIBGE(arquivoIBGE);
      toast({ title: result.mensagem, variant: "success" });
      setArquivoTemporario(result.arquivo_temporario);
    } catch (error) {
      toast({
        title: "Erro ao normalizar o arquivo IBGE",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportarLogradouros = async () => {
    if (!arquivoTemporario || !municipioImportacaoId) return;
    try {
      setIsLoading(true);
      const result = await importarLogradouros(
        Number(municipioImportacaoId),
        arquivoTemporario
      );
      toast({
        title: result.mensagem,
        description: `${result.logradouros_criados} logradouros e ${result.geometrias_salvas} trechos importados.`,
        variant: "success",
      });

      setOpenImportDialog(false);
      setArquivoIBGE(null);
      setArquivoTemporario(null);
      setMunicipioImportacaoId("");

      if (municipioSelecionado === Number(municipioImportacaoId)) {
        const response = await getLogradourosPorMunicipio(
          municipioSelecionado!,
          filtro.length >= 3 ? filtro : "",
          pagina
        );
        setLogradouros(response.results);
        setTemMaisPaginas(response.next !== null);
      }
    } catch (error) {
      toast({ title: "Erro ao importar logradouros", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  // VISUALIZAR MAPA
  const handleVisualizarMapa = async (logradouroId: number) => {
    try {
      const response = await getLogradouroGeojson(logradouroId);
      //console.log(response);
      setGeojsonTrecho(response);

      // Tenta usar a primeira coordenada como centro do mapa
      const coords = response.geometry.coordinates[0]?.[0];
      if (coords) {
        const [lng, lat] = coords;
        setMapCenter({ lat, lng });
      }

      setOpenMapaDialog(true);
    } catch (error) {
      //console.error(error);
      toast({
        title: "Erro ao carregar geometria",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Logradouros por Município</h1>

      <div className="flex items-center gap-4">
        <label htmlFor="municipio">Selecione um município:</label>
        <select
          id="municipio"
          value={municipioSelecionado ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            setMunicipioSelecionado(value ? Number(value) : null);
            setPagina(1);
          }}
          className="border rounded px-2 py-1"
        >
          <option value="">Todos</option>
          {municipios.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nome}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Filtrar logradouro"
          value={filtro}
          onChange={(e) => {
            setFiltro(e.target.value);
            setPagina(1);
          }}
          className="border rounded px-2 py-1"
        />
        <Button onClick={() => setOpenNovoLogradouroDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Logradouro
        </Button>
        <Button
          className="bg-yellow-500 text-white hover:bg-yellow-600"
          onClick={() => setOpenImportDialog(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Importar Logradouros
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead className="text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : (
              <>
                {logradouros.length > 0 ? (
                  logradouros.map((logradouro) => (
                    <TableRow key={logradouro.id} className="py-1 text-sm">
                      <TableCell className="py-1">{logradouro.id}</TableCell>
                      <TableCell className="py-1">{logradouro.nome}</TableCell>
                      <TableCell className="py-1 justify-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleVisualizarMapa(logradouro.id)}
                          >
                            <MapPin className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditLogradouro(logradouro)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteLogradouro(logradouro)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-4">
                      Nenhum logradouro encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
        <>
          <Dialog open={openMapaDialog} onOpenChange={setOpenMapaDialog}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Trecho Geográfico</DialogTitle>
                <DialogDescription>
                  Visualização no Google Maps com dados do GeoDjango
                </DialogDescription>
              </DialogHeader>
              {!isLoaded ? (
                <p className="text-center text-gray-500">Carregando mapa...</p>
              ) : (
                <>
                  <div style={{ height: "500px", width: "100%" }}>
                    {geojsonTrecho?.geometry ? (
                      (() => {
                        const polylines: JSX.Element[] = [];

                        geojsonTrecho.geometry.coordinates.forEach(
                          (segmento: any, idx: number) => {
                            const path = segmento.map(
                              ([lng, lat]: [number, number]) => ({ lat, lng })
                            );

                            polylines.push(
                              <Polyline
                                key={`poly-${idx}-${Date.now()}`}
                                path={path}
                                options={{
                                  strokeColor: "#FF0000",
                                  strokeOpacity: 0.35,
                                  strokeWeight: 7.5,
                                }}
                              />
                            );
                          }
                        );

                        return (
                          <GoogleMap
                            mapContainerStyle={{
                              height: "100%",
                              width: "100%",
                            }}
                            center={mapCenter}
                            zoom={14}
                            onLoad={(map) => {
                              setMapInstance(map);
                            }}
                          >
                            {polylines}
                          </GoogleMap>
                        );
                      })()
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Carregando geometria...
                      </p>
                    )}
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </>
        <>
          <Dialog open={openImportDialog} onOpenChange={setOpenImportDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Importar Logradouros (IBGE)</DialogTitle>
                <DialogDescription>
                  Envie o arquivo `.json` do IBGE e posterior selecione o
                  município de destino.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <input
                  type="file"
                  accept=".json"
                  disabled={isLoading}
                  onChange={(e) => setArquivoIBGE(e.target.files?.[0] || null)}
                />

                {arquivoTemporario && (
                  <select
                    className="w-full border rounded px-2 py-1"
                    value={municipioImportacaoId}
                    onChange={(e) =>
                      setMunicipioImportacaoId(
                        e.target.value ? Number(e.target.value) : ""
                      )
                    }
                  >
                    <option value="">
                      Selecione o município para importar
                    </option>
                    {municipios.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nome}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <DialogFooter className="pt-4">
                {!isLoading ? (
                  <>
                    {!arquivoTemporario ? (
                      <Button
                        onClick={handleUploadIBGE}
                        disabled={!arquivoIBGE}
                      >
                        Enviar
                      </Button>
                    ) : (
                      <Button
                        onClick={handleImportarLogradouros}
                        disabled={!municipioImportacaoId}
                      >
                        Importar Dados para Município
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Loading>Carregando...</Loading>
                  </>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
        <>
          <Dialog
            open={openNovoLogradouroDialog}
            onOpenChange={setOpenNovoLogradouroDialog}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Logradouro</DialogTitle>
                <DialogDescription>
                  Preencha o nome e selecione o município para criar um novo
                  logradouro.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Nome do logradouro"
                  value={novoNomeLogradouro}
                  onChange={(e) => setNovoNomeLogradouro(e.target.value)}
                />
                <select
                  className="w-full border rounded px-2 py-1"
                  value={novoMunicipioId}
                  onChange={(e) =>
                    setNovoMunicipioId(
                      e.target.value ? Number(e.target.value) : ""
                    )
                  }
                >
                  <option value="">Selecione um município</option>
                  {municipios.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nome}
                    </option>
                  ))}
                </select>
              </div>
              <DialogFooter className="pt-4">
                {!isLoading && (
                  <Button onClick={handleCriarLogradouro}>Criar</Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
        <Dialog
          open={openLogradouroDialog}
          onOpenChange={setOpenLogradouroDialog}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Logradouro</DialogTitle>
              <DialogDescription>
                Altere o nome do logradouro e clique em "Salvar alterações".
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Nome do logradouro"
                value={nomeLogradouro}
                onChange={(e) => setNomeLogradouro(e.target.value)}
              />
            </div>
            <DialogFooter className="pt-4">
              {!isLoading && (
                <>
                  <Button onClick={handleSalvarLogradouro}>
                    Salvar alterações
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex justify-between pt-3">
        <button
          className="px-3 py-1 rounded border disabled:opacity-50"
          onClick={() => setPagina((prev) => Math.max(prev - 1, 1))}
          disabled={pagina === 1}
        >
          Anterior
        </button>
        <span>Página {pagina}</span>
        <button
          className="px-3 py-1 rounded border disabled:opacity-50"
          onClick={() => setPagina((prev) => prev + 1)}
          disabled={!temMaisPaginas}
        >
          Próxima
        </button>
      </div>
    </div>
  );
}
