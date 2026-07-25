"use client";

import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "danger" | "primary" | "neutral" | "auto";
  status?: "Tersedia" | "Stok Menipis" | "Habis" | string;
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "auto",
  status,
  size = "md",
  children,
  ...props
}) => {
  let resolvedVariant = variant;

  if (variant === "auto" && status) {
    if (status === "Tersedia" || status === "Selesai" || status === "IN") {
      resolvedVariant = "success";
    } else if (status === "Stok Menipis" || status === "Pending") {
      resolvedVariant = "warning";
    } else if (status === "Habis" || status === "Batal" || status === "OUT") {
      resolvedVariant = "danger";
    } else {
      resolvedVariant = "primary";
    }
  }

  const baseStyles =
    "inline-flex items-center font-medium rounded-full tracking-wide transition-colors select-none";

  const variants = {
    success: "bg-success-light text-success border border-success/20",
    warning: "bg-warning-light text-amber-700 border border-warning/20",
    danger: "bg-danger-light text-danger border border-danger/20",
    primary: "bg-primary-light text-primary border border-primary/20",
    neutral: "bg-gray-100 text-gray-700 border border-gray-200",
    auto: "bg-gray-100 text-gray-700 border border-gray-200",
  };

  const sizes = {
    sm: "text-[11px] px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
  };

  return (
    <span
      className={twMerge(clsx(baseStyles, variants[resolvedVariant], sizes[size], className))}
      {...props}
    >
      <span
        className={clsx("w-1.5 h-1.5 rounded-full", {
          "bg-success": resolvedVariant === "success",
          "bg-amber-500": resolvedVariant === "warning",
          "bg-danger": resolvedVariant === "danger",
          "bg-primary": resolvedVariant === "primary",
          "bg-gray-400": resolvedVariant === "neutral" || resolvedVariant === "auto",
        })}
      />
      {status || children}
    </span>
  );
};
