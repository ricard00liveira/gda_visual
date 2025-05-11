import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loading from "@/components/ui/loading";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { getCroppedImg } from "@/lib/cropImage";
import { formatCPF } from "@/lib/formatCPF";
import {
  updateUser,
  updateUserImage,
  updateUserPassword,
} from "@/services/user";
import "@/styles/hide-password-button.css";
import { Camera, Eye, EyeOff, Mail, User } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Cropper from "react-easy-crop";

function FotoCropDialog({
  previewImage,
  onCropComplete,
}: {
  previewImage: string;
  onCropComplete: (area: any) => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const handleCropComplete = useCallback(
    (croppedArea, croppedAreaPixels) => {
      onCropComplete(croppedAreaPixels);
    },
    [onCropComplete]
  );

  return (
    <div className="relative w-32 h-32 mx-auto my-4 rounded-full overflow-hidden bg-black">
      <Cropper
        image={previewImage}
        crop={crop}
        zoom={zoom}
        aspect={1}
        cropShape="round"
        showGrid={false}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
}

export default function Profile() {
  const [isloading, setIsloading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { user, login } = useAuth();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [nome, setNome] = useState(user?.nome || "");
  const [email, setEmail] = useState(user?.email || "");
  const [novaSenha, setNovaSenha] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [cropPixels, setCropPixels] = useState<{
    width: number;
    height: number;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    if (user) {
      setNome(user.nome);
      setEmail(user.email);
    }
  }, [user]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
    setShowModal(true);
    e.target.value = "";
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile || !user || !cropPixels) return;

    try {
      setIsloading(true);
      const croppedBlob = await getCroppedImg(previewImage!, cropPixels);
      const croppedFile = new File([croppedBlob], selectedFile.name, {
        type: "image/jpeg",
      });
      const updatedUser = await updateUserImage(user.cpf, croppedFile);
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
        conf_tema: localStorage.getItem("conf_tema") as "light" | "dark",
        conf_notEmail: localStorage.getItem("conf_notEmail") === "true",
        conf_notPush: localStorage.getItem("conf_notPush") === "true",
        conf_notNewDenuncia:
          localStorage.getItem("conf_notNewDenuncia") === "true",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar imagem",
        description: "Verifique o formato ou tente novamente.",
      });
    } finally {
      setShowModal(false);
      setPreviewImage(null);
      setSelectedFile(null);
      setCropPixels(null);
      setIsloading(false);
    }
  };

  const handleSalvarEdicao = async () => {
    if (!user) return;
    if (
      !nome.trim() ||
      !email.trim() ||
      nome.length < 3 ||
      email.length < 3 ||
      !/\S+@\S+\.\S+/.test(email)
    ) {
      toast({
        title: "Preencha todos os campos corretamente.",
        variant: "destructive",
      });
      return;
    }

    const nomeAlterado = nome !== user.nome;
    const emailAlterado = email !== user.email;
    const senhaAlterada = senhaAtual && novaSenha;

    if (!nomeAlterado && !emailAlterado && !senhaAlterada) {
      handleCancel();
      return;
    }

    try {
      setIsloading(true);

      // Se a senha será atualizada
      if (senhaAlterada) {
        if (novaSenha.length < 6) {
          toast({
            title: "A nova senha deve ter pelo menos 6 caracteres.",
            variant: "warning",
          });
          return;
        }
        await updateUserPassword({ atualSenha: senhaAtual, novaSenha });
        toast({ title: "Senha alterada com sucesso!", variant: "success" });
      }

      // Se nome ou email foram alterados
      if (nomeAlterado || emailAlterado) {
        const updatedUser = await updateUser(user.cpf, { nome, email });

        toast({ title: "Perfil atualizado com sucesso!", variant: "success" });

        login({
          token: localStorage.getItem("token") || "",
          refresh: localStorage.getItem("refreshToken") || "",
          user: {
            ...user,
            nome: updatedUser.nome,
            email: updatedUser.email,
          },
          conf_tema: localStorage.getItem("conf_tema") as "light" | "dark",
          conf_notEmail: localStorage.getItem("conf_notEmail") === "true",
          conf_notPush: localStorage.getItem("conf_notPush") === "true",
          conf_notNewDenuncia:
            localStorage.getItem("conf_notNewDenuncia") === "true",
        });
      }

      setIsEditing(false);
      setSenhaAtual("");
      setNovaSenha("");
    } catch (error: any) {
      if (
        error.response?.status === 403 &&
        error.response.data.error === "Senha atual incorreta."
      ) {
        toast({
          title: "Senha atual incorreta!",
          variant: "warning",
        });
      } else {
        toast({
          title: "Erro ao salvar perfil",
          description: `Tente novamente mais tarde. Erro: ${error}`,
          variant: "destructive",
        });
      }
    } finally {
      setIsloading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNome(user?.nome || "");
    setEmail(user?.email || "");
    setSenhaAtual("");
    setNovaSenha("");
  };

  return (
    <div className="container max-w-4xl py-4">
      <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>

      <div className="grid gap-6">
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar nova foto</DialogTitle>
              <DialogDescription>
                Visualize a nova imagem antes de confirmar.
              </DialogDescription>
            </DialogHeader>

            {previewImage && (
              <FotoCropDialog
                previewImage={previewImage}
                onCropComplete={(area) => setCropPixels(area)}
              />
            )}

            {isloading ? (
              <Loading>Carregando...</Loading>
            ) : (
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  title="Alterar foto"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={handleConfirmUpload}>Confirmar</Button>
              </div>
            )}
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
                <Label htmlFor="cpf">CPF</Label>
                <Input id="cpf" value={formatCPF(user?.cpf || "")} disabled />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  value={nome}
                  disabled={!isEditing}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="email"
                    className="pl-9"
                    value={email}
                    disabled={!isEditing}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">
                    Alterar senha
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Senha Atual */}
                    <div className="grid gap-2">
                      <Label htmlFor="senha-atual">Senha atual</Label>
                      <div className="relative">
                        <Input
                          id="senha-atual"
                          type={mostrarSenhaAtual ? "text" : "password"}
                          value={senhaAtual}
                          disabled={!isEditing}
                          placeholder="Senha atual"
                          onChange={(e) => setSenhaAtual(e.target.value)}
                          className="hide-password-toggle"
                        />
                        <button
                          type="button"
                          onClick={() => setMostrarSenhaAtual((prev) => !prev)}
                          className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                          disabled={!isEditing}
                        >
                          {mostrarSenhaAtual ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Nova Senha */}
                    <div className="grid gap-2">
                      <Label htmlFor="nova-senha">Nova senha</Label>
                      <div className="relative">
                        <Input
                          id="nova-senha"
                          type={mostrarNovaSenha ? "text" : "password"}
                          value={novaSenha}
                          disabled={!isEditing}
                          placeholder="Nova senha"
                          onChange={(e) => setNovaSenha(e.target.value)}
                          className="hide-password-toggle"
                        />
                        <button
                          type="button"
                          onClick={() => setMostrarNovaSenha((prev) => !prev)}
                          className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                          disabled={!isEditing}
                        >
                          {mostrarNovaSenha ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {isloading ? (
                <>
                  <div className="flex justify-center gap-2 mt-4">
                    <Loading>Carregando...</Loading>
                  </div>
                </>
              ) : isEditing ? (
                <>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={handleCancel}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSalvarEdicao}>Salvar</Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button onClick={() => setIsEditing(true)}>Editar</Button>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
