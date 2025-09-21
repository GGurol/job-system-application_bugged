import { cva } from 'class-variance-authority';
import React from 'react';

const buttonVariants = cva('inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none', {
  variants: {
    variant: {
      default: 'bg-blue-500 text-white hover:bg-blue-600',
      destructive: 'bg-red-500 text-white hover:bg-red-600',
      outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
      ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
      link: 'text-blue-500 hover:underline',
    },
    size: {
      default: 'px-4 py-2',
      sm: 'px-3 py-1.5 text-xs',
      lg: 'px-5 py-3 text-lg',
      icon: 'p-2',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button: React.FC<ButtonProps> = ({ variant, size, className, ...props }) => {
  return (
    <button className={buttonVariants({ variant, size, className })} {...props} />
  );
};

export default Button;