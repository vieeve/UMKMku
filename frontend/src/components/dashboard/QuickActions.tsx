"use client";

import React from "react";
import Link from "next/link";
import {
  ShoppingCart,
  PlusCircle,
  Boxes,
  FileSpreadsheet,
  ArrowRight,
  Zap,
} from "lucide-react";
import { Card } from "../ui/Card";

export const QuickActions: React.FC = () => {
  const actions = [
    {
      title: "Kasir Digital",
      description: "Catat transaksi penjualan kasir langsung di toko",
      href: "/penjualan",
      icon: ShoppingCart,
      bgColor: "bg-[#EDEBFD]",
      textColor: "text-[#6C5CE7]",
      borderColor: "hover:border-[#6C5CE7]/40",
      badge: "Paling Sering",
    },
    {
      title: "Tambah Produk",
      description: "Daftarkan barang baru atau update harga katalog",
      href: "/produk",
      icon: PlusCircle,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      borderColor: "hover:border-blue-400",
    },
    {
      title: "Restock Barang",
      description: "Catat masuknya stok barang dari supplier pengirim",
      href: "/stok",
      icon: Boxes,
      bgColor: "bg-success/15",
      textColor: "text-success",
      borderColor: "hover:border-success/40",
    },
    {
      title: "Unduh Laporan",
      description: "Cetak ringkasan laba rugi & penjualan bulanan",
      href: "/laporan",
      icon: FileSpreadsheet,
      bgColor: "bg-warning/15",
      textColor: "text-amber-600",
      borderColor: "hover:border-warning/40",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-[#1E1B39] flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>Pintasan Aksi Cepat</span>
        </h3>
        <span className="text-xs text-gray-400 font-medium hidden sm:inline">
          Akses fitur penting hanya dengan satu klik
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <Link key={idx} href={action.href}>
              <Card
                hoverable
                className={`p-4.5 bg-white rounded-[20px] border border-gray-100 shadow-sm transition-all duration-200 flex flex-col justify-between h-full group ${action.borderColor}`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs ${action.bgColor} ${action.textColor}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {action.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#6C5CE7]/10 text-[#6C5CE7]">
                        {action.badge}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-[#1E1B39] group-hover:text-primary transition-colors">
                    {action.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 leading-snug">
                    {action.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100/80 text-xs font-semibold text-gray-400 group-hover:text-primary transition-colors">
                  <span>Buka Menu</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
