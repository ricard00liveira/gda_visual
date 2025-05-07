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
import { Plus, Pencil, Trash2 } from "lucide-react";
import { getUsuarios, deleteUsuario, Usuario } from "@/services/users";
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

const tipoUsuarioLabel: Record<string, string> = {
  comum: "Usuário Comum",
  operador: "Operador",
  adm: "Administrador",
};

const Users = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<Usuario[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<string>("");
  const [filtroBusca, setFiltroBusca] = useState<string>("");

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

  useEffect(() => {
    const resultados = usuarios.filter((usuario) => {
      const busca = filtroBusca.toLowerCase();
      const correspondeBusca =
        usuario.nome.toLowerCase().includes(busca) ||
        usuario.cpf.includes(busca);
      const correspondeTipo = filtroTipo
        ? usuario.tipo_usuario === filtroTipo
        : true;
      return correspondeBusca && correspondeTipo;
    });
    setUsuariosFiltrados(resultados);
  }, [usuarios, filtroBusca, filtroTipo]);

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
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
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
    </div>
  );
};

export default Users;
