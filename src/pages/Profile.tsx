import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { updateUserImage } from "@/services/user";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Camera, Mail, User } from "lucide-react";

function isPWAInstalled(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true
  ); // iOS Safari
}
export default function Profile() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { user, login } = useAuth();

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isPWAInstalled()) {
      console.log("PWA instalado!");
    } else {
      console.log("PWA não está instalado.");
    }
  }, []);
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
    setShowModal(true);
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile || !user) return;

    try {
      const updatedUser = await updateUserImage(user.cpf, selectedFile);
      toast({
        title: "Foto atualizada com sucesso!",
        variant: "success",
        duration: 2000,
      });

      login({
        token: localStorage.getItem("token") || "",
        refresh: localStorage.getItem("refreshToken") || "",
        user: {
          ...user,
          imagem_perfil_url: updatedUser.imagem_perfil,
        },
      });

      setShowModal(false);
      setPreviewImage(null);
      setSelectedFile(null);
    } catch {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar imagem",
        description: "Verifique o formato ou tente novamente.",
      });
    }
  };

  return (
    <div className="container max-w-4xl py-4">
      <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>

      <div className="grid gap-6">
        {/* Modal de pré-visualização */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar nova foto</DialogTitle>
            </DialogHeader>
            {previewImage && (
              <img
                src={previewImage}
                alt="Pré-visualização"
                className="w-32 h-32 rounded-full object-cover mx-auto my-4"
              />
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleConfirmUpload}>Confirmar</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Foto do perfil */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Foto do Perfil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="relative">
                {user?.imagem_perfil_url ? (
                  <img
                    src={user.imagem_perfil_url}
                    alt="Imagem do usuário"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                />

                <Button
                  size="icon"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 rounded-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              <div>
                <h3 className="font-medium">Alterar foto</h3>
                <p className="text-sm text-gray-500">
                  Clique no botão para fazer upload de uma nova foto
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações pessoais */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  value={user?.nome || ""}
                  disabled={!isEditing}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="email"
                    className="pl-9"
                    value={user?.email || ""}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={() => setIsEditing(false)}>Salvar</Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>Editar</Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
