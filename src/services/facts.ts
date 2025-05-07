import api from "@/lib/axiosConfig";

// TYPES
export interface Fact {
  id: number;
  nome: string;
  descricao: string;
}

export interface Subfact {
  id: number;
  nome: string;
  fato: number;
}

// FATOS
export const getFacts = async () => {
  const res = await api.get("/fatos/");
  return res.data;
};

export const getFactById = async (id: number) => {
  const res = await api.get(`/fatos/${id}/read/`);
  return res.data;
};

export const createFact = async (data: { nome: string }) => {
  const res = await api.post("/fatos/create/", data);
  return res.data;
};

export const updateFact = async (id: number, data: { nome: string }) => {
  const res = await api.patch(`/fatos/${id}/update/`, data);
  return res.data;
};

export const deleteFact = async (id: number) => {
  const res = await api.delete(`/fatos/${id}/delete/`);
  return res.data;
};

// SUBFATOS
export const getSubfactsByFact = async (factId: number) => {
  const res = await api.get(`/fatos/${factId}/subfatos/`);
  return res.data;
};

export const getSubfactById = async (id: number) => {
  const res = await api.get(`/subfatos/${id}/read/`);
  return res.data;
};

export const createSubfact = async (factId: number, data: { nome: string }) => {
  const res = await api.post(`/fatos/${factId}/subfatos/create/`, data);
  return res.data;
};

export const updateSubfact = async (id: number, data: { nome: string }) => {
  const res = await api.put(`/subfatos/${id}/update/`, data);
  return res.data;
};

export const deleteSubfact = async (id: number) => {
  const res = await api.delete(`/subfatos/${id}/delete/`);
  return res.data;
};
