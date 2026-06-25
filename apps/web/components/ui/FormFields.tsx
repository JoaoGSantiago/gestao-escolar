import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from "react";

type FieldBaseProps = {
  label: string;
  className?: string;
};

type TextFieldProps = FieldBaseProps &
  InputHTMLAttributes<HTMLInputElement> & {
    inputClassName?: string;
  };

type SelectFieldProps = FieldBaseProps &
  SelectHTMLAttributes<HTMLSelectElement> & {
    children: ReactNode;
    selectClassName?: string;
  };

const fieldClassName =
  "w-full rounded-xl border border-slate-200 bg-white p-3 outline-none focus:ring-2 focus:ring-indigo-500";

export function TextField({
  label,
  className = "",
  inputClassName = "",
  ...props
}: TextFieldProps) {
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input className={`${fieldClassName} ${inputClassName}`} {...props} />
    </div>
  );
}

export function SelectField({
  label,
  className = "",
  selectClassName = "",
  children,
  ...props
}: SelectFieldProps) {
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <select className={`${fieldClassName} ${selectClassName}`} {...props}>
        {children}
      </select>
    </div>
  );
}
