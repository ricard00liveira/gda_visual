import api from "@/lib/axiosConfig";

export async function updateUserImage(cpf: string, imagem: File) {
  const formData = new FormData();
  formData.append("imagem_perfil", imagem);

  const response = await api.patch(`/usuarios/${cpf}/update/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  console.log(response.data);
  return response.data;
}

export async function removeUserImage(cpf: string) {
  const response = await api.patch(`/usuarios/${cpf}/update/`, {
    imagem_perfil: null,
  });
  return response.data;
}

export async function updateUser(cpf: string, data: { email: any; nome: any }) {
  const response = await api.patch(`/usuarios/${cpf}/update/`, {
    email: data.email,
    nome: data.nome,
  });
  return response.data;
}
