import api from "@/lib/axiosConfig";

export interface Comarca {
  id: number;
  nome: string;
}

export interface Municipio {
  id: number;
  nome: string;
  comarca: number;
}

export interface Logradouro {
  id: number;
  nome: string;
  cidade: number;
}

// localStorage
const cacheFetch = async (key: string, fetchFn: () => Promise<any>) => {
  const cached = localStorage.getItem(key);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      localStorage.removeItem(key);
    }
  }

  const data = await fetchFn();
  localStorage.setItem(key, JSON.stringify(data));
  return data;
};

// COMARCAS
export const getComarcas = async () => {
  return cacheFetch("comarcas", async () => {
    const response = await api.get("/comarcas/");
    return response.data;
  });
};

export const getComarcaById = async (id: number) => {
  const response = await api.get(`/comarcas/${id}/read/`);
  return response.data;
};

export const createComarca = async (data: { nome: string }) => {
  const response = await api.post("/comarcas/create/", data);
  return response.data;
};

export const updateComarca = async (id: number, data: { nome: string }) => {
  const response = await api.put(`/comarcas/${id}/update/`, data);
  return response.data;
};

export const deleteComarca = async (id: number) => {
  const response = await api.delete(`/comarcas/${id}/delete/`);
  return response.data;
};

// MUNICÍPIOS
export const getMunicipios = async (): Promise<Municipio[]> => {
  return cacheFetch("municipios", async () => {
    const response = await api.get("/municipios/");
    return response.data;
  });
};

export const getMunicipioById = async (id: number) => {
  return cacheFetch(`municipio_id_${id}`, async () => {
    const response = await api.get(`/municipios/${id}/read/`);
    return response.data;
  });
};

export const createMunicipio = async (data: {
  nome: string;
  comarca: number;
}) => {
  const response = await api.post("/municipios/create/", data);
  return response.data;
};

export const updateMunicipio = async (
  id: number,
  data: { nome: string; comarca: number }
) => {
  const response = await api.patch(`/municipios/${id}/update/`, data);
  return response.data;
};

export const deleteMunicipio = async (id: number) => {
  const response = await api.delete(`/municipios/${id}/delete/`);
  return response.data;
};

// LOGRADOUROS
export const getLogradourosPorMunicipio = async (
  municipioId: number,
  q: string = "",
  page: number = 1
) => {
  const params: any = { page };
  if (q.length >= 3) params.q = q;

  // chave de cache (q só se for >= 3 letras)
  const cacheKey = `logradouros_${municipioId}_q=${q}_p=${page}`;

  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      localStorage.removeItem(cacheKey);
    }
  }

  // busca da API
  const response = await api.get(`/logradouros/${municipioId}/`, { params });
  console.log("buscou na API!");
  // salva cache
  localStorage.setItem(cacheKey, JSON.stringify(response.data));

  return response.data;
};

export const deleteLogradouro = async (id: number) => {
  const response = await api.delete(`/logradouros/${id}/delete/`);
  return response.data;
};

export const updateLogradouro = async (id: number, data: { nome: string }) => {
  const response = await api.patch(`/logradouros/${id}/update/`, data);
  return response.data;
};

export const createLogradouro = async (data: {
  nome: string;
  cidade: number;
}) => {
  const response = await api.post(`/logradouros/${data.cidade}/create/`, data);
  return response.data;
};

export const getLogradouroById = async (id: number) => {
  return cacheFetch(`logradouro_${id}`, async () => {
    const response = await api.get(`/logradouros/${id}/read/`);
    return response.data;
  });
};

// IMPORTAR LOGRADOUROS
// Upload do arquivo para formatação
export const uploadArquivoIBGE = async (arquivo: File) => {
  const formData = new FormData();
  formData.append("arquivo", arquivo);

  const response = await api.post("/logradouros/normalizar-ibge/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

// Importar os dados para um município
export const importarLogradouros = async (
  municipioId: number,
  arquivoPath: string
) => {
  const response = await api.post(`/logradouros/${municipioId}/importar/`, {
    arquivo_path: arquivoPath,
  });

  return response.data;
};

// Obter GeoJSON de um logradouro
export async function getLogradouroGeojson(logradouroId: number) {
  const response = await api.get(`/logcor/${logradouroId}/geojson/`);
  return response.data;
}
