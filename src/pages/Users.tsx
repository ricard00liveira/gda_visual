import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import {
  getUsuarios,
  deleteUsuario,
  Usuario,
  getUserDetail,
  UserDetail,
  UserDetailResponse,
} from "@/services/users";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Report } from "@/types/report";

const tipoUsuarioLabel: Record<string, string> = {
  comum: "Usuário Comum",
  operador: "Operador",
  adm: "Administrador",
};

const Users = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<string>("");
  const [filtroBusca, setFiltroBusca] = useState("");
  const [usuarioDetalhes, setUsuarioDetalhes] =
    useState<UserDetailResponse | null>(null);
  const [usuarioSelecionado, SetUsuarioSelecionado] =
    useState<UserDetail | null>(null);
  const [usuarioDenuncias, SetUsuarioDenuncias] = useState<Report[] | null>(
    null
  );

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const data = await getUsuarios();
        setUsuarios(data);
      } catch (error) {
        toast({
          title: "Erro ao carregar usuários",
          variant: "destructive",
        });
      }
    };
    fetchUsuarios();
  }, []);

  const handleExcluirUsuario = async (cpf: string) => {
    const confirm = window.confirm("Deseja realmente excluir este usuário?");
    if (!confirm) return;

    try {
      await deleteUsuario(cpf);
      toast({ title: "Usuário excluído com sucesso!", variant: "success" });
      const atualizados = await getUsuarios();
      setUsuarios(atualizados);
    } catch (error) {
      toast({ title: "Erro ao excluir usuário", variant: "destructive" });
    }
  };

  const handleVisualizarUsuario = async (cpf: string) => {
    try {
      const detalhes = await getUserDetail(cpf);
      setUsuarioDetalhes(detalhes);
      SetUsuarioSelecionado(detalhes.usuario);
      SetUsuarioDenuncias(detalhes.denuncias);
    } catch (error) {
      console.error("Erro ao carregar detalhes do usuário", error);
      toast({
        title: "Erro ao carregar detalhes do usuário",
        variant: "destructive",
      });
    }
  };

  const usuariosFiltrados = usuarios.filter((u) => {
    const correspondeTipo = filtroTipo ? u.tipo_usuario === filtroTipo : true;
    const correspondeBusca =
      u.nome.toLowerCase().includes(filtroBusca.toLowerCase()) ||
      u.cpf.includes(filtroBusca);
    return correspondeTipo && correspondeBusca;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">
          Gerenciamento de Usuários
        </h1>
      </div>

      <div className="flex items-center justify-end gap-4">
        <Input
          type="text"
          placeholder="Pesquisar por nome ou CPF"
          className="border rounded-md p-2 min-w-[200px]"
          onChange={(e) => setFiltroBusca(e.target.value)}
        />
        <select
          className="border rounded-md p-2 min-w-[200px]"
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
        >
          <option value="">Todos os tipos</option>
          <option value="comum">Usuário Comum</option>
          <option value="operador">Operador</option>
          <option value="adm">Administrador</option>
        </select>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="w-[100px] text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuariosFiltrados.length > 0 ? (
              usuariosFiltrados.map((usuario) => (
                <TableRow key={usuario.cpf}>
                  <TableCell>{usuario.nome}</TableCell>
                  <TableCell>{usuario.cpf}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>
                    {tipoUsuarioLabel[usuario.tipo_usuario] || "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleVisualizarUsuario(usuario.cpf)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleExcluirUsuario(usuario.cpf)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Nenhum usuário localizado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {usuarioDetalhes && (
        <Dialog
          open={!!usuarioDetalhes}
          onOpenChange={() => setUsuarioDetalhes(null)}
        >
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Informações do Usuário</DialogTitle>
              <DialogDescription>
                Visualização completa em abas
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="dados" className="mt-4">
              <TabsList>
                <TabsTrigger value="dados">Dados Pessoais</TabsTrigger>
                <TabsTrigger value="config">Configuração</TabsTrigger>
                <TabsTrigger value="preferencias">Preferências</TabsTrigger>
                <TabsTrigger value="denuncias">Denúncias</TabsTrigger>
              </TabsList>

              <TabsContent value="dados" className="space-y-2 pt-4">
                <p>
                  <strong>Nome:</strong> {usuarioSelecionado.nome}
                </p>
                <p>
                  <strong>CPF:</strong> {usuarioSelecionado.cpf}
                </p>
                <p>
                  <strong>Email:</strong> {usuarioSelecionado.email}
                </p>
                <p>
                  <strong>Telefone:</strong>{" "}
                  {usuarioSelecionado.telefone || "-"}
                </p>
                <p>
                  <strong>Tipo:</strong>{" "}
                  {tipoUsuarioLabel[usuarioSelecionado.tipo_usuario]}
                </p>
                <p>
                  <strong>Último Acesso:</strong>{" "}
                  {usuarioSelecionado.last_login
                    ? new Date(usuarioSelecionado.last_login).toLocaleString()
                    : "-"}
                </p>
              </TabsContent>

              <TabsContent value="config" className="space-y-2 pt-4">
                <p>
                  <strong>Superusuário:</strong>{" "}
                  {usuarioSelecionado.is_superuser ? "Sim" : "Não"}
                </p>
                <p>
                  <strong>Ativo:</strong>{" "}
                  {usuarioSelecionado.is_active ? "Sim" : "Não"}
                </p>
                <p>
                  <strong>Staff:</strong>{" "}
                  {usuarioSelecionado.is_staff ? "Sim" : "Não"}
                </p>
                <p>
                  <strong>Autocadastro:</strong>{" "}
                  {usuarioSelecionado.self_registration ? "Sim" : "Não"}
                </p>
              </TabsContent>

              <TabsContent value="preferencias" className="space-y-2 pt-4">
                <p>
                  <strong>Tema:</strong> {usuarioSelecionado.conf_tema}
                </p>
                <p>
                  <strong>Notificação por Email:</strong>{" "}
                  {usuarioSelecionado.conf_not_email ? "Sim" : "Não"}
                </p>
                <p>
                  <strong>Notificação Push:</strong>{" "}
                  {usuarioSelecionado.conf_not_push ? "Sim" : "Não"}
                </p>
                <p>
                  <strong>Nova denúncia:</strong>{" "}
                  {usuarioSelecionado.conf_not_newdenun ? "Sim" : "Não"}
                </p>
              </TabsContent>
              <TabsContent value="denuncias" className="space-y-2 pt-4">
                {usuarioDenuncias?.length ? (
                  usuarioDenuncias.map((d) => (
                    <div key={d.numero} className="border p-2 rounded mb-2">
                      <p>
                        <strong>Número:</strong> {d.numero}
                      </p>
                      <p>
                        <strong>Status:</strong> {d.status}
                      </p>
                      <p>
                        <strong>Data:</strong> {d.data}
                      </p>
                      <p>
                        <strong>Município:</strong> {d.municipio?.nome || "–"}
                      </p>
                      <p>
                        <strong>Fato:</strong> {d.fato?.nome || "–"}
                      </p>
                      <p>
                        <strong>Subfato:</strong> {d.subfato?.nome || "–"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>Nenhuma denúncia registrada.</p>
                )}
              </TabsContent>
            </Tabs>

            <DialogFooter className="pt-4">
              <Button
                variant="outline"
                onClick={() => setUsuarioDetalhes(null)}
              >
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Users;
