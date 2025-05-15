// src/services/reportCommon.ts
import api from "@/lib/axiosConfig";

export interface CommonReportForm {
  descricao: string;
  municipio: number | null;
  endereco: number | null;
  bairro?: string;
  nr_endereco?: string;
  ponto_referencia?: string;
  latitude?: number;
  longitude?: number;
}

export async function enviarDenunciaComum(data: CommonReportForm) {
  const response = await api.post("/denuncias/create/", data);
  return response.data;
}
