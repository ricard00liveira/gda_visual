// src/components/ui/responsive-dialog.tsx

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import * as React from "react";

// --- Componentes Principais ---
interface ResponsiveDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const ResponsiveDialog = ({ children, ...props }: ResponsiveDialogProps) => {
  const isMobile = useIsMobile();
  const Comp = isMobile ? Drawer : Dialog;
  return <Comp {...props}>{children}</Comp>;
};

const ResponsiveDialogTrigger = React.forwardRef<
  React.ElementRef<typeof DialogTrigger>,
  React.ComponentPropsWithoutRef<typeof DialogTrigger>
>((props, ref) => {
  const isMobile = useIsMobile();
  const Comp = isMobile ? DrawerTrigger : DialogTrigger;
  return <Comp ref={ref} {...props} />;
});
ResponsiveDialogTrigger.displayName = "ResponsiveDialogTrigger";

// --- Contentor Principal ---
const ResponsiveDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogContent>,
  React.ComponentPropsWithoutRef<typeof DialogContent>
>(({ children, className, ...props }, ref) => {
  const isMobile = useIsMobile();
  const Comp = isMobile ? DrawerContent : DialogContent;

  // A classe `flex-col` é a chave para o layout vertical.
  // A `max-h` garante que o modal não ultrapasse a altura da tela.
  return (
    <Comp
      ref={ref}
      className={cn("max-h-[90vh] flex flex-col", className)}
      {...props}
    >
      {children}
    </Comp>
  );
});
ResponsiveDialogContent.displayName = "ResponsiveDialogContent";

// --- Corpo Rolável ---
// A classe `flex-1` faz com que este componente ocupe todo o espaço vertical restante.
const ResponsiveDialogBody = ({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("flex-1 overflow-y-auto", className)}>
      <div className="px-6 py-4">{children}</div>
    </div>
  );
};

// --- Outros Componentes ---
const ResponsiveDialogHeader = DialogHeader;
const ResponsiveDialogTitle = DialogTitle;
const ResponsiveDialogDescription = DialogDescription;
const ResponsiveDialogFooter = DialogFooter;
const ResponsiveDialogClose = DrawerClose;

export {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
};
