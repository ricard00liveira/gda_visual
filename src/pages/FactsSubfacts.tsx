import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";

const facts = [
  { id: 1, name: "Poluição", description: "Crimes relacionados à poluição ambiental" },
  { id: 2, name: "Fauna", description: "Crimes contra a fauna" },
  { id: 3, name: "Flora", description: "Crimes contra a flora" },
  { id: 4, name: "Mineração", description: "Crimes relacionados à mineração" },
];

const subfacts = [
  { id: 1, factId: 1, name: "Atividade potencialmente poluidora sem licença", description: "Exercício de atividade sem licenciamento ambiental" },
  { id: 2, factId: 2, name: "Maus-tratos", description: "Maus-tratos contra animais" },
  { id: 3, factId: 3, name: "Corte de vegetação nativa", description: "Supressão ilegal de vegetação nativa" },
  { id: 4, factId: 4, name: "Extração de saibro", description: "Extração ilegal de saibro" },
];

const FactsSubfacts = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">
          Fatos e SubFatos
        </h1>
      </div>

      <Tabs defaultValue="facts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="facts">Fatos</TabsTrigger>
          <TabsTrigger value="subfacts">SubFatos</TabsTrigger>
        </TabsList>

        <TabsContent value="facts" className="space-y-4">
          <div className="flex justify-end">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Fato
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {facts.map((fact) => (
                  <TableRow key={fact.id}>
                    <TableCell className="font-medium">{fact.name}</TableCell>
                    <TableCell>{fact.description}</TableCell>
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

        <TabsContent value="subfacts" className="space-y-4">
          <div className="flex justify-end">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo SubFato
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subfacts.map((subfact) => (
                  <TableRow key={subfact.id}>
                    <TableCell className="font-medium">{subfact.name}</TableCell>
                    <TableCell>{subfact.description}</TableCell>
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
      </Tabs>
    </div>
  );
};

export default FactsSubfacts;