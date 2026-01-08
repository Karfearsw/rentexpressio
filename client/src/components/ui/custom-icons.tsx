import React from "react";
import { cn } from "@/lib/utils";

interface IconProps {
  className?: string;
}

// Gold color constant to match the descriptions
const GOLD = "#C1A673";
const BLACK = "#000000";
const WHITE = "#FFFFFF";

export function ScreeningIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-full h-full", className)}
      aria-label="Tenant Screening"
    >
      {/* Gold rounded-square app icon background */}
      <rect width="100" height="100" rx="20" fill={GOLD} />
      
      {/* White document shape (black outline, folded corner) */}
      <path d="M25 20 H65 L80 35 V85 H25 V20 Z" fill={WHITE} stroke={BLACK} strokeWidth="3" />
      <path d="M65 20 V35 H80" fill="none" stroke={BLACK} strokeWidth="3" />
      
      {/* Document lines */}
      <path d="M35 35 H55" stroke={BLACK} strokeWidth="3" strokeLinecap="round" />
      <path d="M35 45 H55" stroke={BLACK} strokeWidth="3" strokeLinecap="round" />
      
      {/* Generic user silhouette */}
      <circle cx="52.5" cy="55" r="8" fill="#555" stroke={BLACK} strokeWidth="2" />
      <path d="M37.5 80 C37.5 70 42.5 65 52.5 65 C62.5 65 67.5 70 67.5 80" fill="#555" stroke={BLACK} strokeWidth="2" />
      
      {/* Gold shield with white checkmark at bottom-right */}
      <path d="M65 65 H85 V75 C85 85 75 90 75 90 C75 90 65 85 65 75 V65 Z" fill={GOLD} stroke={BLACK} strokeWidth="2" />
      <path d="M70 75 L73 78 L80 70" stroke={WHITE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AutoPayIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-full h-full", className)}
      aria-label="Auto Payments"
    >
      {/* Gold background with subtle checker texture */}
      <rect width="100" height="100" rx="0" fill={GOLD} />
      <pattern id="checker" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <rect width="10" height="10" fill="#B09562" />
        <rect x="10" y="10" width="10" height="10" fill="#B09562" />
      </pattern>
      <rect width="100" height="100" fill="url(#checker)" fillOpacity="0.2" />
      
      {/* White house-shaped document */}
      <path d="M20 35 L50 15 L80 35 V85 H20 V35 Z" fill={WHITE} stroke={BLACK} strokeWidth="3" />
      
      {/* Folded corner logic simplified for house shape (top right of rect part) */}
      <path d="M65 35 V50 H80" fill="none" stroke={BLACK} strokeWidth="0" /> 
      
      {/* Horizontal lines text */}
      <path d="M35 50 H65" stroke={BLACK} strokeWidth="3" strokeLinecap="round" />
      <path d="M35 60 H65" stroke={BLACK} strokeWidth="3" strokeLinecap="round" />
      <path d="M35 70 H50" stroke={BLACK} strokeWidth="3" strokeLinecap="round" />

      {/* Gold credit card with white checkmark */}
      <rect x="55" y="65" width="35" height="22" rx="2" fill={GOLD} stroke={BLACK} strokeWidth="2" />
      <rect x="55" y="70" width="35" height="4" fill={BLACK} />
      <path d="M78 80 L81 83 L86 77" stroke={WHITE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Circular black arrows indicating recurring */}
      <path d="M75 50 A 10 10 0 0 1 85 60" stroke={BLACK} strokeWidth="3" strokeLinecap="round" fill="none" markerEnd="url(#arrowhead)" />
      <path d="M25 60 A 10 10 0 0 1 35 50" stroke={BLACK} strokeWidth="3" strokeLinecap="round" fill="none" markerEnd="url(#arrowhead)" />
      
      <defs>
        <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
          <polygon points="0 0, 6 2, 0 4" fill={BLACK} />
        </marker>
      </defs>
    </svg>
  );
}

export function ListingIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-full h-full", className)}
      aria-label="Syndicated Listings"
    >
      <defs>
        <pattern id="darkChecker" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill="#2A2A2A" />
          <rect x="10" y="0" width="10" height="10" fill="#1F1F1F" />
          <rect x="0" y="10" width="10" height="10" fill="#1F1F1F" />
          <rect x="10" y="10" width="10" height="10" fill="#2A2A2A" />
        </pattern>
        <marker id="goldArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0 0 L6 3 L0 6 Z" fill={GOLD} />
        </marker>
        <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
          <feOffset dx="1" dy="2" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Dark rounded background */}
      <rect width="100" height="100" rx="20" fill="url(#darkChecker)" stroke="#000" strokeWidth="2" />
      
      {/* Main Listing Card (Left) */}
      <g filter="url(#dropShadow)">
        <rect x="15" y="20" width="35" height="50" rx="2" fill={WHITE} stroke={BLACK} strokeWidth="2" />
        
        {/* Thumbnail: Gold with Sun & Mountain */}
        <rect x="19" y="24" width="27" height="20" fill={GOLD} stroke={BLACK} strokeWidth="1" />
        <circle cx="38" cy="30" r="2.5" fill={WHITE} />
        <path d="M19 44 L26 36 L32 42 L36 38 L46 44 H19 Z" fill={WHITE} opacity="0.6" />
        
        {/* Text Lines */}
        <rect x="19" y="48" width="27" height="3" rx="1.5" fill={BLACK} />
        <rect x="19" y="54" width="20" height="3" rx="1.5" fill={BLACK} />
        <rect x="19" y="60" width="15" height="3" rx="1.5" fill={BLACK} />
      </g>

      {/* Distribution Arrows & Targets (Right) */}
      <g transform="translate(58, 25)">
        {/* Target 1 (Top) */}
        <path d="M-5 15 C 5 15, 5 5, 15 5" stroke={GOLD} strokeWidth="3" fill="none" markerEnd="url(#goldArrow)" />
        <rect x="18" y="0" width="12" height="12" rx="3" fill={GOLD} stroke={WHITE} strokeWidth="1.5" />
        
        {/* Target 2 (Middle) */}
        <path d="M-5 22 H 15" stroke={GOLD} strokeWidth="3" fill="none" markerEnd="url(#goldArrow)" />
        <rect x="18" y="16" width="12" height="12" rx="3" fill={GOLD} stroke={WHITE} strokeWidth="1.5" />
        
        {/* Target 3 (Bottom) */}
        <path d="M-5 30 C 5 30, 5 40, 15 40" stroke={GOLD} strokeWidth="3" fill="none" markerEnd="url(#goldArrow)" />
        <rect x="18" y="32" width="12" height="12" rx="3" fill={GOLD} stroke={WHITE} strokeWidth="1.5" />
      </g>
      
      {/* Cursor (Overlapping Card) */}
      <path d="M40 65 L46 80 L50 76 L55 84 L58 82 L53 74 L58 72 Z" fill={BLACK} stroke={WHITE} strokeWidth="1.5" filter="url(#dropShadow)" />
    </svg>
  );
}
