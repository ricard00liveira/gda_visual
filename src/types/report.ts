export interface Report {
  numero: number;
  endereco: string;
  status: string;
  fato: string;
  subfato: string;
  data: string;
  descricao: string;
  municipio: string;
  // evidence: {
  //   description: string;
  //   images: string[];
  // };
  denunciante: string;
}
