"use client";

import React, { useState, useMemo } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  Download, 
  DollarSign, 
  Receipt,
  Wallet,
  Calendar,
  ChevronDown
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { clsx } from "clsx";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart
} from "recharts";

const CustomPenjualanTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const revenue = payload[0]?.value || 0;
    return (
      <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100 min-w-[200px]">
        <p className="text-xs font-bold text-gray-500 mb-2 border-b border-gray-100 pb-1.5 flex items-center justify-between">
          <span>{label}</span>
          <span className="text-[10px] font-semibold px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">Periode</span>
        </p>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 font-medium text-gray-600">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4F46E5]" />
              Penjualan
            </span>
            <span className="font-bold text-[#1E1B39]">
              Rp {revenue.toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const CustomLabaRugiTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const revenue = payload.find((p: any) => p.dataKey === "revenue")?.value || 0;
    const cogs = payload.find((p: any) => p.dataKey === "cogs")?.value || 0;
    const profit = revenue - cogs;

    return (
      <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100 min-w-[200px]">
        <p className="text-xs font-bold text-gray-500 mb-2 border-b border-gray-100 pb-1.5 flex items-center justify-between">
          <span>{label}</span>
          <span className="text-[10px] font-semibold px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">Periode</span>
        </p>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 font-medium text-gray-600">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4F46E5]" />
              Pendapatan
            </span>
            <span className="font-bold text-[#1E1B39]">
              Rp {revenue.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 font-medium text-gray-600">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
              Modal (HPP)
            </span>
            <span className="font-bold text-[#1E1B39]">
              Rp {cogs.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="pt-1.5 mt-1 border-t border-gray-100 flex items-center justify-between gap-4">
            <span className="font-semibold text-gray-500">Laba Bersih</span>
            <span className={clsx("font-extrabold", profit >= 0 ? "text-success" : "text-danger")}>
              {profit >= 0 ? "+" : ""} Rp {profit.toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function LaporanPage() {
  const { transactions } = useApp();
  const [activeTab, setActiveTab] = useState<"penjualan" | "labarugi">("penjualan");

  // Format date helper (e.g. "2023-10-25" -> "25 Okt")
  const formatShortDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  };

  // Group transactions by date
  const chartData = useMemo(() => {
    const grouped: Record<string, { dateStr: string; label: string; revenue: number; profit: number; cogs: number; count: number }> = {};
    
    transactions.forEach((trx) => {
      // Assuming trx.created_at is ISO string
      const d = trx.created_at ? trx.created_at.split("T")[0] : new Date().toISOString().split("T")[0];
      if (!grouped[d]) {
        grouped[d] = {
          dateStr: d,
          label: formatShortDate(d),
          revenue: 0,
          profit: 0,
          cogs: 0,
          count: 0
        };
      }
      const amount = Number(trx.total_amount) || 0;
      const profit = Number(trx.total_profit) || 0;
      grouped[d].revenue += amount;
      grouped[d].profit += profit;
      grouped[d].cogs += (amount - profit);
      grouped[d].count += 1;
    });

    return Object.values(grouped).sort((a, b) => a.dateStr.localeCompare(b.dateStr)).slice(-7);
  }, [transactions]);

  // Overall Totals
  const totals = useMemo(() => {
    return transactions.reduce(
      (acc, trx) => {
        const amount = Number(trx.total_amount) || 0;
        const profit = Number(trx.total_profit) || 0;
        acc.revenue += amount;
        acc.profit += profit;
        acc.cogs += (amount - profit);
        acc.count += 1;
        return acc;
      },
      { revenue: 0, profit: 0, cogs: 0, count: 0 }
    );
  }, [transactions]);

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 print:bg-white print:p-0 print:space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1E1B39]">Laporan Keuangan</h1>
          <p className="text-sm text-gray-400 mt-1 print:hidden">
            Pantau ringkasan penjualan, riwayat transaksi, dan kalkulasi laba rugi usaha Anda.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto print:hidden">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 bg-white border border-gray-200 text-[#1E1B39] text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-gray-100 print:hidden">
        <button
          onClick={() => setActiveTab("penjualan")}
          className={clsx(
            "px-6 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2",
            activeTab === "penjualan" ? "border-primary text-primary" : "border-transparent text-gray-400 hover:text-[#1E1B39]"
          )}
        >
          <Receipt className="w-4 h-4" />
          Laporan Penjualan
        </button>
        <button
          onClick={() => setActiveTab("labarugi")}
          className={clsx(
            "px-6 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2",
            activeTab === "labarugi" ? "border-primary text-primary" : "border-transparent text-gray-400 hover:text-[#1E1B39]"
          )}
        >
          <Wallet className="w-4 h-4" />
          Laba Rugi
        </button>
      </div>

      <div className="print:block">
        {activeTab === "penjualan" ? (
          <div className="space-y-6">
            {/* Penjualan Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center justify-between print:border-gray-300">
                <div>
                  <p className="text-sm font-semibold text-gray-400">Total Penjualan</p>
                  <p className="text-xl sm:text-2xl font-bold text-[#1E1B39] mt-1.5 tracking-tight">
                    Rp {totals.revenue.toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <DollarSign className="w-7 h-7" />
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center justify-between print:border-gray-300">
                <div>
                  <p className="text-sm font-semibold text-gray-400">Jumlah Transaksi</p>
                  <p className="text-xl sm:text-2xl font-bold text-[#1E1B39] mt-1.5 tracking-tight">
                    {totals.count} <span className="text-sm text-gray-400 font-medium">trx</span>
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-success-light/50 text-success flex items-center justify-center">
                  <Receipt className="w-7 h-7" />
                </div>
              </div>
            </div>

            {/* Line Chart Penjualan */}
            <Card className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm print:shadow-none print:border-gray-300">
              <h3 className="text-base font-bold text-[#1E1B39] mb-6">Tren Penjualan (7 Hari Terakhir)</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 25, left: -5, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} width={80} tick={{ fontSize: 11, fill: "#94A3B8" }} tickFormatter={(value) => {
                      if (value >= 1000000) return `Rp ${(value / 1000000).toFixed(1).replace(".", ",")} jt`;
                      if (value >= 1000) return `Rp ${value / 1000} rb`;
                      return `Rp ${value}`;
                    }} />
                    <Tooltip content={<CustomPenjualanTooltip />} />
                    <Area type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Tabel Riwayat Transaksi */}
            <Card padding="none" className="overflow-hidden bg-white rounded-[24px] border border-gray-100 shadow-sm print:shadow-none print:border-gray-300">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-base font-bold text-[#1E1B39]">Riwayat Transaksi</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/70 text-[11px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100">
                      <th className="py-4 px-5">Waktu</th>
                      <th className="py-4 px-5">No. Trx</th>
                      <th className="py-4 px-5 text-right">Total Transaksi</th>
                      <th className="py-4 px-5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-55 text-sm">
                    {transactions.slice(0).reverse().map((trx) => (
                      <tr key={trx.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-5">
                          <p className="font-bold text-[#1E1B39] text-xs">{formatShortDate(trx.created_at || "")}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{trx.created_at ? new Date(trx.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : ""} WIB</p>
                        </td>
                        <td className="py-4 px-5">
                          <span className="font-mono text-xs font-semibold text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">{trx.invoice_no || trx.id}</span>
                        </td>
                        <td className="py-4 px-5 text-right font-bold text-[#1E1B39]">
                          Rp {trx.total_amount.toLocaleString("id-ID")}
                        </td>
                        <td className="py-4 px-5 text-center">
                          <span className={clsx(
                            "inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-lg border",
                            trx.status === "Selesai" ? "bg-success-light/30 text-success border-success/20" :
                            trx.status === "Batal" ? "bg-danger-light/30 text-danger border-danger/20" :
                            "bg-warning-light/30 text-warning border-warning/20"
                          )}>
                            {trx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {transactions.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-sm font-medium text-gray-400">
                          Belum ada data transaksi
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Laba Rugi Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm print:border-gray-300">
                <p className="text-sm font-semibold text-gray-400">Pendapatan Kotor</p>
                <p className="text-xl sm:text-2xl font-bold text-[#1E1B39] mt-1.5 tracking-tight">
                  Rp {totals.revenue.toLocaleString("id-ID")}
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm print:border-gray-300">
                <p className="text-sm font-semibold text-gray-400">Total Modal (HPP)</p>
                <p className="text-xl sm:text-2xl font-bold text-amber-600 mt-1.5 tracking-tight">
                  Rp {totals.cogs.toLocaleString("id-ID")}
                </p>
              </div>
              <div className="bg-primary rounded-2xl p-5 shadow-md text-white print:border print:border-gray-300 print:text-[#1E1B39] print:bg-white print:shadow-none">
                <p className="text-sm font-semibold text-white/80 print:text-gray-400">Laba Bersih</p>
                <p className="text-xl sm:text-2xl font-bold mt-1.5 tracking-tight">
                  Rp {totals.profit.toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            {/* Bar Chart Laba Rugi */}
            <Card className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm print:shadow-none print:border-gray-300">
              <h3 className="text-base font-bold text-[#1E1B39] mb-6">Grafik Pendapatan vs Pengeluaran Modal</h3>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 25, left: -5, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} width={80} tick={{ fontSize: 11, fill: "#94A3B8" }} tickFormatter={(value) => {
                      if (value >= 1000000) return `Rp ${(value / 1000000).toFixed(1).replace(".", ",")} jt`;
                      if (value >= 1000) return `Rp ${value / 1000} rb`;
                      return `Rp ${value}`;
                    }} />
                    <Tooltip content={<CustomLabaRugiTooltip />} cursor={{ fill: '#f9fafb' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 600, paddingTop: '16px' }} />
                    <Bar dataKey="revenue" name="Pendapatan" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={32} />
                    <Bar dataKey="cogs" name="Modal" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Print-only footer */}
      <div className="hidden print:block mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
        <p>Laporan Keuangan dihasilkan secara otomatis oleh UMKMku.</p>
        <p className="mt-1">Dicetak pada {new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>
    </div>
  );
}
