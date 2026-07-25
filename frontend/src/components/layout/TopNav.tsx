"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Bell, Menu, AlertTriangle, CheckCircle2, Settings, ChevronDown } from "lucide-react";
import { useApp } from "../../context/AppContext";

export interface TopNavProps {
  onOpenMobileMenu?: () => void;
  onToggleRightPanel?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onOpenMobileMenu }) => {
  const { searchQuery, setSearchQuery, userProfile } = useApp();

  return (
    <header className="h-20 bg-white/60 backdrop-blur-xl border-b border-white/60 px-4 sm:px-8 flex items-center justify-between gap-4 relative z-50">
      {/* Left side: Mobile Menu + Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-none xl:max-w-[calc(100%-384px)]">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface transition-colors shadow-sm bg-white"
          aria-label="Buka Menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Removed Search Bar */}
      </div>

      {/* Right side: Notifications, Settings & Profile Pill */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 relative">
        {/* Notifications removed */}

        {/* Profile Card Pill */}
        <Link
          href="/pengaturan"
          className="flex items-center justify-between gap-3 min-w-[210px] sm:min-w-[240px] xl:w-[360px] pl-2 pr-4 py-2 rounded-full bg-white border border-border/80 shadow-sm hover:bg-gray-50 transition-all group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#4F46E5] to-[#6C5CE7] text-white font-bold text-sm flex items-center justify-center shadow-inner flex-shrink-0 group-hover:scale-105 transition-transform">
              {userProfile.ownerName.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="hidden sm:block text-left min-w-0">
              <p className="text-[13.5px] font-bold text-[#1E1B39] tracking-tight leading-none truncate">
                {userProfile.ownerName}
              </p>
              <p className="text-[11.5px] font-medium text-gray-400 leading-none mt-1.5 truncate max-w-[140px] xl:max-w-[220px]">
                {userProfile.businessName}
              </p>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 group-hover:text-gray-600 transition-colors hidden sm:block" />
        </Link>
      </div>
    </header>
  );
};
