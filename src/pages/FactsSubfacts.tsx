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
  getFacts,
  getSubfactsByFact,
  createFact,
  updateFact,
  deleteFact,
  createSubfact,
  updateSubfact,
  deleteSubfact,
  Fact,
  Subfact,
} from "@/services/facts";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

const FactsSubfacts = () => {
  const [facts, setFacts] = useState<Fact[]>([]);
  const [subfacts, setSubfacts] = useState<Subfact[]>([]);
  const [openDialogFato, setOpenDialogFato] = useState(false);
  const [nomeFato, setNomeFato] = useState("");
  const [fatoSelecionado, setFatoSelecionado] = useState<Fact | null>(null);

  const [openDialogSubfato, setOpenDialogSubfato] = useState(false);
  const [subfatoSelecionado, setSubfatoSelecionado] = useState<Subfact | null>(
    null
  );
  const [nomeSubfato, setNomeSubfato] = useState("");
  const [fatoRelacionandoId, setFatoRelacionandoId] = useState<number | "">("");
  const [filtroFatoId, setFiltroFatoId] = useState<number | "">("");
  const [isloading, setIsloading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsloading(true);
        const factsData = await getFacts();
        setFacts(factsData);

        const allSubfacts = await Promise.all(
          factsData.map(async (fact: Fact) => {
            const sub = await getSubfactsByFact(fact.id);
            return sub;
          })
        );
        setSubfacts(allSubfacts.flat());
        setIsloading(false);
      } catch (error) {
        console.error("Erro ao carregar fatos e subfatos", error);
        toast({
          title: "Erro ao carregar dados",
          variant: "destructive",
        });
        setIsloading(false);
      }
    };

    fetchData();
  }, []);

  const handleSalvarFato = async () => {
    if (!nomeFato.trim()) return;

    try {
      if (fatoSelecionado) {
        await updateFact(fatoSelecionado.id, { nome: nomeFato });
        toast({ title: "Fato atualizado com sucesso!", variant: "success" });
      } else {
        await createFact({ nome: nomeFato });
        toast({ title: "Fato criado com sucesso!", variant: "success" });
      }

      setOpenDialogFato(false);
      setNomeFato("");
      setFatoSelecionado(null);

      const atualizados = await getFacts();
      setFacts(atualizados);
    } catch (error) {
      toast({ title: "Erro ao salvar fato", variant: "destructive" });
    }
  };

  const handleEditarFato = (fato: Fact) => {
    setFatoSelecionado(fato);
    setNomeFato(fato.nome);
    setOpenDialogFato(true);
  };

  const handleExcluirFato = async (fato: Fact) => {
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir o fato "${fato.nome}"?`
    );
    if (!confirmDelete) return;
    try {
      await deleteFact(fato.id);
      toast({ title: "Fato excluído com sucesso!", variant: "success" });
      const atualizados = await getFacts();
      setFacts(atualizados);
    } catch (error) {
      toast({ title: "Erro ao excluir fato", variant: "destructive" });
    }
  };

  const handleSalvarSubfato = async () => {
    if (!nomeSubfato.trim() || !fatoRelacionandoId) return;
    try {
      if (subfatoSelecionado) {
        await updateSubfact(subfatoSelecionado.id, { nome: nomeSubfato });
        toast({ title: "Subfato atualizado com sucesso!", variant: "success" });
      } else {
        await createSubfact(fatoRelacionandoId, {
          nome: nomeSubfato,
        });
        toast({ title: "Subfato criado com sucesso!", variant: "success" });
      }
      setOpenDialogSubfato(false);
      setNomeSubfato("");
      setFatoRelacionandoId("");
      setSubfatoSelecionado(null);

      const allSubfacts = await Promise.all(
        facts.map(async (fact: Fact) => await getSubfactsByFact(fact.id))
      );
      setSubfacts(allSubfacts.flat());
    } catch (error) {
      toast({ title: "Erro ao salvar subfato", variant: "destructive" });
    }
  };

  const handleEditarSubfato = (subfato: Subfact) => {
    setSubfatoSelecionado(subfato);
    setNomeSubfato(subfato.nome);
    setFatoRelacionandoId(subfato.fato);
    setOpenDialogSubfato(true);
  };

  const handleExcluirSubfato = async (subfato: Subfact) => {
    const confirmDelete = window.confirm(
      `Deseja excluir o subfato "${subfato.nome}"?`
    );
    if (!confirmDelete) return;
    try {
      await deleteSubfact(subfato.id);
      toast({ title: "Subfato excluído com sucesso!", variant: "success" });
      const allSubfacts = await Promise.all(
        facts.map(async (fact: Fact) => await getSubfactsByFact(fact.id))
      );
      setSubfacts(allSubfacts.flat());
    } catch (error) {
      toast({ title: "Erro ao excluir subfato", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">
          Gerenciamento de Fatos
        </h1>
      </div>
      {isloading ? (
        <Loading>Carregando...</Loading>
      ) : (
        <Tabs defaultValue="facts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="facts">Fatos</TabsTrigger>
            <TabsTrigger value="subfacts">Subfatos</TabsTrigger>
          </TabsList>

          <TabsContent value="facts" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={openDialogFato} onOpenChange={setOpenDialogFato}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Fato
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {fatoSelecionado ? "Editar Fato" : "Novo Fato"}
                    </DialogTitle>
                    <DialogDescription>
                      {fatoSelecionado
                        ? "Altere o nome do fato."
                        : "Insira o nome do fato."}
                    </DialogDescription>
                  </DialogHeader>
                  <Input
                    placeholder="Nome do fato"
                    value={nomeFato}
                    onChange={(e) => setNomeFato(e.target.value)}
                  />
                  <DialogFooter className="pt-4">
                    <Button onClick={handleSalvarFato}>Salvar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome do Fato</TableHead>
                    <TableHead className="w-[200px] text-center">
                      Quantidade de SubFatos
                    </TableHead>
                    <TableHead className="w-[100px] text-center">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {facts.map((fact) => {
                    const total = subfacts.filter(
                      (m) => m.fato === fact.id
                    ).length;
                    return (
                      <TableRow key={fact.id}>
                        <TableCell>{fact.nome}</TableCell>
                        <TableCell className="text-center">{total}</TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditarFato(fact)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleExcluirFato(fact)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="subfacts" className="space-y-4">
            <div className="flex items-center justify-end gap-4">
              <select
                className="border rounded-md p-2 min-w-[200px]"
                value={filtroFatoId}
                onChange={(e) => {
                  const value = e.target.value;
                  setFiltroFatoId(value === "" ? "" : Number(value));
                }}
              >
                <option value="">Todos os fatos</option>
                {facts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>

              <Dialog
                open={openDialogSubfato}
                onOpenChange={setOpenDialogSubfato}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Subfato
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {subfatoSelecionado ? "Editar Subfato" : "Novo Subfato"}
                    </DialogTitle>
                    <DialogDescription>
                      {subfatoSelecionado
                        ? "Altere os dados do subfato."
                        : "Preencha os campos para criar um novo subfato."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Nome do subfato"
                      value={nomeSubfato}
                      onChange={(e) => setNomeSubfato(e.target.value)}
                    />
                    <select
                      className="w-full border rounded-md p-2"
                      value={fatoRelacionandoId}
                      onChange={(e) =>
                        setFatoRelacionandoId(Number(e.target.value))
                      }
                    >
                      <option value="">Selecione um fato</option>
                      {facts.map((fact) => (
                        <option key={fact.id} value={fact.id}>
                          {fact.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                  <DialogFooter className="pt-4">
                    <Button onClick={handleSalvarSubfato}>Salvar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome do Subfato</TableHead>
                    <TableHead>Fato Relacionado</TableHead>
                    <TableHead className="w-[100px] text-center">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subfacts
                    .filter((s) => !filtroFatoId || s.fato === filtroFatoId)
                    .map((subfact) => {
                      const fact = facts.find((f) => f.id === subfact.fato);
                      return (
                        <TableRow key={subfact.id}>
                          <TableCell>{subfact.nome}</TableCell>
                          <TableCell>{fact?.nome || "–"}</TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditarSubfato(subfact)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleExcluirSubfato(subfact)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
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
    </div>
  );
};

export default FactsSubfacts;
