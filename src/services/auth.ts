import api from "@/lib/axiosConfig";

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface ProfileResponse {
  nome: string;
  cpf: string;
  tipo: "comum" | "operador" | "adm";
  email: string;
  imagem_perfil_url?: string;
  conf_tema: string;
  conf_notEmail: boolean;
  conf_notPush: boolean;
  conf_notNewDenuncia: boolean;
}

export interface RegisterPayload {
  cpf: string;
  nome: string;
  email: string;
  password: string;
  self_registration?: boolean;
}

export async function loginRequest(
  cpf: string,
  password: string
): Promise<LoginResponse> {
  const response = await api.post("/token/", { cpf, password });
  return response.data;
}

export async function getProfile(
  accessToken: string
): Promise<ProfileResponse> {
  const response = await api.get("/profile/", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}

export async function registerUser(data: RegisterPayload) {
  const response = await api.post("/usuarios/create/", data);
  return response.data;
}
