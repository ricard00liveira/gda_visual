export interface Report {
  numero: number;
  anonima: boolean;
  descricao: string;
  data: string; // formato ISO
  status: string;
  prioridade: string;
  aprovada: boolean;
  infrator: string | null;
  localizacao: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  } | null;

  denunciante: string | null;

  endereco: number | null;

  nr_endereco?: string | null;
  ponto_referencia?: string | null;
  bairro?: string | null;

  municipio: {
    id: number;
    nome: string;
  } | null;

  fato: {
    id: number;
    nome: string;
  } | null;

  subfato: {
    id: number;
    nome: string;
  } | null;

  responsavel: string | null;

  anexos: {
    id: number;
    arquivo: string; // URL
    descricao: string | null;
    data_upload: string;
  }[];

  // Histórico de status
  historico_status: {
    status: "analise" | "fila" | "atendimento" | "concluida" | "negada";
    data_alteracao: string;
  }[];
}
