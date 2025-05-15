import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { updateUserPreferences } from "@/services/users";
import { Bell, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Settings() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const { user, login } = useAuth();

  const [conf_tema, setConfTema] = useState<"light" | "dark">("light");
  const [conf_not_email, setNotEmail] = useState(false);
  const [conf_not_push, setNotPush] = useState(false);
  const [conf_not_newdenun, setNotNewDenun] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (user) {
      const tema = localStorage.getItem("conf_tema") as "light" | "dark";
      const notEmail = localStorage.getItem("conf_not_email") === "true";
      const notPush = localStorage.getItem("conf_not_push") === "true";
      const notNewDenun = localStorage.getItem("conf_not_newdenun") === "true";

      setConfTema(tema);
      setNotEmail(notEmail);
      setNotPush(notPush);
      setNotNewDenun(notNewDenun);
      setTheme(tema);
    }
  }, [user, setTheme]);

  const handleThemeChange = (value: "light" | "dark") => {
    setConfTema(value);
    setTheme(value);

    localStorage.setItem("conf_tema", value);

    toast({
      title: "Tema alterado",
      description: `Tema alterado para ${
        value === "dark" ? "escuro" : "claro"
      }.`,
    });
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      await updateUserPreferences(user.cpf, {
        conf_tema,
        conf_not_email,
        conf_not_push,
        conf_not_newdenun,
      });

      localStorage.setItem("conf_tema", conf_tema);
      localStorage.setItem("conf_not_email", String(conf_not_email));
      localStorage.setItem("conf_not_push", String(conf_not_push));
      localStorage.setItem("conf_not_newdenun", String(conf_not_newdenun));

      login({
        token: localStorage.getItem("token") || "",
        refresh: localStorage.getItem("refreshToken") || "",
        user,
        conf_tema,
        conf_notEmail: conf_not_email,
        conf_notPush: conf_not_push,
        conf_notNewDenuncia: conf_not_newdenun,
      });

      toast({
        title: "Preferências salvas",
        variant: "success",
      });
    } catch (error) {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    }
  };

  if (!mounted) return null;

  return (
    <div className="container max-w-4xl py-4">
      <h1 className="text-2xl font-bold mb-6">Configurações</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Aparência</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {conf_tema === "light" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
                <div>
                  <Label>Tema</Label>
                  <p className="text-sm text-muted-foreground">
                    Escolha entre tema claro ou escuro
                  </p>
                </div>
              </div>
              <Select value={conf_tema} onValueChange={handleThemeChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="dark">Escuro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Notificações</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Bell className="h-5 w-5" />
                <div>
                  <Label>Notificações por email</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba atualizações por email
                  </p>
                </div>
              </div>
              <Switch checked={conf_not_email} onCheckedChange={setNotEmail} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Bell className="h-5 w-5" />
                <div>
                  <Label>Notificações push</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba notificações no navegador
                  </p>
                </div>
              </div>
              <Switch checked={conf_not_push} onCheckedChange={setNotPush} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Bell className="h-5 w-5" />
                <div>
                  <Label>Notificações de novas denúncias</Label>
                  <p className="text-sm text-muted-foreground">
                    Seja notificado quando uma nova denúncia for registrada
                  </p>
                </div>
              </div>
              <Switch
                checked={conf_not_newdenun}
                onCheckedChange={setNotNewDenun}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar alterações</Button>
        </div>
      </div>
    </div>
  );
}
