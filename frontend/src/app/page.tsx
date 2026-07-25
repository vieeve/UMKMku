"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  TrendingUp,
  Package,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingCart,
  Boxes,
  ChevronRight,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { IncomeOutcomeChart } from "../components/dashboard/IncomeOutcomeChart";
import { RightActivityPanel } from "../components/layout/RightActivityPanel";
import { clsx } from "clsx";

export default function Home() {
  const {
    transactions,
    categories,
    getLowStockProducts,
    getTotalProductsCount,
    getTodaySalesTotal,
    getTodayProfitTotal,
  } = useApp();

  const [timeRange, setTimeRange] = useState<"today" | "weekly" | "monthly">("today");

  const lowStockProducts = getLowStockProducts();
  const totalProducts = getTotalProductsCount();

  const todaySales = getTodaySalesTotal();
  const todayProfit = getTodayProfitTotal();

  const getDisplayMetrics = () => {
    let sales = 0;
    let profit = 0;
    
    const now = new Date();
    
    // Filter transactions based on timeRange
    const filteredTrx = transactions.filter(trx => {
      const trxDate = trx.created_at ? new Date(trx.created_at) : new Date();
      if (timeRange === "today") {
        return trxDate.toDateString() === now.toDateString();
      }
      if (timeRange === "weekly") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        return trxDate >= sevenDaysAgo;
      }
      if (timeRange === "monthly") {
        return trxDate.getMonth() === now.getMonth() && trxDate.getFullYear() === now.getFullYear();
      }
      return true;
    });

    sales = filteredTrx.reduce((sum, trx) => sum + (Number(trx.total_amount) || 0), 0);
    profit = filteredTrx.reduce((sum, trx) => sum + (Number(trx.total_profit) || 0), 0);

    // Calculate previous period for growth
    const prevFilteredTrx = transactions.filter(trx => {
      const trxDate = trx.created_at ? new Date(trx.created_at) : new Date();
      if (timeRange === "today") {
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        return trxDate.toDateString() === yesterday.toDateString();
      }
      if (timeRange === "weekly") {
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);
        const fourteenDaysAgo = new Date(now);
        fourteenDaysAgo.setDate(now.getDate() - 14);
        return trxDate >= fourteenDaysAgo && trxDate < sevenDaysAgo;
      }
      if (timeRange === "monthly") {
        let lastMonth = now.getMonth() - 1;
        let year = now.getFullYear();
        if (lastMonth < 0) {
          lastMonth = 11;
          year--;
        }
        return trxDate.getMonth() === lastMonth && trxDate.getFullYear() === year;
      }
      return false;
    });

    const prevSales = prevFilteredTrx.reduce((sum, trx) => sum + (Number(trx.total_amount) || 0), 0);
    const prevProfit = prevFilteredTrx.reduce((sum, trx) => sum + (Number(trx.total_profit) || 0), 0);

    const calcGrowth = (current: number, previous: number) => {
      if (previous === 0) return "-";
      const growth = ((current - previous) / previous) * 100;
      return `${growth > 0 ? "+" : ""}${growth.toFixed(1)}%`;
    };

    const labels = {
      today: "Hari Ini",
      weekly: "7 Hari Terakhir",
      monthly: "Bulan Ini",
    };

    return {
      sales,
      profit,
      salesGrowth: calcGrowth(sales, prevSales),
      profitGrowth: calcGrowth(profit, prevProfit),
      label: labels[timeRange],
    };
  };

  const metrics = getDisplayMetrics();

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Top Split Container: Left (Banner + KPI Cards + Chart) aligned with Right (Aktivitas Terkini) */}
      <div className="flex flex-col xl:flex-row gap-6 items-stretch">
        {/* Left Column */}
        <div className="flex-1 min-w-0 flex flex-col justify-start space-y-6">
          {/* Header / Welcome Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-gradient-to-r from-[#4F46E5] to-[#6C5CE7] p-6 sm:p-7 rounded-[24px] text-white shadow-card-hover relative overflow-hidden">
            <div className="space-y-2.5 max-w-xl relative">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                Selamat Datang di Dashboard UMKMku
              </h1>
              <p className="text-xs sm:text-sm text-primary-light/90 leading-relaxed">
                Pantau ringkasan penjualan harian, kelola katalog produk, dan cek status stok toko Anda dalam satu tampilan yang bersih, modern, dan mudah dipahami.
              </p>
            </div>
            {/* Removed Buka Penjualan button */}
            {/* Background decorative elements */}
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full pointer-events-none blur-3xl" />
          </div>

          {/* KPI Summary Cards with Time Range Tabs (Placed Above Chart) */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-base font-bold text-[#1E1B39] flex items-center gap-2">
                <span>Ringkasan Performa</span>
                <span className="text-xs font-medium text-gray-400">({metrics.label})</span>
              </h2>

              {/* Time Range Filter Pills */}
              <div className="flex items-center bg-white p-1 rounded-xl border border-gray-100 shadow-2xs self-start sm:self-auto">
                <button
                  onClick={() => setTimeRange("today")}
                  className={clsx(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                    timeRange === "today"
                      ? "bg-[#4F46E5] text-white shadow-xs"
                      : "text-gray-500 hover:text-[#1E1B39]"
                  )}
                >
                  Hari Ini
                </button>
                <button
                  onClick={() => setTimeRange("weekly")}
                  className={clsx(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                    timeRange === "weekly"
                      ? "bg-[#4F46E5] text-white shadow-xs"
                      : "text-gray-500 hover:text-[#1E1B39]"
                  )}
                >
                  7 Hari Terakhir
                </button>
                <button
                  onClick={() => setTimeRange("monthly")}
                  className={clsx(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                    timeRange === "monthly"
                      ? "bg-[#4F46E5] text-white shadow-xs"
                      : "text-gray-500 hover:text-[#1E1B39]"
                  )}
                >
                  Bulan Ini
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {/* Card 1: Total Penjualan */}
              <Card hoverable className="p-4.5 flex flex-col justify-between bg-white rounded-[20px] border border-gray-100/80 shadow-sm transition-all">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-gray-500">Total Penjualan</span>
                  <div className="w-8 h-8 rounded-xl bg-[#EDEBFD] text-[#6C5CE7] flex items-center justify-center flex-shrink-0 shadow-sm">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-lg sm:text-xl font-bold text-[#1E1B39] tracking-tight">
                    Rp {metrics.sales.toLocaleString("id-ID")}
                  </p>
                </div>
              </Card>

              {/* Card 2: Laba Bersih */}
              <Card hoverable className="p-4.5 flex flex-col justify-between bg-white rounded-[20px] border border-gray-100/80 shadow-sm transition-all">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-gray-500">Laba Bersih</span>
                  <div className="w-8 h-8 rounded-xl bg-success/15 text-success flex items-center justify-center flex-shrink-0 shadow-sm">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-lg sm:text-xl font-bold text-[#1E1B39] tracking-tight">
                    Rp {metrics.profit.toLocaleString("id-ID")}
                  </p>
                </div>
              </Card>

              {/* Card 3: Jumlah Produk */}
              <Card hoverable className="p-4.5 flex flex-col justify-between bg-white rounded-[20px] border border-gray-100/80 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-gray-500">Total Produk di Toko</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-lg sm:text-xl font-bold text-[#1E1B39] tracking-tight">{totalProducts} SKU</p>
                </div>
              </Card>

              {/* Card 4: Stok Menipis */}
              <Card hoverable className="p-4.5 flex flex-col justify-between bg-white rounded-[20px] border border-gray-100/80 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-gray-500">Stok Menipis</span>
                  <div className="w-8 h-8 rounded-xl bg-warning/15 text-amber-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-lg sm:text-xl font-bold text-danger tracking-tight">{lowStockProducts.length} Produk</p>
                </div>
              </Card>
            </div>
          </div>

          {/* Income vs Outcome Chart (Placed Below Ringkasan Performa) */}
          <IncomeOutcomeChart />
        </div>

        {/* Right Column: Aktivitas Terkini (stretches to match left column height) */}
        <div className="w-full xl:w-[360px] flex-shrink-0 flex flex-col">
          <RightActivityPanel />
        </div>
      </div>

      {/* Symmetrical Bottom Showcase: Transaksi Terbaru & Perhatian Stok aligned exactly */}
      <div className="flex flex-col xl:flex-row gap-6 items-stretch w-full">
        {/* Left Column: Transaksi Terbaru */}
        <div className="flex-1 min-w-0 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#1E1B39]">Transaksi Terbaru Hari Ini</h2>
            <Link href="/laporan" className="text-[11px] font-bold text-primary bg-primary/10 hover:bg-primary/20 transition-colors px-3 py-1.5 rounded-lg flex items-center gap-1">
              <span>Lihat Semua</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Card padding="none" className="overflow-hidden bg-white rounded-[24px] border border-gray-100/80 shadow-sm flex-1 flex flex-col justify-between">
            <div className="overflow-x-auto flex-1 flex flex-col justify-between">
              <table className="w-full text-left border-collapse flex-1">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    <th className="py-3.5 px-5">Waktu</th>
                    <th className="py-3.5 px-5">ID Transaksi</th>
                    <th className="py-3.5 px-5">Metode</th>
                    <th className="py-3.5 px-5 text-right">Total Bayar</th>
                    <th className="py-3.5 px-5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/80 text-sm">
                  {transactions.slice(0, 5).map((trx) => (
                    <tr key={trx.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-5 font-semibold text-[#1E1B39]">
                        {trx.created_at ? new Date(trx.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : ""} WIB
                      </td>
                      <td className="py-4 px-5 text-gray-400 font-mono text-xs">{trx.invoice_no || trx.id}</td>
                      <td className="py-4 px-5">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-[#1E1B39]">
                          {trx.payment_method}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right font-bold text-[#1E1B39]">
                        Rp {trx.total_amount.toLocaleString("id-ID")}
                      </td>
                      <td className="py-4 px-5 text-center">
                        <Badge status={trx.status} size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Column: Perhatian Stok (Matches w-[360px] width of Aktivitas Terkini) */}
        <div className="w-full xl:w-[360px] flex-shrink-0 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#1E1B39]">Perhatian Stok</h2>
            <Link href="/produk" className="text-[11px] font-bold text-primary bg-primary/10 hover:bg-primary/20 transition-colors px-3 py-1.5 rounded-lg flex items-center gap-1">
              <span>Kelola Stok</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Card className="p-5 bg-white rounded-[24px] border border-gray-100/80 shadow-sm flex-1 flex flex-col justify-start space-y-4">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-warning-light/40 border border-warning/30 flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-[#1E1B39]">Peringatan Stok Menipis</p>
                <p className="text-[11px] text-gray-500 leading-snug">
                  Terdapat {lowStockProducts.length} barang di bawah batas minimum yang ditentukan.
                </p>
              </div>
            </div>

            <div className="space-y-2.5 flex-1">
              {lowStockProducts.slice(0, 4).map((prod) => (
                <div
                  key={prod.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-primary/40 transition-colors bg-gray-50/40"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="text-xs font-bold text-[#1E1B39] truncate">{prod.name}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Sisa: <span className="font-bold text-danger">{prod.stock} {prod.unit}</span> (Min: {prod.min_stock})
                    </p>
                  </div>
                  <Badge status={prod.status} size="sm" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
