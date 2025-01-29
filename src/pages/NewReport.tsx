import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

import { ReporterSection } from "@/components/ReporterSection";
import { Reporter } from "@/types/reporter";
import api from "@/lib/axiosConfig";
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastViewport,
} from "@/components/ui/toast";
import { useNavigate } from "react-router-dom";

const NewReport = () => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedReporter, setSelectedReporter] = useState<Reporter | null>(
    null
  );
  const [selectedFact, setSelectedFact] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);

  const [subFacts, setSubFacts] = useState<
    Record<number, { id: number; nome: string }[]>
  >({});
  const [municipalityList, setMunicipalityList] = useState<
    { id: number; nome: string }[]
  >([]);
  const [factList, setFactList] = useState<
    { id: number; nome: string; subfatos: { id: number; nome: string }[] }[]
  >([]);
  const [selectedMunicipality, setSelectedMunicipality] = useState<
    string | null
  >(null);
  const [addresses, setAddresses] = useState<{ id: number; nome: string }[]>(
    []
  );
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [municipalityResponses, factResponses] = await Promise.all([
          api.get("/municipios/"),
          api.get("/fatos/"),
        ]);

        setMunicipalityList(municipalityResponses.data);

        const factIds = factResponses.data.map((fact: any) => fact.id);
        const subFactRequests = factIds.map((id) =>
          api.get(`/fatos/${id}/subfatos/`)
        );
        const subFactResponses = await Promise.all(subFactRequests);

        const subFactMap = subFactResponses.reduce((acc: any, res, index) => {
          acc[factIds[index]] = res.data.map((subfact: any) => ({
            id: subfact.id,
            nome: subfact.nome,
          }));
          return acc;
        }, {});
        setSubFacts(subFactMap);

        const factData = factResponses.data.map((fact: any) => ({
          id: fact.id,
          nome: fact.nome,
          subfatos: subFactMap[fact.id] || [],
        }));
        setFactList(factData);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };
    fetchData();
  }, []);

  const fetchAddresses = async (municipalityId: string) => {
    try {
      const response = await api.get(`/logradouros/${municipalityId}/`);
      console.log("Resposta da API de logradouros:", response.data); // Verifica estrutura

      let data = response.data;

      if (!Array.isArray(data) && typeof data === "object") {
        data = Object.values(data);
      }

      if (Array.isArray(data)) {
        setAddresses(data);
      } else {
        console.error("Formato inesperado para logradouros:", data);
        setAddresses([]);
      }

      setSelectedAddress(null);
    } catch (error) {
      console.error("Erro ao buscar logradouros:", error);
      setAddresses([]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (selectedFiles.length + files.length > 4) {
      toast({
        variant: "destructive",
        title: "Limite excedido",
        description: "Você pode enviar no máximo 4 arquivos.",
      });
      return;
    }

    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (
      !selectedMunicipality ||
      !selectedAddress ||
      !selectedFact ||
      !description.trim()
    ) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    const reportData = {
      municipio: selectedMunicipality,
      endereco: selectedAddress,
      fato: selectedFact.split("-")[0],
      subfato: selectedFact.split("-")[1],
      descricao: description,
      // anonima: isAnonymous,
      // denunciante: selectedReporter?.cpf || null,
    };
    setLoading(true);
    try {
      await api.post("denuncias/create", reportData);
      setShowToast(true);
      setTimeout(() => navigate("/dashboard/denuncias"), 3000);
    } catch (erro) {
      console.log(erro);
      setError("Erro ao registrar! Verifique os dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <ToastProvider>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Nova Denúncia
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Preencha o formulário abaixo para registrar uma nova denúncia
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <ReporterSection
            selectedReporter={selectedReporter}
            setSelectedReporter={setSelectedReporter}
            isAnonymous={isAnonymous}
            setIsAnonymous={setIsAnonymous}
          />

          <div className="bg-card rounded-xl shadow-sm border p-4 md:p-6 space-y-4">
            <h2 className="text-lg font-semibold text-card-foreground">
              Localização
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                onValueChange={(value) => {
                  setSelectedMunicipality(value);
                  fetchAddresses(value); // Atualiza os logradouros ao selecionar município
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma cidade" />
                </SelectTrigger>
                <SelectContent>
                  {municipalityList.map((city) => (
                    <SelectItem key={city.id} value={city.id.toString()}>
                      {city.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input placeholder="Bairro" />
              <Select
                disabled={!addresses.length}
                onValueChange={(value) => {
                  setSelectedAddress(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      addresses.length
                        ? "Selecione um logradouro"
                        : "Nenhum logradouro disponível"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(addresses) && addresses.length > 0 ? (
                    addresses
                      .filter((address) => address && address.id !== undefined) // Filtra itens inválidos
                      .map((address) => (
                        <SelectItem key={address.id} value={String(address.id)}>
                          {" "}
                          {/* Usa String() para evitar erro */}
                          {address.nome || "Logradouro sem nome"}
                        </SelectItem>
                      ))
                  ) : (
                    <p className="text-muted-foreground text-sm p-2">
                      Nenhum logradouro disponível
                    </p>
                  )}
                </SelectContent>
              </Select>
              <Input
                placeholder="Ponto de Referência"
                className="md:col-span-2"
              />
            </div>
          </div>

          <div className="bg-card rounded-xl shadow-sm border p-4 md:p-6 space-y-4">
            <h2 className="text-lg font-semibold text-card-foreground">
              Detalhes da Denúncia
            </h2>
            <Select
              onValueChange={(value) => {
                setSelectedFact(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo da denúncia" />
              </SelectTrigger>
              <SelectContent>
                {factList.flatMap((fact) =>
                  fact.subfatos.map((subfact) => (
                    <SelectItem
                      key={subfact.id}
                      value={`${fact.id}-${subfact.id}`}
                    >
                      {fact.nome} : {subfact.nome}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            <Textarea
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva os detalhes da ocorrência... Mínimo de 10 caracteres."
              className="min-h-[150px]"
            />
          </div>

          <div className="bg-card rounded-xl shadow-sm border p-4 md:p-6 space-y-4">
            <h2 className="text-lg font-semibold text-card-foreground">
              Evidências
            </h2>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/70">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Clique para fazer upload
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    (Máximo 4 arquivos)
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  onChange={handleFileChange}
                  accept="image/*,video/*"
                  disabled
                />
              </label>
            </div>
            {files.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="relative bg-muted p-2 rounded-lg group"
                  >
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                    <p className="text-sm text-card-foreground truncate">
                      {file.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Registrando..." : "Registrar denúncia"}
          </Button>
        </form>
      </div>
      {showToast && (
        <Toast>
          <ToastTitle>Denúncia registrada sucesso!</ToastTitle>
          <ToastDescription>
            Você será redirecionado para o Denúncias.
          </ToastDescription>
        </Toast>
      )}
      <ToastViewport />
    </ToastProvider>
  );
};

export default NewReport;
