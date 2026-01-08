import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showSubtext?: boolean;
  variant?: "light" | "dark";
}

export function Logo({ className, showSubtext = true, variant = "dark" }: LogoProps) {
  // Colors
  const primary = "#3b82f6"; // blue-500
  const text = variant === "dark" ? "#111827" : "#FFFFFF";
  
  return (
    <div className={cn("flex items-center gap-2 select-none", className)}>
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 md:w-10 md:h-10 shrink-0"
        aria-label="RentExpress Logo"
      >
        <rect x="8" y="14" width="32" height="28" rx="2" stroke={text} strokeWidth="3" />
        <path d="M24 14V8L32 8" stroke={primary} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 8L24 2" stroke={primary} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 14L24 2L44 14" stroke={text} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="20" y="26" width="8" height="16" fill={primary} fillOpacity="0.2" stroke={primary} strokeWidth="2" />
        <path d="M14 22H18" stroke={text} strokeWidth="2" strokeLinecap="round" />
        <path d="M30 22H34" stroke={text} strokeWidth="2" strokeLinecap="round" />
      </svg>
      <div className="flex flex-col">
        <span className={cn("font-heading font-bold leading-none tracking-tight text-xl md:text-2xl", variant === "dark" ? "text-gray-900" : "text-white")}>
          Rent<span className="text-blue-500">Express</span>
        </span>
        {showSubtext && (
          <span className={cn("text-[0.6rem] md:text-[0.65rem] font-medium tracking-widest uppercase opacity-70 leading-none mt-1", variant === "dark" ? "text-gray-600" : "text-blue-100")}>
            Rental Management
          </span>
        )}
      </div>
    </div>
  );
}
