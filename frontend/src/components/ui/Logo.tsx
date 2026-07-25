import React from "react";
import { clsx } from "clsx";

interface LogoProps {
  className?: string;
  showText?: boolean;
  large?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className, showText = true, large = false }) => {
  return (
    <div className={clsx("flex items-center gap-1", className)}>
      <svg
        width={large ? "44" : "32"}
        height={large ? "44" : "32"}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 drop-shadow-sm"
      >
        <path
          d="M 8 10 V 22 C 8 27.5 12.5 32 18 32 C 23.5 32 28 27.5 28 22 V 6"
          stroke="url(#logo_gradient)"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 20 14 L 28 6 L 36 14"
          stroke="url(#logo_gradient)"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient
            id="logo_gradient"
            x1="8"
            y1="6"
            x2="36"
            y2="32"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#4F46E5" />
            <stop offset="1" stopColor="#6C5CE7" />
          </linearGradient>
        </defs>
      </svg>
      {showText && (
        <span className={clsx("font-extrabold tracking-tight text-[#1E1B39] ml-1", large ? "text-[32px]" : "text-[22px]")}>
          MKM<span className="text-[#4F46E5]">ku</span>
        </span>
      )}
    </div>
  );
};
