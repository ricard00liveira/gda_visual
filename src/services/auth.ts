import api from "@/lib/axiosConfig";

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface ProfileResponse {
  nome: string;
  cpf: string;
  tipo: string;
  email: string;
  imagem_perfil_url?: string;
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
