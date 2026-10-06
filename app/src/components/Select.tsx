import { ChevronDown } from "lucide-react";
import { type ReactNode, type SelectHTMLAttributes, useId } from "react";

interface SelectOptions {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  fullwidth?: boolean;
  options: SelectOptions[];
}

const Select = ({
  label,
  options,
  error,
  icon,
  fullwidth = true,
  className = "",
  id,
  ...rest
}: SelectProps) => {
  const selectId = useId();
  const finalId = id || selectId;

  return (
    <div className={`${fullwidth ? "w-full" : ""} mb-4 relative`}>
      {label && (
        <label htmlFor={finalId} className="block text-sm font-medium test-green-100 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute top-6 inset-y-0 left-0 pl-2 flex items-center text-gray-400">
            {icon}
          </div>
        )}
      </div>
      <select
        id={finalId}
        className={`${className}block w-full bg-gray-800 py-3 pl-10 pr-4 rounded-xl font-bold text-gray-50 text-sm border ${error ? "border-red-600" : "border-primary-500"}
        ${error ? "focus:border-red-500" : "focus:border-primary-700"} outline-none appearance-none`}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 top-6 rounded-full">
        <ChevronDown className="h-5 w-5 text-gray-400" />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Select;
