import { Asterisk } from "@/components/ui/asterisk";
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
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { handleUserError } from "@/lib/error";
import { unmaskCPF } from "@/lib/unmaskCPF";
import {
  UserDetail,
  UserDetailResponse,
  Usuario,
  createUsuario,
  deleteUsuario,
  getUserDetail,
  getUsuarios,
  updateUser,
} from "@/services/users";
import { Report } from "@/types/report";
import { Label } from "@radix-ui/react-label";
import { Ban, Eye, Pencil, Plus, Save, Trash2, User } from "lucide-react";
import { useEffect, useState } from "react";

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
        setIsloading(true);
        const data = await getUsuarios();
        setUsuarios(data);
        setIsloading(false);
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
        imagem_perfil: detalhes.usuario.imagem_perfil,
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
        setIsloading(true);
        const cpfValido = unmaskCPF(editForm.cpf);
        await createUsuario({
          ...editForm,
          cpf: cpfValido,
          tipo_usuario: editForm.tipo_usuario as "comum" | "operador" | "adm",
          conf_tema: editForm.conf_tema as "light" | "dark",
          password: "novo",
        });
        toast({ title: "Usuário criado com sucesso!", variant: "success" });

        const atualizados = await getUsuarios();
        setUsuarios(atualizados);
        setUsuarioDetalhes(null);
        await handleVisualizarUsuario(cpfValido);
        setIsloading(false);
      } catch (error) {
        handleUserError(error);
        setIsloading(false);
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
                <TableRow
                  key={usuario.cpf}
                  onClick={() => handleVisualizarUsuario(usuario.cpf)}
                  className="py-1 text-sm"
                >
                  <TableCell className="py-1">{usuario.nome}</TableCell>
                  <TableCell className="py-1">
                    {formatCPF(usuario.cpf)}
                  </TableCell>
                  <TableCell className="py-1">{usuario.email}</TableCell>
                  <TableCell className="py-1">
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
                <TabsTrigger value="imagem">Imagem</TabsTrigger>
                {!editando && (
                  <TabsTrigger value="denuncias">Denúncias</TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="dados" className="space-y-2 pt-4">
                {!modoNovo ? (
                  <div className="grid gap-2">
                    <Label htmlFor="cpf">
                      CPF:
                      <Asterisk />
                    </Label>
                    <Input
                      type="text"
                      disabled
                      value={formatCPF(usuarioSelecionado?.cpf) || ""}
                    />
                  </div>
                ) : (
                  <div className="grid gap-2">
                    <Label htmlFor="cpf">
                      CPF:
                      <Asterisk />
                    </Label>
                    <Input
                      type="text"
                      disabled={!editando || isloading}
                      maxLength={14}
                      value={editForm.cpf || ""}
                      onChange={(e) => {
                        const apenasNumeros = formatCPF(
                          e.target.value.replace(/\D/g, "")
                        );
                        setEditForm({
                          ...editForm,
                          cpf: apenasNumeros,
                        });
                      }}
                    />
                  </div>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="nome">
                    Nome:
                    <Asterisk />
                  </Label>
                  <Input
                    disabled={!editando || isloading}
                    value={editForm.nome}
                    onChange={(e) =>
                      setEditForm({ ...editForm, nome: e.target.value })
                    }
                  />
                  <Label htmlFor="email">
                    E-mail:
                    <Asterisk />
                  </Label>
                  <Input
                    disabled={!editando || isloading}
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                  />
                  <Label>Telefone</Label>
                  <Input
                    disabled={!editando || isloading}
                    value={editForm.telefone || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, telefone: e.target.value })
                    }
                  />
                  <Label htmlFor="tipo_usuario">
                    Tipo de usuário:
                    <Asterisk />
                  </Label>
                  <select
                    disabled={!editando || isloading}
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
                  {!modoNovo && (
                    <>
                      <p>
                        Último Acesso:{" "}
                        {new Date(
                          usuarioSelecionado.last_login
                        ).toLocaleString() + "."}
                      </p>
                      <p>
                        Criado em:{" "}
                        {new Date(
                          usuarioSelecionado.date_created
                        ).toLocaleString() + "."}
                      </p>
                    </>
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
                      disabled={!editando || isloading}
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
                      disabled={!editando || isloading}
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
                      disabled={!editando || isloading}
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
                      disabled={!editando || isloading}
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
                    disabled={!editando || isloading}
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
                      disabled={!editando || isloading}
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
                      disabled={!editando || isloading}
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
                        disabled={!editando || isloading}
                        onCheckedChange={(val) =>
                          setEditForm({ ...editForm, conf_not_newdenun: val })
                        }
                      />
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="imagem" className="space-y-2 pt-4">
                <div className="space-y-2">
                  <p>
                    <strong>Imagem atual:</strong>{" "}
                    {usuarioSelecionado?.imagem_perfil ? (
                      <img
                        src={usuarioSelecionado.imagem_perfil}
                        alt="Imagem do Usuário"
                        className="w-24 h-24 rounded-full object-cover  "
                      />
                    ) : (
                      <User className="w-12 h-12 text-gray-400" />
                    )}
                  </p>
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
