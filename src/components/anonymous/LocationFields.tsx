import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, XCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface LocationFieldsProps {
  disabled?: boolean;
}

export const LocationFields = ({ disabled }: LocationFieldsProps) => {
  const { toast } = useToast();
  const [isGPSActive, setIsGPSActive] = useState(false);
  const [address, setAddress] = useState("");
  const [number, setNumber] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [reference, setReference] = useState("");

  const handleGetLocation = () => {
    toast({
      title: "Obtendo localização...",
      description: "Aguarde enquanto obtemos sua localização.",
    });

    // Simulando delay de requisição
    setTimeout(() => {
      setAddress("AVENIDA DUQUE DE CAXIAS");
      setCity("Pelotas");
      setIsGPSActive(true);
      
      toast({
        title: "Localização obtida",
        description: "Endereço preenchido com sucesso!",
      });
    }, 1500);
  };

  const handleClearLocation = () => {
    setAddress("");
    setNumber("");
    setNeighborhood("");
    setCity("");
    setReference("");
    setIsGPSActive(false);
    
    toast({
      title: "Localização removida",
      description: "Os campos foram liberados para edição.",
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="relative md:col-span-1">
        <Input
          placeholder="Endereço"
          className="bg-white border-emerald-200 text-gray-700 placeholder:text-gray-400 pr-24 hover:border-emerald-400 transition-colors"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={disabled || isGPSActive}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
          {isGPSActive ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClearLocation}
              className="h-8 w-8 hover:bg-red-50"
            >
              <XCircle className="h-5 w-5 text-red-500" />
            </Button>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleGetLocation}
                    className="h-8 w-8 hover:bg-emerald-50"
                  >
                    <MapPin className="h-5 w-5 text-emerald-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clique para capturar sua localização com GPS</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
      <Input
        placeholder="Cidade"
        className="bg-white border-emerald-200 text-gray-700 placeholder:text-gray-400 hover:border-emerald-400 transition-colors"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        disabled={disabled || isGPSActive}
      />
      <Input
        placeholder="Número"
        className="bg-white border-emerald-200 text-gray-700 placeholder:text-gray-400 hover:border-emerald-400 transition-colors"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        disabled={disabled}
      />
      <Input
        placeholder="Bairro"
        className="bg-white border-emerald-200 text-gray-700 placeholder:text-gray-400 hover:border-emerald-400 transition-colors"
        value={neighborhood}
        onChange={(e) => setNeighborhood(e.target.value)}
        disabled={disabled}
      />
      <Input
        placeholder="Ponto de Referência"
        className="bg-white border-emerald-200 text-gray-700 placeholder:text-gray-400 hover:border-emerald-400 transition-colors md:col-span-2"
        value={reference}
        onChange={(e) => setReference(e.target.value)}
        disabled={disabled}
      />
    </div>
  );
};