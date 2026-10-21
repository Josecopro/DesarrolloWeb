import type { ReactNode } from "react";

// .form-field de legacy/assets/css/components/form-field.css. El control recibe `id` y `aria-describedby={errorId(id)}`.
export const errorId = (id: string) => `${id}-error`;

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}

export function FormField({ id, label, error, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-text">
        {label}
      </label>
      {children}
      {error && (
        <span id={errorId(id)} className="text-xs text-error-ink">
          {error}
        </span>
      )}
    </div>
  );
}
