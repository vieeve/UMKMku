"use client";

import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  bordered?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable = false, bordered = true, padding = "md", children, ...props }, ref) => {
    const baseStyles = "bg-white/70 backdrop-blur-xl rounded-card transition-all duration-200";
    const borderStyles = bordered ? "border border-white/60 shadow-[0_4px_30px_rgba(0,0,0,0.03)]" : "";
    const shadowStyles = hoverable
      ? "shadow-card hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer"
      : "shadow-card";

    const paddings = {
      none: "p-0",
      sm: "p-3.5 sm:p-4",
      md: "p-5 sm:p-6",
      lg: "p-6 sm:p-8",
    };

    return (
      <div
        ref={ref}
        className={twMerge(
          clsx(baseStyles, borderStyles, shadowStyles, paddings[padding], className)
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={twMerge(clsx("flex flex-col space-y-1.5 mb-4", className))} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => (
  <h3
    className={twMerge(
      clsx("text-lg font-semibold leading-none tracking-tight text-text-primary", className)
    )}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  children,
  ...props
}) => (
  <p className={twMerge(clsx("text-sm text-text-secondary", className))} {...props}>
    {children}
  </p>
);
