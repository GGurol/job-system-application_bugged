export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export interface CardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export interface InputProps {
  label: string;
  type?: string;
  placeholder?: string;
  error?: boolean;
}

export interface FormProps {
  onSubmit: (data: Record<string, any>) => void;
  children: React.ReactNode;
}

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error';
  children: React.ReactNode;
}

export interface AvatarProps {
  src: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
}

export interface DropdownMenuProps {
  items: Array<{ label: string; onClick: () => void }>;
}

export interface SkeletonProps {
  width?: string;
  height?: string;
}

export interface AlertProps {
  variant: 'info' | 'success' | 'warning' | 'error';
  children: React.ReactNode;
}

export interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
}

export interface TableProps {
  data: Array<Record<string, any>>;
  columns: Array<{ Header: string; accessor: string }>;
}

export interface ProgressProps {
  value: number;
  max?: number;
}

export interface ToastProps {
  message: string;
  duration?: number;
}