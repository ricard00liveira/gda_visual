// src/services/report.ts
import api from "@/lib/axiosConfig";

interface DenunciaPayload {
  descricao: string;
  municipio: number;
  logradouro: number;
  nr_endereco?: string;
  bairro?: string;
  ponto_referencia?: string;
  latitude?: number;
  longitude?: number;
}

export interface TranscricaoResponse {
  transcricao: string;
  texto_final: string;
}

export async function getMinhasDenuncias() {
  const response = await api.get("/denuncias/");
  const data = response.data;
  return data.sort((a: any, b: any) => b.numero - a.numero);
}

export async function getDenunciaById(denunciaId: number) {
  const response = await api.get(`/denuncias/${denunciaId}/read/`);
  return response.data;
}

export async function enviarDenunciaComum(payload: DenunciaPayload) {
  const response = await api.post("/denuncias/create/", payload);
  return response.data;
}

export async function editarDenuncia(
  denunciaId: number,
  payload: Partial<DenunciaPayload>
) {
  const response = await api.patch(`/denuncias/${denunciaId}/update/`, payload);
  return response.data;
}

export async function deletarDenuncia(denunciaId: number) {
  const response = await api.delete(`/denuncias/${denunciaId}/delete/`);
  return response.data;
}

export async function enviarDenunciaAnonima(payload: DenunciaPayload) {
  const formData = new FormData();
  formData.append("descricao", payload.descricao);
  formData.append("municipio", String(payload.municipio));
  formData.append("logradouro", String(payload.logradouro));

  if (payload.nr_endereco) formData.append("nr_endereco", payload.nr_endereco);
  if (payload.bairro) formData.append("bairro", payload.bairro);
  if (payload.ponto_referencia)
    formData.append("ponto_referencia", payload.ponto_referencia);
  if (payload.latitude) formData.append("latitude", String(payload.latitude));
  if (payload.longitude)
    formData.append("longitude", String(payload.longitude));

  const response = await api.post("/denuncias/anonima/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function uploadAnexos(
  denunciaId: number,
  arquivos: File[],
  descricao: string = ""
) {
  const formData = new FormData();
  formData.append("denuncia", String(denunciaId));
  formData.append("descricao", descricao);

  arquivos.forEach((file) => {
    formData.append("arquivos", file);
  });

  const response = await api.post("/denuncias/anexos/upload/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function transcreverAudio(
  blob: Blob
): Promise<TranscricaoResponse> {
  const formData = new FormData();
  formData.append("audio", blob, "gravacao.webm");

  const response = await api.post("/denuncias/transcrever-audio/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function validarHistorico(
  historico: string
): Promise<"valido" | "irrelevante"> {
  try {
    const response = await api.post("/denuncias/validar-historico/", {
      historico,
    });
    return response.data.classificacao;
  } catch (error: any) {
    throw error?.response?.data?.error || "Erro ao validar o histórico.";
  }
}

export const getAnexosPorDenuncia = async (denunciaId: number) => {
  try {
    const response = await api.get(`/denuncias/${denunciaId}/anexos/`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar anexos da denúncia:", error);
    throw error;
  }
};

//
export const deletarAnexo = async (anexoId: number): Promise<void> => {
  try {
    await api.delete(`/denuncias/anexos/${anexoId}/delete/`);
  } catch (error) {
    console.error("Erro ao deletar anexo:", error);
    throw error;
  }
};
