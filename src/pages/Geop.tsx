import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Plus, Trash2 } from "lucide-react";

const Geop = () => {
  // Temporary mock data - replace with actual data fetching
  const coordinates = [
    {
      id: 1,
      name: "Avenida Paulista",
      startLatitude: "-23.561340",
      startLongitude: "-46.656141",
      endLatitude: "-23.571058",
      endLongitude: "-46.642151",
      city: "São Paulo",
    },
    {
      id: 2,
      name: "Rua Augusta",
      startLatitude: "-23.554321",
      startLongitude: "-46.651234",
      endLatitude: "-23.558765",
      endLongitude: "-46.657890",
      city: "São Paulo",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">GeoP</h1>
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
              <TableHead>Logradouro</TableHead>
              <TableHead>Início (Lat, Long)</TableHead>
              <TableHead>Fim (Lat, Long)</TableHead>
              <TableHead>Cidade</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coordinates.map((coord) => (
              <TableRow key={coord.id}>
                <TableCell>{coord.name}</TableCell>
                <TableCell>
                  {coord.startLatitude}, {coord.startLongitude}
                </TableCell>
                <TableCell>
                  {coord.endLatitude}, {coord.endLongitude}
                </TableCell>
                <TableCell>{coord.city}</TableCell>
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

export default Geop;
