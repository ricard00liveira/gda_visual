// src/components/NewReporterModal.tsx

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";
import { toast } from "@/components/ui/use-toast";
import { formatCPF } from "@/lib/formatCPF";
import { unmaskCPF } from "@/lib/unmaskCPF";
import { validateCpf } from "@/lib/validateCPF";
import { Reporter } from "@/types/reporter";
import { useState } from "react";

interface NewReporterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (reporter: Reporter) => void;
}

export function NewReporterModal({
  open,
  onOpenChange,
  onSave,
}: NewReporterModalProps) {
  const [cpf, setCpf] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSave = () => {
    const unmaskedCpf = unmaskCPF(cpf);
    if (
      !unmaskedCpf ||
      !name.trim() ||
      !phone.trim() ||
      !validateCpf(unmaskedCpf)
    ) {
      toast({
        variant: "destructive",
        title: "Erro de Validação",
        description:
          "Por favor, preencha todos os campos corretamente. O CPF deve ser válido.",
      });
      return;
    }

    onSave({ cpf: unmaskedCpf, name, phone });
    // Limpar campos após salvar
    setCpf("");
    setName("");
    setPhone("");
    onOpenChange(false);
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatCPF(e.target.value));
  };

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-[425px]">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Novo Denunciante</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="cpf-new">CPF</Label>
              <Input
                id="cpf-new"
                placeholder="Digite o CPF"
                value={cpf}
                onChange={handleCpfChange}
                maxLength={14}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name-new">Nome completo</Label>
              <Input
                id="name-new"
                placeholder="Digite o nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone-new">Telefone</Label>
              <Input
                id="phone-new"
                placeholder="Digite o telefone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
        </ResponsiveDialogBody>

        <ResponsiveDialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Inserir</Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
