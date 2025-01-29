import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PenSquare, Save, X } from "lucide-react";

interface ReportHeaderProps {
  isEditing: boolean;
  onEditClick: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
}

export const ReportHeader = ({
  isEditing,
  onEditClick,
  onCancelEdit,
  onSaveEdit,
}: ReportHeaderProps) => {
  return (
    <DialogHeader className="flex flex-row items-center justify-between">
      <DialogTitle className="text-xl font-semibold">
        Detalhes da Denúncia
      </DialogTitle>
      {!isEditing ? (
        <Button variant="ghost" size="icon" onClick={onEditClick}>
          <PenSquare className="h-4 w-4" />
        </Button>
      ) : (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={onCancelEdit}>
            <X className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onSaveEdit}>
            <Save className="h-4 w-4" />
          </Button>
        </div>
      )}
    </DialogHeader>
  );
};