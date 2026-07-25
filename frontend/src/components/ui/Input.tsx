"use client";

import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { X } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-medium text-text-primary mb-1.5">
            {label}
          </label>
        )}
        <div className="relative rounded-xl shadow-sm">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-secondary">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={twMerge(
              clsx(
                "w-full bg-surface text-text-primary text-sm rounded-xl border border-border/80 px-4 py-2.5 outline-none transition-all duration-200 placeholder:text-text-secondary/60 focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:bg-gray-50 disabled:text-text-muted",
                leftIcon ? "pl-10" : "",
                rightIcon ? "pr-10" : "",
                error ? "border-danger focus:border-danger focus:ring-danger/10" : "",
                className
              )
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-secondary">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-danger">{error}</p>}
        {helperText && !error && <p className="mt-1 text-xs text-text-secondary">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string | number }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-medium text-text-primary mb-1.5">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={twMerge(
            clsx(
              "w-full bg-surface text-text-primary text-sm rounded-xl border border-border/80 px-4 py-2.5 outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:bg-gray-50",
              error ? "border-danger focus:border-danger focus:ring-danger/10" : "",
              className
            )
          )}
          {...props}
        >
          {options.map((opt, idx) => (
            <option key={idx} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-xs text-danger">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "md",
}) => {
  if (!isOpen) return null;

  const maxWidths = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text-primary/40 backdrop-blur-sm animate-fadeIn">
      <div
        className={clsx(
          "bg-surface w-full rounded-2xl shadow-2xl overflow-hidden border border-border/80 transition-all transform animate-scaleUp",
          maxWidths[maxWidth]
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-gray-50/50">
          <h3 className="text-base font-semibold text-text-primary">{title}</h3>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
