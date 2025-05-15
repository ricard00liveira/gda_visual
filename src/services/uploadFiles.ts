import api from "@/lib/axiosConfig";

export async function uploadAnexos(
  denuncia: number,
  arquivos: File[],
  descricao: string = ""
) {
  const formData = new FormData();
  formData.append("denuncia", String(denuncia));
  formData.append("descricao", descricao);

  arquivos.forEach((file) => {
    formData.append("arquivos", file);
  });

  try {
    const response = await api.post("denuncias/anexos/upload/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { error: "Erro ao fazer upload dos anexos." };
  }
}
