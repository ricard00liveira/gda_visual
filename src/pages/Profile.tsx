import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Mail, User } from "lucide-react";
import { useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { updateUserImage } from "@/services/user";
import { toast } from "@/hooks/use-toast";

export default function Profile() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  console.log(user);
  const handleUploadImagem = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      await updateUserImage(user.cpf, file);
      toast({ title: "Foto atualizada com sucesso!" });
      // window.location.reload();
    } catch (error) {
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
                  onChange={handleUploadImagem}
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
