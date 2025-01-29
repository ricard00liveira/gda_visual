import { useState } from "react";
import { Reporter } from "@/types/reporter";
import { NewReporterModal } from "@/components/NewReporterModal";
import { AnonymousToggle } from "./reports/AnonymousToggle";
import { ReporterSearch } from "./reports/ReporterSearch";
import { ReporterDetails } from "./reports/ReporterDetails";

interface ReporterSectionProps {
  selectedReporter: Reporter | null;
  setSelectedReporter: (reporter: Reporter | null) => void;
  isAnonymous: boolean;
  setIsAnonymous: (value: boolean) => void;
}

export function ReporterSection({
  selectedReporter,
  setSelectedReporter,
  isAnonymous,
  setIsAnonymous,
}: ReporterSectionProps) {
  const [reporterSearch, setReporterSearch] = useState("");
  const [showNewReporterModal, setShowNewReporterModal] = useState(false);

  const handleAnonymousChange = (checked: boolean) => {
    setIsAnonymous(checked);
    if (checked) {
      setSelectedReporter(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6 space-y-4">
      {!selectedReporter && (
        <>
          <AnonymousToggle
            isAnonymous={isAnonymous}
            onAnonymousChange={handleAnonymousChange}
          />

          {!isAnonymous && (
            <ReporterSearch
              reporterSearch={reporterSearch}
              onSearchChange={setReporterSearch}
              onNewReporter={() => setShowNewReporterModal(true)}
            />
          )}
        </>
      )}

      {selectedReporter && (
        <ReporterDetails
          reporter={selectedReporter}
          onRemove={() => setSelectedReporter(null)}
        />
      )}

      <NewReporterModal
        open={showNewReporterModal}
        onOpenChange={setShowNewReporterModal}
        onSave={setSelectedReporter}
      />
    </div>
  );
}