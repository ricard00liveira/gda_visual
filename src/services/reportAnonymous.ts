import api from "@/lib/axiosConfig";
import { AnonymousReportForm } from "@/types/reportAnonymous";

export const enviarDenunciaAnonima = async (form: AnonymousReportForm) => {
  const formData = new FormData();
  formData.append("descricao", form.descricao);
  formData.append("municipio", String(form.municipio));
  formData.append("endereco", String(form.endereco));

  if (form.nr_endereco) formData.append("nr_endereco", form.nr_endereco);
  if (form.bairro) formData.append("bairro", form.bairro);
  if (form.ponto_referencia)
    formData.append("ponto_referencia", form.ponto_referencia);
  if (form.latitude) formData.append("latitude", String(form.latitude));
  if (form.longitude) formData.append("longitude", String(form.longitude));

  const response = await api.post("/denuncias/anonima/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};
