export interface Report {
  numero: number;
  anonima: boolean;
  descricao: string;
  data: string; // formato ISO
  status: "analise" | "fila" | "atendimento" | "concluida" | "negada";
  prioridade: "baixa" | "media" | "alta" | "urgente";
  aprovada: boolean;
  infrator: string | null;
  localizacao: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  } | null;

  // Relacionamentos
  denunciante: {
    cpf: string;
    nome: string;
    email: string;
    tipo_usuario: "comum" | "operador" | "adm";
    imagem_perfil?: string;
  } | null;

  endereco: {
    id: number;
    nome: string; // supondo nome do logradouro
  } | null;

  nr_endereco?: string | null;
  ponto_referencia?: string | null;

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

  responsavel?: {
    cpf: string;
    nome: string;
    tipo_usuario: "comum" | "operador" | "adm";
  } | null;

  // Lista de arquivos anexados
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
