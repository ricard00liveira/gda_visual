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

  municipio: number | null;

  fato: number | null;

  subfato: number | null;

  responsavel: string | null;

  anexos: {
    id: number;
    arquivo: string; // nome do arquivo
    arquivo_url: string; // URL
    descricao: string | null;
    data_upload: string;
  }[];

  // Histórico de status
  historico_status: {
    status: "analise" | "fila" | "atendimento" | "concluida" | "negada";
    data_alteracao: string;
  }[];
}

export interface Anexo {
  id: number;
  arquivo: string;
  arquivo_url?: string;
  data_upload: string;
}
