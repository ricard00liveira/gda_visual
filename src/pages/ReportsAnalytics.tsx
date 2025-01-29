import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const data = [
  { name: "Jan", total: 45 },
  { name: "Fev", total: 32 },
  { name: "Mar", total: 28 },
  { name: "Abr", total: 39 },
  { name: "Mai", total: 52 },
  { name: "Jun", total: 43 },
];

const pieData = [
  { name: "Desmatamento", value: 40 },
  { name: "Poluição", value: 30 },
  { name: "Queimada", value: 20 },
  { name: "Outros", value: 10 },
];

const COLORS = ["#059669", "#0284c7", "#dc2626", "#737373"];

const ReportsAnalytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Relatórios
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mt-1">
          Análise e visualização de dados das denúncias
        </p>
      </div>

      <Tabs defaultValue="reports" className="w-full">
        <TabsList className="w-full justify-start bg-card">
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
          <TabsTrigger value="map">Mapa</TabsTrigger>
          <TabsTrigger value="statistics">Estatísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="mt-6">
          <div className="bg-card rounded-xl shadow-sm border p-4 md:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Últimos 7 dias</SelectItem>
                    <SelectItem value="30d">Últimos 30 dias</SelectItem>
                    <SelectItem value="90d">Últimos 90 dias</SelectItem>
                    <SelectItem value="365d">Último ano</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="desmatamento">Desmatamento</SelectItem>
                    <SelectItem value="poluicao">Poluição</SelectItem>
                    <SelectItem value="queimada">Queimada</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Filtrar
                </Button>
              </div>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Exportar
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "Total de Denúncias", value: "127" },
                  { label: "Em Análise", value: "45" },
                  { label: "Concluídas", value: "82" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-muted p-4 rounded-lg text-center"
                  >
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="text-2xl font-bold text-primary mt-1">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">Denúncias por Tipo</h3>
                <div className="space-y-4">
                  {[
                    { type: "Desmatamento", count: 45, percentage: 35 },
                    { type: "Poluição", count: 32, percentage: 25 },
                    { type: "Queimada", count: 28, percentage: 22 },
                    { type: "Outros", count: 22, percentage: 18 },
                  ].map((item) => (
                    <div key={item.type} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-card-foreground">{item.type}</span>
                        <span className="text-muted-foreground">
                          {item.count} ({item.percentage}%)
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="map" className="mt-6">
          <div className="bg-card rounded-xl shadow-sm border p-4 md:p-6">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Mapa será implementado aqui</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="statistics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card p-4 rounded-xl shadow-sm border">
              <h2 className="text-lg font-semibold text-card-foreground mb-4">Denúncias por Mês</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" className="text-muted-foreground/20" />
                    <XAxis dataKey="name" className="text-muted-foreground" />
                    <YAxis className="text-muted-foreground" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        color: 'hsl(var(--card-foreground))'
                      }}
                    />
                    <Bar dataKey="total" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-card p-4 rounded-xl shadow-sm border">
              <h2 className="text-lg font-semibold text-card-foreground mb-4">Tipos de Denúncia</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="hsl(var(--primary))"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        color: 'hsl(var(--card-foreground))'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-card p-4 rounded-xl shadow-sm border md:col-span-2">
              <h2 className="text-lg font-semibold text-card-foreground mb-4">Resumo</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Total de Denúncias", value: "239" },
                  { label: "Em Análise", value: "45" },
                  { label: "Concluídas", value: "182" },
                  { label: "Arquivadas", value: "12" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-muted p-4 rounded-lg text-center"
                  >
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="text-2xl font-bold text-primary mt-1">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsAnalytics;