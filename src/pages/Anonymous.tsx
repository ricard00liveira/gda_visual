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
import { Shield, Upload, ArrowLeft, Leaf, HelpCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { LocationFields } from "@/components/anonymous/LocationFields";

const Anonymous = () => {
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);

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

    const invalidFiles = selectedFiles.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'video/mp4'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return !isValidType || !isValidSize;
    });

    if (invalidFiles.length > 0) {
      toast({
        variant: "destructive",
        title: "Arquivo(s) inválido(s)",
        description: "Apenas arquivos JPG, PNG ou MP4 até 5MB são permitidos.",
      });
      return;
    }

    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Denúncia enviada",
      description: "Sua denúncia foi registrada com sucesso.",
    });
  };

  return (
    <div className="public-page min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-emerald-200">
          <div className="flex items-center gap-2 mb-4 sm:mb-0">
            <Leaf className="w-8 h-8 text-emerald-600" />
            <h1 className="text-3xl font-bold text-emerald-700">GDA</h1>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Link to="/faq" className="w-full sm:w-auto">
              <Button variant="outline" className="gap-2 text-emerald-700 w-full hover:bg-emerald-50 border-emerald-200">
                <HelpCircle className="w-4 h-4" />
                Ajuda
              </Button>
            </Link>
            <Link to="/" className="w-full sm:w-auto">
              <Button variant="outline" className="gap-2 text-emerald-700 w-full hover:bg-emerald-50 border-emerald-200">
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-emerald-600" />
          <h1 className="text-3xl font-bold text-emerald-700">
            Denúncia Anônima
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Localização */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 md:p-6 space-y-4 shadow-lg border border-emerald-100 hover:shadow-xl hover:border-emerald-200 transition-all duration-500">
            <h2 className="text-xl font-semibold text-emerald-700 mb-4">
              Localização da Ocorrência
            </h2>
            <LocationFields />
          </div>

          {/* Informações do Fato */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 md:p-6 space-y-4 shadow-lg border border-emerald-100 hover:shadow-xl hover:border-emerald-200 transition-all duration-500">
            <h2 className="text-xl font-semibold text-emerald-700 mb-4">
              Informações do Fato
            </h2>
            <Select>
              <SelectTrigger className="bg-white border-emerald-200 text-gray-700 hover:border-emerald-400 transition-colors">
                <SelectValue placeholder="Tipo do fato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desmatamento">Desmatamento</SelectItem>
                <SelectItem value="poluicao">Poluição</SelectItem>
                <SelectItem value="queimada">Queimada</SelectItem>
                <SelectItem value="cacailegal">Caça Ilegal</SelectItem>
                <SelectItem value="outros">Outros</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Descreva o fato ocorrido..."
              className="bg-white border-emerald-200 text-gray-700 placeholder:text-gray-400 min-h-[150px] hover:border-emerald-400 transition-colors"
            />
          </div>

          {/* Upload de Arquivos */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 md:p-6 space-y-4 shadow-lg border border-emerald-100 hover:shadow-xl hover:border-emerald-200 transition-all duration-500">
            <h2 className="text-xl font-semibold text-emerald-700 mb-4">
              Evidências
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-emerald-200 border-dashed rounded-lg cursor-pointer bg-emerald-50/50 hover:bg-emerald-50 hover:border-emerald-400 transition-all duration-300">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-emerald-600" />
                    <p className="text-sm text-gray-600">
                      Clique para upload ou arraste arquivos aqui
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      JPG, PNG ou MP4 (máx. 5MB cada)
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.mp4"
                    onChange={handleFileChange}
                    multiple
                  />
                </label>
              </div>
              {files.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="relative bg-white p-3 rounded-lg group hover:bg-emerald-50 transition-all duration-300 border border-emerald-200"
                    >
                      <button
                        onClick={() => removeFile(index)}
                        className="absolute top-1 right-1 bg-red-500/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                      <p className="text-sm text-gray-600 truncate">{file.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Dados do Infrator */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 md:p-6 space-y-4 shadow-lg border border-emerald-100 hover:shadow-xl hover:border-emerald-200 transition-all duration-500">
            <h2 className="text-xl font-semibold text-emerald-700 mb-4">
              Dados do Infrator (Opcional)
            </h2>
            <Input
              placeholder="Nome ou apelido do infrator"
              className="bg-white border-emerald-200 text-gray-700 placeholder:text-gray-400 hover:border-emerald-400 transition-colors"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white py-6 text-lg font-semibold transition-all duration-300 shadow-xl hover:shadow-emerald-500/20 transform hover:-translate-y-0.5"
          >
            Enviar Denúncia
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Anonymous;
