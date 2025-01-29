import { Bell, Check, Info, AlertTriangle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Notifications = () => {
  const notifications = [
    {
      id: 1,
      title: "Nova denúncia registrada",
      description: "Uma nova denúncia foi registrada no setor norte",
      time: "2 min atrás",
      type: "success",
      read: false,
    },
    {
      id: 2,
      title: "Atualização de status",
      description: "A denúncia #123 foi atualizada para 'Em análise'",
      time: "1 hora atrás",
      type: "info",
      read: false,
    },
    {
      id: 3,
      title: "Alerta de área crítica",
      description: "Múltiplas denúncias na mesma região detectadas",
      time: "3 horas atrás",
      type: "warning",
      read: true,
    },
    {
      id: 4,
      title: "Nova denúncia registrada",
      description: "Uma nova denúncia foi registrada no setor sul",
      time: "5 horas atrás",
      type: "success",
      read: true,
    },
    {
      id: 5,
      title: "Atualização do sistema",
      description: "O sistema será atualizado hoje às 22h",
      time: "1 dia atrás",
      type: "info",
      read: true,
    },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Notificações</h1>
          <p className="text-muted-foreground">
            Gerencie suas notificações e atualizações do sistema
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Check className="h-4 w-4" />
          Marcar todas como lidas
        </Button>
      </div>

      <Card>
        <ScrollArea className="h-[600px] w-full">
          <div className="divide-y">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-muted/50 transition-colors ${
                  notification.read ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-2 rounded-full ${
                      notification.type === "success"
                        ? "bg-emerald-100"
                        : notification.type === "warning"
                        ? "bg-yellow-100"
                        : "bg-blue-100"
                    }`}
                  >
                    {notification.type === "success" ? (
                      <Bell className="h-4 w-4 text-emerald-600" />
                    ) : notification.type === "warning" ? (
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    ) : (
                      <Info className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{notification.title}</h3>
                      <span className="text-sm text-muted-foreground">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default Notifications;