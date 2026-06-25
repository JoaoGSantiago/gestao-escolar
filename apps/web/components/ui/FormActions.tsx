import { Button } from "./Button";

type FormActionsProps = {
  submitLabel: string;
  onCancel: () => void;
  cancelLabel?: string;
  tone?: "indigo" | "emerald" | "amber" | "slate";
};

export function FormActions({
  submitLabel,
  onCancel,
  cancelLabel = "Cancelar",
  tone = "indigo",
}: FormActionsProps) {
  return (
    <div className="flex justify-end gap-3">
      <Button type="button" variant="secondary" tone={tone} onClick={onCancel}>
        {cancelLabel}
      </Button>
      <Button type="submit" tone={tone}>
        {submitLabel}
      </Button>
    </div>
  );
}
