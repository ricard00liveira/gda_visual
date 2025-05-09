import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/loading";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  getComarcas,
  getMunicipios,
  createComarca,
  updateComarca,
  deleteComarca,
  Comarca,
  Municipio,
  createMunicipio,
  updateMunicipio,
  deleteMunicipio,
} from "@/services/locations";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

const Municipalities = () => {
  const [comarcas, setComarcas] = useState<Comarca[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [novaComarca, setNovaComarca] = useState("");

  const [editarDialog, setEditarDialog] = useState(false);
  const [comarcaSelecionada, setComarcaSelecionada] = useState<Comarca | null>(
    null
  );
  const [novoNome, setNovoNome] = useState("");
  const [openMunicipioDialog, setOpenMunicipioDialog] = useState(false);
  const [municipioSelecionado, setMunicipioSelecionado] =
    useState<Municipio | null>(null);
  const [nomeMunicipio, setNomeMunicipio] = useState("");
  const [comarcaSelecionadaMunicipio, setComarcaSelecionadaMunicipio] =
    useState<number | "">("");
  const [filtroComarcaId, setFiltroComarcaId] = useState<number | "">("");
  const [isloading, setIsloading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (!isMounted) return;
      try {
        setIsloading(true);
        const [comarcasData, municipiosData] = await Promise.all([
          getComarcas(),
          getMunicipios(),
        ]);
        setComarcas(comarcasData);
        setMunicipios(municipiosData);
        setIsloading(false);
      } catch (error) {
        console.error("Erro ao buscar comarcas ou municípios:", error);
        setIsloading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreateComarca = async () => {
    if (!novaComarca.trim()) return;

    try {
      await createComarca({ nome: novaComarca });

      toast({
        title: "Comarca criada com sucesso!",
        variant: "success",
        duration: 2000,
      });

      setNovaComarca("");
      setOpenDialog(false);

      const atualizadas = await getComarcas();
      setComarcas(atualizadas);
    } catch (error) {
      console.error("Erro ao criar comarca:", error);

      toast({
        title: "Erro ao criar comarca",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleEditarComarca = (comarca: Comarca) => {
    setComarcaSelecionada(comarca);
    setNovoNome(comarca.nome);
    setEditarDialog(true);
  };

  const handleSalvarEdicao = async () => {
    if (!comarcaSelecionada || !novoNome.trim()) return;

    try {
      await updateComarca(comarcaSelecionada.id, { nome: novoNome });

      toast({
        title: "Comarca atualizada com sucesso!",
        variant: "success",
        duration: 2000,
      });

      setEditarDialog(false);
      setComarcaSelecionada(null);
      setNovoNome("");

      const atualizadas = await getComarcas();
      setComarcas(atualizadas);
    } catch (error) {
      console.error("Erro ao atualizar comarca:", error);
      toast({
        title: "Erro ao atualizar comarca.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleExcluirComarca = async (comarca: Comarca) => {
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir a comarca "${comarca.nome}"?`
    );
    if (!confirmDelete) return;

    try {
      await deleteComarca(comarca.id);

      toast({
        title: "Comarca excluída com sucesso!",
        variant: "success",
        duration: 2000,
      });

      const atualizadas = await getComarcas();
      setComarcas(atualizadas);
    } catch (error) {
      console.error("Erro ao excluir comarca:", error);
      toast({
        title: "Erro ao excluir comarca.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleAbrirNovoMunicipio = () => {
    setMunicipioSelecionado(null);
    setNomeMunicipio("");
    setComarcaSelecionadaMunicipio("");
    setOpenMunicipioDialog(true);
  };

  const handleEditarMunicipio = (municipio: Municipio) => {
    setMunicipioSelecionado(municipio);
    setNomeMunicipio(municipio.nome);
    setComarcaSelecionadaMunicipio(municipio.comarca);
    setOpenMunicipioDialog(true);
  };

  const handleSalvarMunicipio = async () => {
    if (!nomeMunicipio.trim() || !comarcaSelecionadaMunicipio) return;

    try {
      if (municipioSelecionado) {
        await updateMunicipio(municipioSelecionado.id, {
          nome: nomeMunicipio,
          comarca: comarcaSelecionadaMunicipio,
        });

        toast({
          title: "Município atualizado com sucesso!",
          variant: "success",
          duration: 2000,
        });
      } else {
        await createMunicipio({
          nome: nomeMunicipio,
          comarca: comarcaSelecionadaMunicipio,
        });

        toast({
          title: "Município criado com sucesso!",
          variant: "success",
          duration: 2000,
        });
      }

      setOpenMunicipioDialog(false);
      setNomeMunicipio("");
      setComarcaSelecionadaMunicipio("");
      setMunicipioSelecionado(null);

      const atualizados = await getMunicipios();
      setMunicipios(atualizados);
    } catch (error) {
      console.error("Erro ao salvar município:", error);
      toast({
        title: "Erro ao salvar município",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleExcluirMunicipio = async (municipio: Municipio) => {
    const confirmDelete = window.confirm(
      `Deseja excluir o município "${municipio.nome}"?`
    );
    if (!confirmDelete) return;

    try {
      await deleteMunicipio(municipio.id);

      toast({
        title: "Município excluído com sucesso!",
        variant: "success",
        duration: 2000,
      });

      const atualizados = await getMunicipios();
      setMunicipios(atualizados);
    } catch (error) {
      console.error("Erro ao excluir município:", error);
      toast({
        title: "Erro ao excluir município",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">
          Gerenciamento de Municípios
        </h1>
      </div>
      {isloading ? (
        <Loading>Carregando...</Loading>
      ) : (
        <Tabs defaultValue="districts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="districts">Comarcas</TabsTrigger>
            <TabsTrigger value="municipalities">Municípios</TabsTrigger>
          </TabsList>

          <TabsContent value="districts" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Comarca
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nova Comarca</DialogTitle>
                    <DialogDescription>
                      Informe o nome da nova comarca e clique em "Salvar" para
                      registrá-la.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Nome da comarca"
                      value={novaComarca}
                      onChange={(e) => setNovaComarca(e.target.value)}
                    />
                  </div>
                  <DialogFooter className="pt-4">
                    <Button onClick={handleCreateComarca}>Salvar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome da Comarca</TableHead>
                    <TableHead className="w-[200px] text-center">
                      Quantidade de Municípios
                    </TableHead>
                    <TableHead className="w-[100px] text-center">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comarcas.map((comarca) => {
                    const total = municipios.filter(
                      (m) => m.comarca === comarca.id
                    ).length;
                    return (
                      <TableRow key={comarca.id}>
                        <TableCell className="font-medium">
                          {comarca.nome}
                        </TableCell>
                        <TableCell className="text-center">{total}</TableCell>
                        <TableCell className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditarComarca(comarca)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleExcluirComarca(comarca)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent
            value="municipalities"
            className="space-y-4 transition-all duration-300"
          >
            <div className="flex items-center gap-4 justify-end">
              <select
                className="border rounded-md p-2"
                value={filtroComarcaId}
                onChange={(e) => {
                  const value = e.target.value;
                  setFiltroComarcaId(value === "" ? "" : Number(value));
                }}
              >
                <option value="">Todas as comarcas</option>
                {comarcas.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
              <Button onClick={handleAbrirNovoMunicipio}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Município
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Município</TableHead>
                    <TableHead className="w-[200px] text-center">
                      Comarca
                    </TableHead>
                    <TableHead className="w-[100px] text-center">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {municipios
                    .filter(
                      (m) => !filtroComarcaId || m.comarca === filtroComarcaId
                    )
                    .map((municipio) => {
                      const comarca = comarcas.find(
                        (c) => c.id === municipio.comarca
                      );
                      return (
                        <TableRow key={municipio.id}>
                          <TableCell className="font-medium">
                            {municipio.nome}
                          </TableCell>
                          <TableCell className="text-center">
                            {comarca?.nome || "–"}
                          </TableCell>
                          <TableCell className="flex justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditarMunicipio(municipio)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleExcluirMunicipio(municipio)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      )}

      <Dialog open={editarDialog} onOpenChange={setEditarDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Comarca</DialogTitle>
            <DialogDescription>
              Altere o nome da comarca selecionada e clique em "Salvar
              alterações".
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Nome da comarca"
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
            />
          </div>
          <DialogFooter className="pt-4">
            <Button onClick={handleSalvarEdicao}>Salvar alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={openMunicipioDialog} onOpenChange={setOpenMunicipioDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {municipioSelecionado ? "Editar Município" : "Novo Município"}
            </DialogTitle>
            <DialogDescription>
              {municipioSelecionado
                ? "Altere os dados e clique em salvar."
                : "Preencha os dados e clique em salvar para criar um novo município."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Nome do município"
              value={nomeMunicipio}
              onChange={(e) => setNomeMunicipio(e.target.value)}
            />
            <select
              className="w-full border rounded-md p-2"
              value={comarcaSelecionadaMunicipio}
              onChange={(e) =>
                setComarcaSelecionadaMunicipio(Number(e.target.value))
              }
            >
              <option value="">Selecione uma comarca</option>
              {comarcas.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>
          <DialogFooter className="pt-4">
            <Button onClick={handleSalvarMunicipio}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Municipalities;
