"use client";

import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost" | "success";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      icon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 select-none";

    const variants = {
      primary:
        "bg-primary text-white shadow-soft hover:bg-primary-hover hover:shadow-card-hover border border-transparent",
      secondary:
        "bg-primary-light text-primary hover:bg-primary/15 border border-primary/10",
      outline:
        "bg-transparent text-primary border border-primary/30 hover:bg-primary-light/50 hover:border-primary",
      danger:
        "bg-danger text-white shadow-soft hover:bg-red-600 border border-transparent",
      ghost:
        "bg-transparent text-text-secondary hover:text-text-primary hover:bg-gray-100 border border-transparent",
      success:
        "bg-success text-white shadow-soft hover:bg-green-600 border border-transparent",
    };

    const sizes = {
      sm: "text-xs px-3 py-1.5 rounded-xl gap-1.5",
      md: "text-sm px-4 py-2.5 rounded-xl gap-2",
      lg: "text-base px-6 py-3 rounded-2xl gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5" />
        ) : (
          icon && <span className="flex-shrink-0">{icon}</span>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
