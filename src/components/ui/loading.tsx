import { Loader2 } from "lucide-react";

interface LoadingProps {
  fullPage?: boolean;
  children?: React.ReactNode;
}

const Loading = ({ fullPage = false, children }: LoadingProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${
        fullPage ? "h-screen" : "py-10"
      } text-muted-foreground animate-fade-in`}
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      {children && <p className="text-sm text-center">{children}</p>}
    </div>
  );
};

export default Loading;
