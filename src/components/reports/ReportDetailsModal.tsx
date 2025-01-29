import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Report } from "@/types/report";
import { ReportHeader } from "./ReportHeader";
import { ReportContent } from "./ReportContent";
import { ReportActions } from "./ReportActions";

interface ReportDetailsModalProps {
  report: Report | null;
  onClose: () => void;
  onSave?: (report: Report) => void;
}

export const ReportDetailsModal = ({
  report,
  onClose,
  onSave,
}: ReportDetailsModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedReport, setEditedReport] = useState<Report | null>(null);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedReport(report);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedReport(null);
  };

  const handleSaveEdit = () => {
    if (editedReport && onSave) {
      onSave(editedReport);
    }
    setIsEditing(false);
  };

  // const handleDeleteImage = (indexToDelete: number) => {
  //   if (editedReport) {
  //     setEditedReport({
  //       ...editedReport,
  //       evidence: {
  //         ...editedReport.evidence,
  //         images: editedReport.evidence.images.filter(
  //           (_, index) => index !== indexToDelete
  //         ),
  //       },
  //     });
  //   }
  // };

  if (!report) return null;

  const currentReport = isEditing ? editedReport : report;
  if (!currentReport) return null;

  return (
    <Dialog open={!!report} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <ReportHeader
          isEditing={isEditing}
          onEditClick={handleEditClick}
          onCancelEdit={handleCancelEdit}
          onSaveEdit={handleSaveEdit}
        />
        <ScrollArea className="h-[calc(90vh-120px)]">
          <div className="pr-4">
            <ReportContent
              report={currentReport}
              isEditing={isEditing}
              onReportChange={setEditedReport}
              onDeleteImage={() => {}}
            />
            {!isEditing && <ReportActions />}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
