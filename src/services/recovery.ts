import api from "@/lib/axiosConfig";

export async function solicitarRecuperacaoSenha(identificador: string) {
  const response = await api.post("/usuarios/recuperar-senha/", {
    identificador,
  });
  return response.data;
}

export async function verificarTokenRecuperacao(token: string) {
  const response = await api.get(`/usuarios/verificar-token/${token}/`);
  return response.data; // { cpf: "12345678900" }
}

export async function redefinirSenha(token: string, novaSenha: string) {
  const response = await api.post("/usuarios/redefinir-senha/", {
    token,
    nova_senha: novaSenha,
  });
  return response.data;
}
