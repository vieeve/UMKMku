"use client";

import React from "react";
import { clsx } from "clsx";
import {
  ArrowDownLeft,
  RefreshCw,
  AlertTriangle,
  ArrowUpRight,
  PlusCircle,
  FileText,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const RightActivityPanel: React.FC<{ className?: string }> = ({ className }) => {
  const { activities } = useApp();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "SALE":
        return (
          <div className="w-9 h-9 rounded-xl bg-[#EDEBFD] text-[#6C5CE7] flex items-center justify-center flex-shrink-0 font-bold transition-transform group-hover:scale-105 shadow-2xs mt-0.5">
            <ArrowDownLeft className="w-4 h-4" />
          </div>
        );
      case "RESTOCK":
        return (
          <div className="w-9 h-9 rounded-xl bg-[#DCFCE7] text-[#22C55E] flex items-center justify-center flex-shrink-0 font-bold transition-transform group-hover:scale-105 shadow-2xs mt-0.5">
            <RefreshCw className="w-4 h-4" />
          </div>
        );
      case "STOCK_ALERT":
        return (
          <div className="w-9 h-9 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center flex-shrink-0 font-bold transition-transform group-hover:scale-105 shadow-2xs mt-0.5">
            <AlertTriangle className="w-4 h-4" />
          </div>
        );
      case "STOCK_EMPTY":
        return (
          <div className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0 font-bold transition-transform group-hover:scale-105 shadow-2xs mt-0.5">
            <AlertTriangle className="w-4 h-4" />
          </div>
        );
      case "EXPENSE":
        return (
          <div className="w-9 h-9 rounded-xl bg-[#FEE2E2] text-[#EF4444] flex items-center justify-center flex-shrink-0 font-bold transition-transform group-hover:scale-105 shadow-2xs mt-0.5">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        );
      case "PRODUCT_ADD":
        return (
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 font-bold transition-transform group-hover:scale-105 shadow-2xs mt-0.5">
            <PlusCircle className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-9 h-9 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 shadow-2xs mt-0.5">
            <FileText className="w-4 h-4" />
          </div>
        );
    }
  };

  const formatAmount = (type: string, amount?: number) => {
    if (type === "SALE" && amount) {
      return <p className="text-xs font-bold text-[#6C5CE7] mt-1.5">+ Rp {amount.toLocaleString("id-ID")}</p>;
    }
    if (type === "RESTOCK") {
      return <p className="text-xs font-bold text-[#22C55E] mt-1.5">Restok +{amount || 15}</p>;
    }
    if (type === "EXPENSE" && amount) {
      return <p className="text-xs font-bold text-[#EF4444] mt-1.5">- Rp {amount.toLocaleString("id-ID")}</p>;
    }
    if (type === "STOCK_ALERT") {
      return <p className="text-xs font-semibold text-amber-600 mt-1.5">Perlu Perhatian</p>;
    }
    if (type === "STOCK_EMPTY") {
      return <p className="text-xs font-semibold text-red-500 mt-1.5">Stok Kosong!</p>;
    }
    return null;
  };

  return (
    <div className={clsx("flex flex-col h-full w-full select-none", className)}>
      <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-200/70 flex-1 flex flex-col min-h-0 h-full justify-between">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between pb-3.5 mb-3.5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <h4 className="text-base font-bold text-[#1E1B39]">
              Aktivitas Terkini
            </h4>
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" title="Real-time update" />
          </div>
          <span className="text-xs font-semibold text-gray-400">
            Hari Ini
          </span>
        </div>

        {/* Activities list */}
        <div className="flex-1 overflow-y-auto min-h-0 space-y-3 pr-1">
          {activities.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl border border-gray-100 hover:border-primary/40 transition-all bg-gray-50/50 hover:bg-white hover:shadow-xs group cursor-pointer flex items-start gap-3"
            >
              {getActivityIcon(item.type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-[#1E1B39] truncate group-hover:text-primary transition-colors">
                    {item.title}
                  </p>
                  <span className="text-[11px] font-medium text-gray-400 flex-shrink-0">
                    {item.time}
                  </span>
                </div>
                <p className="text-[11.5px] text-gray-500 mt-0.5 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
                {formatAmount(item.type, item.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
