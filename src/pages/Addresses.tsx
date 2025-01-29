import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";

const Addresses = () => {
  // Temporary mock data - replace with actual data fetching
  const addresses = [
    { id: 1, name: "Rua das Flores", neighborhood: "Centro", city: "São Paulo" },
    { id: 2, name: "Av. Principal", neighborhood: "Jardins", city: "São Paulo" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Logradouros</h1>
        <Button>
          <Plus className="mr-2" />
          Novo Logradouro
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Select>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Selecione uma cidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sao-paulo">São Paulo</SelectItem>
            <SelectItem value="rio-de-janeiro">Rio de Janeiro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Bairro</TableHead>
              <TableHead>Cidade</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {addresses.map((address) => (
              <TableRow key={address.id}>
                <TableCell>{address.name}</TableCell>
                <TableCell>{address.neighborhood}</TableCell>
                <TableCell>{address.city}</TableCell>
                <TableCell className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Addresses;