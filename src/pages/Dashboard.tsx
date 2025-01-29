import { Button } from "@/components/ui/button";
import { Bird, Dog, Filter, Leaf, Search, Trees } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/axiosConfig";

const Dashboard = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [facts, setFacts] = useState<Record<number, string>>({});
  const [subFacts, setSubFacts] = useState<Record<number, string>>({});
  const [addresses, setAddresses] = useState<Record<number, string>>({});
  const [municipalities, setMunicipalities] = useState<Record<number, string>>(
    {}
  );

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get("/denuncias/");
        const reportsData = response.data.filter(
          (report: any) => report.status === "analise"
        );
        setReports(reportsData);

        const factIds = Array.from(
          new Set(reportsData.map((r: any) => r.fato))
        );
        const subFactIds = Array.from(
          new Set(reportsData.map((r: any) => r.subfato))
        );
        const addressIds = Array.from(
          new Set(reportsData.map((r: any) => r.endereco))
        );
        const municipalityIds = Array.from(
          new Set(reportsData.map((r: any) => r.municipio))
        );

        if (factIds.length) {
          const factResponses = await api.get("/fatos/");
          const factMap = factResponses.data.reduce((acc: any, fact: any) => {
            acc[fact.id] = fact.nome;
            return acc;
          }, {});
          setFacts(factMap);
        }

        if (subFactIds.length) {
          const subFactRequests = subFactIds.map((id) =>
            api.get(`/fatos/${id}/subfatos/`)
          );
          const subFactResponses = await Promise.all(subFactRequests);
          const subFactMap = subFactResponses
            .flatMap((res) => res.data)
            .reduce((acc: any, subFact: any) => {
              acc[subFact.id] = subFact.nome;
              return acc;
            }, {});
          setSubFacts(subFactMap);
        }

        if (addressIds.length) {
          const addressRequests = addressIds.map((id) =>
            api.get(`/logradouros/${id}/read/`)
          );
          const addressResponses = await Promise.all(addressRequests);
          const addressMap = addressResponses.reduce((acc: any, res) => {
            acc[res.data.id] = res.data.nome;
            return acc;
          }, {});
          setAddresses(addressMap);
        }

        if (municipalityIds.length) {
          const municipalityResponses = await api.get("/municipios/");
          const municipalityMap = municipalityResponses.data.reduce(
            (acc: any, m: any) => {
              acc[m.id] = m.nome;
              return acc;
            },
            {}
          );
          setMunicipalities(municipalityMap);
        }
      } catch (error) {
        console.error("Erro ao buscar denúncias:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);
  const getStatusIcon = (type: string) => {
    const normalizedType = type ? type.toLowerCase() : "default"; // Evita erro se `type` for undefined

    switch (normalizedType) {
      case "flora":
        return <Leaf className="w-5 h-5" />;
      case "maus-tratos":
        return <Dog className="w-5 h-5" />;
      case "fauna":
        return <Bird className="w-5 h-5" />;
      default:
        return <Leaf className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "analise":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
      case "fila":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "concluida":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "rejeitada":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
    }
  };
  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mt-1">
          Acompanhe e gerencie as denúncias ambientais
        </p>
      </div>

      <div className="bg-card rounded-xl shadow-sm border p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-lg md:text-xl font-semibold text-card-foreground">
            Denúncias Recentes
          </h2>
          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 flex-1 sm:flex-initial"
            >
              <Filter className="w-4 h-4" />
              Filtrar
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 flex-1 sm:flex-initial"
            >
              <Search className="w-4 h-4" />
              Buscar
            </Button>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground">Carregando...</p>
        ) : reports.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Nenhuma denúncia registrada.
          </p>
        ) : (
          <div className="space-y-4">
            {reports
              .sort(
                (a, b) =>
                  new Date(b.data).getTime() - new Date(a.data).getTime()
              )
              .map((report) => (
                <div
                  key={report.numero}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border hover:shadow-md transition-shadow duration-200 gap-4 bg-background"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 ${getStatusColor(
                        report.status
                      )} rounded-lg flex items-center justify-center flex-shrink-0`}
                    >
                      {getStatusIcon(facts[report.fato])}
                    </div>
                    <div>
                      <h4 className="font-medium text-card-foreground">
                        {`Denúncia nº ${report.numero}`} -{" "}
                        {facts[report.fato] || "Fato desconhecido"} -{" "}
                        {subFacts[report.subfato] || "Subfato desconhecido"}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {(
                          addresses[report.endereco] || "Endereço desconhecido"
                        ).toUpperCase()}{" "}
                        -{" "}
                        {(
                          municipalities[report.municipio] ||
                          "Município desconhecido"
                        ).toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 ml-14 sm:ml-0">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        report.status
                      )}`}
                    >
                      {report.status === "analise" && "Em análise"}
                      {report.status === "fila" && "Aguardando atendimento"}
                      {report.status === "concluida" && "Atendimento concluído"}
                      {report.status === "negada" && "Denúncia rejeitada"}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(report.data).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
