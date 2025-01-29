import { Checkbox } from "@/components/ui/checkbox";

interface AnonymousToggleProps {
  isAnonymous: boolean;
  onAnonymousChange: (checked: boolean) => void;
}

export const AnonymousToggle = ({
  isAnonymous,
  onAnonymousChange,
}: AnonymousToggleProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="anonymous"
        checked={isAnonymous}
        onCheckedChange={onAnonymousChange}
      />
      <label
        htmlFor="anonymous"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Anônimo
      </label>
    </div>
  );
};