import type {LucideIcon} from 'lucide-react';

interface LoginFormInputProps {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  icon: LucideIcon;
  placeholder?: string;
  required?: boolean;
}

export default function LoginFormInput({
  label,
  type,
  value,
  onChange,
  icon: Icon,
  placeholder,
  required = true
}: LoginFormInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-cafe-text-muted ml-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-cafe-text-muted">
          <Icon className="size-5" />
        </div>
        <input
          type={type}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-cafe-bg border border-cafe-secondary rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-cafe-primary/20 focus:border-cafe-primary outline-none transition-all"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
