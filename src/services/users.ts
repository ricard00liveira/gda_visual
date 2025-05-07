import api from "@/lib/axiosConfig";

export interface Usuario {
  cpf: string;
  nome: string;
  email: string;
  tipo_usuario: "comum" | "operador" | "adm";
}

export const getUsuarios = async () => {
  const res = await api.get("/usuarios/");
  return res.data;
};

export const createUsuario = async (data: Partial<Usuario>) => {
  const res = await api.post("/usuarios/create/", data);
  return res.data;
};

export const updateUsuario = async (cpf: string, data: Partial<Usuario>) => {
  const res = await api.patch(`/usuarios/${cpf}/update/`, data);
  return res.data;
};

export const deleteUsuario = async (cpf: string) => {
  const res = await api.delete(`/usuarios/${cpf}/delete/`);
  return res.data;
};

export const getUsuarioByCpf = async (cpf: string) => {
  const res = await api.get(`/usuarios/${cpf}/read/`);
  return res.data;
};
