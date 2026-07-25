"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { useApp } from "../../context/AppContext";
import { Logo } from "../ui/Logo";
import {
  Home,
  Package,
  ShoppingCart,
  Boxes,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Store,
  LogOut,
} from "lucide-react";

export interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const menuItems = [
  { label: "Dashboard", href: "/", icon: Home },
  { label: "Produk & Stok", href: "/produk", icon: Package },
  { label: "Penjualan", href: "/penjualan", icon: ShoppingCart },
  { label: "Laporan", href: "/laporan", icon: FileText },
];

const bottomItems = [
  { label: "Pengaturan", href: "/pengaturan", icon: Settings },
  { label: "Keluar", href: "/login", icon: LogOut },
];

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggleCollapse }) => {
  const pathname = usePathname();
  const { logout } = useApp();

  return (
    <aside
      className={clsx(
        "hidden md:flex flex-col bg-white/60 backdrop-blur-xl border-r border-white/60 transition-all duration-300 ease-in-out select-none relative z-20 shadow-soft min-h-screen",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo Area */}
      <div className="flex items-center justify-between h-20 px-5 border-none">
        <Link href="/" className="flex items-center gap-3.5 overflow-hidden">
          <Logo showText={!isCollapsed} />
        </Link>
      </div>

      {/* Menu Area */}
      <div className="flex-1 py-6 px-3 flex flex-col justify-between space-y-6 overflow-y-auto">
        <div className="space-y-1.5">
          {!isCollapsed && (
            <p className="px-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-2">
              Menu Utama
            </p>
          )}
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                className={clsx(
                  "flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-sm font-medium transition-all duration-200 group relative",
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-text-secondary hover:text-text-primary hover:bg-gray-100/80"
                )}
              >
                <Icon
                  className={clsx(
                    "w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110",
                    isActive ? "text-white" : "text-text-secondary group-hover:text-primary"
                  )}
                />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
                {isActive && isCollapsed && (
                  <span className="absolute right-0 w-1.5 h-6 bg-white rounded-l-full" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom Menu */}
        <div className="space-y-1.5 pt-4 border-t border-border/60">
          {!isCollapsed && (
            <p className="px-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-2">
              Sistem
            </p>
          )}
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            if (item.label === "Keluar") {
              return (
                <button
                  key={item.href}
                  onClick={logout}
                  title={isCollapsed ? item.label : undefined}
                  className={clsx(
                    "w-full flex items-center justify-start gap-3.5 px-3.5 py-3 rounded-2xl text-sm font-medium transition-all duration-200 group text-danger hover:text-danger hover:bg-red-50"
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 text-danger" />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                className={clsx(
                  "flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-sm font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-primary text-white shadow-md"
                    : "text-text-secondary hover:text-text-primary hover:bg-gray-100/80"
                )}
              >
                <Icon
                  className={clsx(
                    "w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110",
                    isActive 
                      ? "text-white" 
                      : "text-text-secondary group-hover:text-primary"
                  )}
                />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}

          {/* Toggle Button */}
          <button
            onClick={onToggleCollapse}
            className="w-full flex items-center justify-center sm:justify-start gap-3.5 px-3.5 py-3 rounded-2xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-gray-100/80 transition-all duration-200"
            title={isCollapsed ? "Perluas Sidebar" : "Lipat Sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 flex-shrink-0 mx-auto sm:mx-0" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5 flex-shrink-0" />
                <span>Lipat Sidebar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};
