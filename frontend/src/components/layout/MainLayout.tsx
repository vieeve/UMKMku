"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";
import {
  Home,
  Package,
  ShoppingCart,
  Boxes,
  FileText,
  Settings,
  Store,
  X,
  LogOut,
} from "lucide-react";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { Logo } from "../ui/Logo";
import { useApp } from "../../context/AppContext";

const mobileMenuItems = [
  { label: "Dashboard", href: "/", icon: Home },
  { label: "Produk & Stok", href: "/produk", icon: Package },
  { label: "Penjualan", href: "/penjualan", icon: ShoppingCart },
  { label: "Laporan", href: "/laporan", icon: FileText },
  { label: "Pengaturan", href: "/pengaturan", icon: Settings },
  { label: "Keluar", href: "/login", icon: LogOut },
];

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isInitializing, logout } = useApp();

  const isAuthPage = pathname === "/login" || pathname === "/daftar";

  useEffect(() => {
    if (!isInitializing && !isAuthenticated && !isAuthPage) {
      router.push("/login");
    }
  }, [isInitializing, isAuthenticated, isAuthPage, router]);

  if (isInitializing) {
    return null; // Or a simple loading spinner
  }

  if (!isAuthenticated && !isAuthPage) {
    return null;
  }

  if (isAuthPage) {
    return <main className="min-h-screen bg-[#F7F7FB]">{children}</main>;
  }

  return (
    <div className="flex min-h-screen text-text-primary antialiased">
      {/* Desktop Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-fadeIn">
          <div
            className="fixed inset-0 bg-text-primary/40 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="relative w-72 bg-white/70 backdrop-blur-2xl h-full flex flex-col p-6 shadow-2xl z-10 animate-slideRight border-r border-white/60">
            <div className="flex items-center justify-between pb-6 border-b border-border/60">
              <Link href="/" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
                <Logo />
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-text-secondary hover:text-text-primary rounded-xl hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 py-6 space-y-2 overflow-y-auto">
              <p className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-2 px-3">
                Menu Navigasi
              </p>
              {mobileMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));

                if (item.label === "Keluar") {
                  return (
                    <button
                      key={item.href}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        logout();
                      }}
                      className={clsx(
                        "w-full flex items-center justify-start text-left gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all group",
                        "text-danger hover:text-danger hover:bg-red-50"
                      )}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 text-danger" />
                      <span>{item.label}</span>
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={clsx(
                      "flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all group",
                      isActive
                        ? "bg-primary text-white shadow-md shadow-primary/20"
                        : "text-text-secondary hover:text-text-primary hover:bg-gray-100/80"
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </aside>
        </div>
      )}

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto relative z-0">{children}</main>
      </div>
    </div>
  );
};
