import { ReportDetailsModal } from "@/components/reports/ReportDetailsModal";
import { Accordion } from "@/components/ui/accordion";
import GrupoDenuncias from "@/components/ui/grupoDenuncias";
import { getLogradouroById, getMunicipios } from "@/services/locations";
import { getMinhasDenuncias } from "@/services/report";
import {
  CheckCircle2,
  ClipboardList,
  Clock,
  Hourglass,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

const MyReports = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [municipios, setMunicipios] = useState<Record<number, string>>({});
  const [logradouros, setLogradouros] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMinhasDenuncias();
        setReports(data);
        const munRes = await getMunicipios();
        const munMap = munRes.reduce((acc: any, m: any) => {
          acc[m.id] = m.nome;
          return acc;
        }, {});
        setMunicipios(munMap);

        const logIds = [...new Set(data.map((r: any) => r.endereco))];
        const logMap: any = {};
        await Promise.all(
          logIds.map(async (id: number) => {
            const l = await getLogradouroById(id);
            logMap[l.id] = l.nome;
          })
        );
        setLogradouros(logMap);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const grupos = {
    analise: reports.filter((r) => r.status === "analise"),
    fila: reports.filter((r) => r.status === "fila"),
    atendimento: reports.filter((r) => r.status === "atendimento"),
    concluida: reports.filter((r) => r.status === "concluida"),
    rejeitada: reports.filter((r) => r.status === "rejeitada"),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
          Minhas Denúncias
        </h1>
        <p className="text-sm text-muted-foreground">
          Acompanhe o andamento das denúncias que você registrou.
        </p>
      </div>

      <div className="bg-white border rounded-xl p-4 shadow space-y-6">
        {loading ? (
          <p className="text-center text-muted-foreground">
            Carregando denúncias...
          </p>
        ) : reports.length === 0 ? (
          <p className="text-center text-muted-foreground">Nenhuma denúncia.</p>
        ) : (
          <Accordion type="multiple" className="w-full space-y-3">
            <GrupoDenuncias
              grupo={grupos.analise}
              titulo={
                <>
                  <Hourglass className="inline-block w-4 h-4 mr-2 text-yellow-500" />
                  Em Análise
                </>
              }
              mensagem="A denúncia foi recebida e está sob avaliação preliminar pela equipe."
              value="analise"
              municipios={municipios}
              logradouros={logradouros}
              onSelect={setSelectedReport}
            />

            <GrupoDenuncias
              grupo={grupos.fila}
              titulo={
                <>
                  <Clock className="inline-block w-4 h-4 mr-2 text-blue-500" />
                  Na Fila
                </>
              }
              mensagem="A denúncia foi aprovada e aguarda atendimento."
              value="fila"
              municipios={municipios}
              logradouros={logradouros}
              onSelect={setSelectedReport}
            />

            <GrupoDenuncias
              grupo={grupos.atendimento}
              titulo={
                <>
                  <ClipboardList className="inline-block w-4 h-4 mr-2 text-emerald-500" />
                  Em Atendimento
                </>
              }
              mensagem="A equipe está investigando e atuando sobre a denúncia."
              value="atendimento"
              municipios={municipios}
              logradouros={logradouros}
              onSelect={setSelectedReport}
            />

            <GrupoDenuncias
              grupo={grupos.concluida}
              titulo={
                <>
                  <CheckCircle2 className="inline-block w-4 h-4 mr-2 text-green-600" />
                  Concluídas
                </>
              }
              mensagem="As providências foram tomadas e a denúncia foi encerrada."
              value="concluida"
              municipios={municipios}
              logradouros={logradouros}
              onSelect={setSelectedReport}
            />

            <GrupoDenuncias
              grupo={grupos.rejeitada}
              titulo={
                <>
                  <XCircle className="inline-block w-4 h-4 mr-2 text-red-500" />
                  Rejeitadas
                </>
              }
              mensagem="A denúncia foi recusada por falta de dados, inconsistência ou inadequação aos critérios."
              value="rejeitada"
              municipios={municipios}
              logradouros={logradouros}
              onSelect={setSelectedReport}
            />
          </Accordion>
        )}
        {selectedReport && (
          <ReportDetailsModal
            report={selectedReport}
            onClose={() => setSelectedReport(null)}
            onSave={(updated) => {
              setReports((prev) =>
                prev.map((r) => (r.numero === updated.numero ? updated : r))
              );
              setSelectedReport(updated);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default MyReports;
