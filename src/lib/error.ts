import { toast } from "@/components/ui/use-toast";

export function handleUserError(error: any) {
  console.error("Erro ao criar/editar usuário:", error);

  const status = error.response?.status;
  const data = error.response?.data;
  const titulo = "Erro ao processar usuário!";

  if (status === 400 && data) {
    const messages: string[] = [];

    if (data?.cpf?.length) {
      for (const msg of data.cpf) {
        if (msg === "user with this CPF already exists.") {
          messages.push("Esse CPF já está registrado no sistema.");
        } else if (msg === "Enter a valid CPF.") {
          messages.push("O CPF deve conter 11 dígitos numéricos.");
        } else if (msg === "This field may not be blank.") {
          messages.push("O campo CPF não pode ficar em branco.");
        } else {
          messages.push(`CPF: ${msg}`);
        }
      }
    }

    if (data?.email?.length) {
      for (const msg of data.email) {
        if (msg === "user with this Email already exists.") {
          messages.push("Esse e-mail já está em uso.");
        } else if (msg === "Enter a valid email address.") {
          messages.push("Endereço de e-mail inválido.");
        } else if (msg === "This field may not be blank.") {
          messages.push("O campo e-mail não pode ficar em branco.");
        } else {
          messages.push(`Email: ${msg}`);
        }
      }
    }

    if (data?.nome?.[0] === "This field may not be blank.") {
      messages.push("O campo nome não pode ficar em branco.");
    }

    // Exibir todos os toasts
    if (messages.length) {
      messages.forEach((msg) =>
        toast({
          title: titulo,
          description: msg,
          variant: "warning",
          duration: Infinity,
        })
      );
      return;
    }
  }

  if (status === 500) {
    return toast({
      title: "Erro interno do servidor",
      description: "Tente novamente mais tarde ou contate o suporte.",
      variant: "destructive",
      duration: Infinity,
    });
  }

  toast({
    title: titulo,
    description:
      "Ocorreu um erro inesperado. Verifique os dados ou tente novamente.",
    variant: "destructive",
    duration: Infinity,
  });
}
