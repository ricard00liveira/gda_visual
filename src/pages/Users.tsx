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
import { Plus, Trash2, Eye, Ban, Pencil, Save } from "lucide-react";
import {
  getUsuarios,
  deleteUsuario,
  Usuario,
  getUserDetail,
  UserDetail,
  UserDetailResponse,
  updateUser,
  createUsuario,
} from "@/services/users";
import {
  Dialog,
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
import { Label } from "@radix-ui/react-label";
import { Switch } from "@/components/ui/switch";
import Loading from "@/components/ui/loading";

const tipoUsuarioLabel: Record<string, string> = {
  comum: "Usuário Comum",
  operador: "Operador",
  adm: "Administrador",
};

const Users = () => {
  const [isloading, setIsloading] = useState(false);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<string>("");
  const [filtroBusca, setFiltroBusca] = useState("");
  const [usuarioDetalhes, setUsuarioDetalhes] =
    useState<UserDetailResponse | null>(null);
  const [usuarioSelecionado, setUsuarioSelecionado] =
    useState<UserDetail | null>(null);
  const [usuarioDenuncias, setUsuarioDenuncias] = useState<Report[] | null>(
    null
  );
  const [editando, setEditando] = useState(false);
  const [editForm, setEditForm] = useState({
    cpf: "",
    nome: "",
    email: "",
    telefone: "",
    tipo_usuario: "comum",
    conf_tema: "light",
    conf_not_email: false,
    conf_not_push: false,
    conf_not_newdenun: false,
    is_superuser: false,
    is_active: false,
    is_staff: false,
    self_registration: false,
  });
  const [modoNovo, setModoNovo] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchUsuarios = async () => {
      if (!isMounted) return;
      try {
        const data = await getUsuarios();
        setUsuarios(data);
      } catch (error) {
        toast({ title: "Erro ao carregar usuários", variant: "destructive" });
      }
    };
    fetchUsuarios();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleExcluirUsuario = async (cpf: string) => {
    const confirm = window.confirm("Deseja realmente excluir este usuário?");
    if (!confirm) return;
    try {
      setIsloading(true);
      await deleteUsuario(cpf);
      toast({ title: "Usuário excluído com sucesso!", variant: "success" });
      setEditando(false);
      setUsuarioDetalhes(null);
      const atualizados = await getUsuarios();
      setUsuarios(atualizados);
      setIsloading(false);
    } catch (error) {
      toast({ title: "Erro ao excluir usuário", variant: "destructive" });
      setIsloading(false);
    }
  };

  const handleVisualizarUsuario = async (cpf: string) => {
    try {
      const detalhes = await getUserDetail(cpf);
      setUsuarioDetalhes(detalhes);
      setUsuarioSelecionado(detalhes.usuario);
      setUsuarioDenuncias(detalhes.denuncias);
      setEditForm({
        nome: detalhes.usuario.nome,
        email: detalhes.usuario.email,
        telefone: detalhes.usuario.telefone || "",
        tipo_usuario: detalhes.usuario.tipo_usuario,
        conf_tema: detalhes.usuario.conf_tema,
        conf_not_email: detalhes.usuario.conf_not_email,
        conf_not_push: detalhes.usuario.conf_not_push,
        conf_not_newdenun: detalhes.usuario.conf_not_newdenun,
        is_superuser: detalhes.usuario.is_superuser,
        is_active: detalhes.usuario.is_active,
        is_staff: detalhes.usuario.is_staff,
        self_registration: detalhes.usuario.self_registration,
        cpf: detalhes.usuario.cpf,
      } as any);
      setEditando(false);
    } catch (error) {
      console.error("Erro ao carregar detalhes do usuário", error);
      toast({
        title: "Erro ao carregar detalhes do usuário",
        variant: "destructive",
      });
    }
  };

  const handleSalvarEdicao = async () => {
    if (modoNovo) {
      try {
        await createUsuario({
          ...editForm,
          tipo_usuario: editForm.tipo_usuario as "comum" | "operador" | "adm",
          conf_tema: editForm.conf_tema as "light" | "dark",
          password: "novo",
        });
        toast({ title: "Usuário criado com sucesso!", variant: "success" });
        // Atualiza a lista
        const atualizados = await getUsuarios();
        setUsuarios(atualizados);
        setUsuarioDetalhes(null);
      } catch {
        toast({ title: "Erro ao criar usuário", variant: "destructive" });
      }
      return;
    }
    if (!usuarioSelecionado) return;
    setIsloading(true);
    try {
      const atualizado = await updateUser(usuarioSelecionado.cpf, {
        nome: editForm.nome,
        email: editForm.email,
        telefone: editForm.telefone,
        tipo_usuario: editForm.tipo_usuario,
        conf_tema: editForm.conf_tema,
        conf_not_email: editForm.conf_not_email,
        conf_not_push: editForm.conf_not_push,
        conf_not_newdenun: editForm.conf_not_newdenun,
        is_superuser: editForm.is_superuser,
        is_active: editForm.is_active,
        is_staff: editForm.is_staff,
        self_registration: editForm.self_registration,
      } as any);
      toast({ title: "Usuário atualizado com sucesso!", variant: "success" });
      setUsuarioSelecionado({
        ...usuarioSelecionado,
        nome: atualizado.nome,
        email: atualizado.email,
        telefone: atualizado.telefone,
        tipo_usuario: atualizado.tipo_usuario,
        conf_tema: atualizado.conf_tema,
        conf_not_email: atualizado.conf_not_email,
        conf_not_push: atualizado.conf_not_push,
        conf_not_newdenun: atualizado.conf_not_newdenun,
        is_superuser: atualizado.is_superuser,
        is_active: atualizado.is_active,
        is_staff: atualizado.is_staff,
        self_registration: atualizado.self_registration,
      } as any);
      setEditando(false);
      setIsloading(false);
    } catch (error) {
      toast({ title: "Erro ao atualizar usuário", variant: "destructive" });
      setIsloading(false);
    }
  };

  const usuariosFiltrados = usuarios.filter((u) => {
    const correspondeTipo = filtroTipo ? u.tipo_usuario === filtroTipo : true;
    const correspondeBusca =
      u.nome.toLowerCase().includes(filtroBusca.toLowerCase()) ||
      u.cpf.includes(filtroBusca);
    return correspondeTipo && correspondeBusca;
  });

  const cancelarEdicao = () => {
    setIsloading(true);
    if (!modoNovo) {
      handleVisualizarUsuario(usuarioSelecionado?.cpf || "");
      setEditForm({ ...usuarioSelecionado });
    }
    handleNovoUsuario();
    setUsuarioDetalhes(null);
    setEditando(false);
    setModoNovo(false);
    setIsloading(false);
  };
  const handleNovoUsuario = () => {
    setEditForm({
      nome: "",
      email: "",
      telefone: "",
      tipo_usuario: "comum",
      is_active: true,
      is_staff: false,
      is_superuser: false,
      self_registration: false,
      conf_tema: "light",
      conf_not_email: false,
      conf_not_push: false,
      conf_not_newdenun: false,
      cpf: "",
    });
    setUsuarioSelecionado(null);
    setUsuarioDenuncias(null);
    setEditando(true);
    setModoNovo(true);
    setUsuarioDetalhes({ usuario: {} as any, denuncias: [] });
  };

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
        <Button onClick={handleNovoUsuario}>
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
                  <TableCell>{formatCPF(usuario.cpf)}</TableCell>
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

      {(usuarioSelecionado || modoNovo) && (
        <Dialog
          open={!!usuarioDetalhes}
          onOpenChange={() => {
            setUsuarioDetalhes(null);
            setModoNovo(false);
            setEditando(false);
          }}
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
                {!editando && (
                  <TabsTrigger value="denuncias">Denúncias</TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="dados" className="space-y-2 pt-4">
                <div className="grid gap-2">
                  <Label>Nome</Label>
                  <Input
                    disabled={!editando}
                    value={editForm.nome}
                    onChange={(e) =>
                      setEditForm({ ...editForm, nome: e.target.value })
                    }
                  />
                  <Label>Email</Label>
                  <Input
                    disabled={!editando}
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                  />
                  <Label>Telefone</Label>
                  <Input
                    disabled={!editando}
                    value={editForm.telefone || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, telefone: e.target.value })
                    }
                  />
                  <Label>Tipo de Usuário</Label>
                  <select
                    disabled={!editando}
                    className="border rounded-md p-2"
                    value={editForm.tipo_usuario}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        tipo_usuario: e.target.value as any,
                      })
                    }
                  >
                    <option value="comum">Usuário Comum</option>
                    <option value="operador">Operador</option>
                    <option value="adm">Administrador</option>
                  </select>

                  {!modoNovo ? (
                    <p>
                      <strong>CPF:</strong> {formatCPF(usuarioSelecionado.cpf)}
                    </p>
                  ) : (
                    <div className="grid gap-2">
                      <Label>CPF:</Label>
                      <Input
                        disabled={!editando}
                        value={editForm.cpf || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, cpf: e.target.value })
                        }
                      />
                    </div>
                  )}
                  {!modoNovo && (
                    <p>
                      <strong>Último Acesso:</strong>{" "}
                      {new Date(usuarioSelecionado.last_login).toLocaleString()}
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="config" className="space-y-2 pt-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>
                      <strong>Superusuário</strong>
                    </span>
                    <Switch
                      checked={editForm.is_superuser}
                      disabled={!editando}
                      onCheckedChange={(val) =>
                        setEditForm({ ...editForm, is_superuser: val })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>
                      <strong>Ativo</strong>
                    </span>
                    <Switch
                      checked={editForm.is_active}
                      disabled={!editando}
                      onCheckedChange={(val) =>
                        setEditForm({ ...editForm, is_active: val })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>
                      <strong>Staff</strong>
                    </span>
                    <Switch
                      checked={editForm.is_staff}
                      disabled={!editando}
                      onCheckedChange={(val) =>
                        setEditForm({ ...editForm, is_staff: val })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>
                      <strong>Autocadastro</strong>
                    </span>
                    <Switch
                      checked={editForm.self_registration}
                      disabled={!editando}
                      onCheckedChange={(val) =>
                        setEditForm({ ...editForm, self_registration: val })
                      }
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preferencias" className="space-y-2 pt-4">
                <div className="space-y-2">
                  <Label>Tema:</Label>
                  <select
                    disabled={!editando}
                    className="border rounded-md p-2"
                    value={editForm.conf_tema}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        conf_tema: e.target.value as any,
                      })
                    }
                  >
                    <option value="light">Claro</option>
                    <option value="dark">Escuro</option>
                  </select>

                  <div className="flex items-center justify-between">
                    <span>
                      <strong>Notificação por Email</strong>
                    </span>
                    <Switch
                      checked={editForm.conf_not_email}
                      disabled={!editando}
                      onCheckedChange={(val) =>
                        setEditForm({ ...editForm, conf_not_email: val })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>
                      <strong>Notificação Push</strong>
                    </span>
                    <Switch
                      checked={editForm.conf_not_push}
                      disabled={!editando}
                      onCheckedChange={(val) =>
                        setEditForm({ ...editForm, conf_not_push: val })
                      }
                    />
                  </div>
                  {editForm.tipo_usuario !== "comum" && (
                    <div className="flex items-center justify-between">
                      <span>
                        <strong>Notificação de novas denúncias</strong>
                      </span>
                      <Switch
                        checked={editForm.conf_not_newdenun}
                        disabled={!editando}
                        onCheckedChange={(val) =>
                          setEditForm({ ...editForm, conf_not_newdenun: val })
                        }
                      />
                    </div>
                  )}
                </div>
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
                    </div>
                  ))
                ) : (
                  <p>Nenhuma denúncia registrada.</p>
                )}
              </TabsContent>
            </Tabs>
            {isloading ? (
              <Loading>Carregando...</Loading>
            ) : (
              <DialogFooter className="pt-4 flex justify-between">
                {editando ? (
                  <>
                    {!modoNovo && (
                      <div>
                        <Button
                          className="bg-yellow-500 text-white hover:bg-yellow-600"
                          onClick={() =>
                            handleExcluirUsuario(usuarioSelecionado.cpf)
                          }
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir Usuário
                        </Button>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button onClick={handleSalvarEdicao}>
                        <Save className="w-4 h-4 mr-2" />
                        Salvar
                      </Button>
                      <Button variant="destructive" onClick={cancelarEdicao}>
                        <Ban className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setUsuarioDetalhes(null)}
                    >
                      Fechar
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setEditando(true)}
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  </>
                )}
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Users;

function formatCPF(cpf: string): string {
  return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
}
