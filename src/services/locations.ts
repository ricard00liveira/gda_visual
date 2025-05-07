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

// COMARCAS
export const getComarcas = async () => {
  const response = await api.get("/comarcas/");
  return response.data;
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
export const getMunicipios = async () => {
  const response = await api.get("/municipios/");
  return response.data;
};

export const getMunicipioById = async (id: number) => {
  const response = await api.get(`/municipios/${id}/read/`);
  return response.data;
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
