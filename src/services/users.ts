import api from "@/lib/axiosConfig";
import { Report } from "@/types/report";

export interface Usuario {
  cpf: string;
  nome: string;
  email: string;
  tipo_usuario: "comum" | "operador" | "adm";
}

export interface UserDetail {
  cpf: string;
  nome: string;
  email: string;
  telefone: string | null;
  tipo_usuario: "comum" | "operador" | "adm";
  imagem_perfil: string;
  conf_tema: "light" | "dark";
  conf_not_email: boolean;
  conf_not_push: boolean;
  conf_not_newdenun: boolean;
  last_login: string | null;
  date_created: string | null;
  is_superuser: boolean;
  is_active: boolean;
  is_staff: boolean;
  self_registration: boolean;
  reset_token: string | null;
  reset_token_created: string | null;
  ativo: boolean;
  groups: string[];
  user_permissions: string[];
}

export interface UsuarioCreatePayload {
  cpf: string;
  nome: string;
  email: string;
  telefone: string | null;
  tipo_usuario: "comum" | "operador" | "adm";
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  self_registration: boolean;
  conf_tema: "light" | "dark";
  conf_not_email: boolean;
  conf_not_push: boolean;
  conf_not_newdenun: boolean;
  password: string | "novo";
}

export interface UserDetailResponse {
  usuario: UserDetail;
  denuncias: Report[];
}

export const getUsuarios = async () => {
  const res = await api.get("/usuarios/");
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

export const updateUserPreferences = async (
  cpf: string,
  data: {
    conf_tema: "light" | "dark";
    conf_not_email: boolean;
    conf_not_push: boolean;
    conf_not_newdenun: boolean;
  }
) => {
  const response = await api.patch(`/usuarios/${cpf}/update/`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const getUserDetail = async (
  cpf: string
): Promise<UserDetailResponse> => {
  const response = await api.get<UserDetailResponse>(`/usuarios/${cpf}/read/`);
  return response.data;
};

export async function updateUser(
  cpf: string,
  data: {
    nome: string;
    email: string;
    is_active: boolean;
    is_staff: boolean;
    self_registration: boolean;
    conf_tema: "light" | "dark";
    conf_not_email: boolean;
    conf_not_push: boolean;
    conf_not_newdenun?: boolean; // só se não for usuário comum
  }
) {
  const response = await api.patch(`/usuarios/${cpf}/update/`, data);
  return response.data;
}

export async function createUsuario(data: UsuarioCreatePayload) {
  const response = await api.post("/usuarios/create/", data);
  return response.data;
}
