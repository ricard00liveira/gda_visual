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

const Statistics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
          Estatísticas
        </h1>
        <p className="text-sm md:text-base text-gray-500 mt-1">
          Análise quantitativa das denúncias
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Denúncias por Mês</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#059669" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Tipos de Denúncia</h2>
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
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Resumo</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total de Denúncias", value: "239" },
              { label: "Em Análise", value: "45" },
              { label: "Concluídas", value: "182" },
              { label: "Arquivadas", value: "12" },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-gray-50 p-4 rounded-lg text-center"
              >
                <p className="text-sm text-gray-600">{item.label}</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;