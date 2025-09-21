import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col">
        {label && <label className="mb-1 text-sm font-medium">{label}</label>}
        <input
          ref={ref}
          className={cn(
            "border rounded-md p-2 focus:outline-none focus:ring-2",
            error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500",
            className
          )}
          {...props}
        />
        {error && <span className="mt-1 text-red-500 text-sm">This field is required</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;