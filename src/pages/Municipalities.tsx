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
import { Plus, Pencil, Trash2 } from "lucide-react";

// Mock data for example
const districts = [
  {
    id: 1,
    name: "Pelotas",
    municipalities: [
      "Pelotas",
      "Turuçu",
      "Capão do Leão",
      "Arroio do Padre",
      "Morro Redondo",
    ],
  },
];

const Municipalities = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">
          Gerenciamento de Municípios
        </h1>
      </div>

      <Tabs defaultValue="districts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="districts">Comarcas</TabsTrigger>
          <TabsTrigger value="municipalities">Municípios</TabsTrigger>
        </TabsList>

        <TabsContent value="districts" className="space-y-4">
          <div className="flex justify-end">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Comarca
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome da Comarca</TableHead>
                  <TableHead>Quantidade de Municípios</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {districts.map((district) => (
                  <TableRow key={district.id}>
                    <TableCell className="font-medium">
                      {district.name}
                    </TableCell>
                    <TableCell>{district.municipalities.length}</TableCell>
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
        </TabsContent>

        <TabsContent value="municipalities" className="space-y-4">
          <div className="flex justify-end">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Município
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Município</TableHead>
                  <TableHead>Comarca</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {districts.map((district) =>
                  district.municipalities.map((municipality, index) => (
                    <TableRow key={`${district.id}-${index}`}>
                      <TableCell className="font-medium">
                        {municipality}
                      </TableCell>
                      <TableCell>{district.name}</TableCell>
                      <TableCell className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Municipalities;