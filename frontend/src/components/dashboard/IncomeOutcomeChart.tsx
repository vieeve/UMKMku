"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Card } from "../ui/Card";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Calendar } from "lucide-react";
import { clsx } from "clsx";
import { useApp } from "../../context/AppContext";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const income = payload[0]?.value || 0;
    const outcome = payload[1]?.value || 0;
    const profit = income - outcome;

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
              Pemasukan
            </span>
            <span className="font-bold text-[#1E1B39]">
              Rp {income.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 font-medium text-gray-600">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
              Pengeluaran
            </span>
            <span className="font-bold text-[#1E1B39]">
              Rp {outcome.toLocaleString("id-ID")}
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

export const IncomeOutcomeChart: React.FC = () => {
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");
  const { transactions } = useApp();

  const data = React.useMemo(() => {
    const now = new Date();
    
    if (period === "weekly") {
      const result = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        const dayStr = d.toLocaleDateString('id-ID', { weekday: 'short' });
        
        const dayTrx = transactions.filter(trx => {
          const tDate = trx.created_at ? new Date(trx.created_at) : new Date();
          return tDate.toDateString() === d.toDateString();
        });
        
        const income = dayTrx.reduce((sum, trx) => sum + (Number(trx.total_amount) || 0), 0);
        const profit = dayTrx.reduce((sum, trx) => sum + (Number(trx.total_profit) || 0), 0);
        const outcome = income - profit;
        
        result.push({ name: dayStr, income, outcome });
      }
      return result;
    } else {
      const result = [];
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      const monthTrx = transactions.filter(trx => {
        const tDate = trx.created_at ? new Date(trx.created_at) : new Date();
        return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
      });

      for (let i = 1; i <= 4; i++) {
        const weekTrx = monthTrx.filter(trx => {
          const d = trx.created_at ? new Date(trx.created_at) : new Date();
          const dayOfMonth = d.getDate();
          if (i === 1) return dayOfMonth >= 1 && dayOfMonth <= 7;
          if (i === 2) return dayOfMonth >= 8 && dayOfMonth <= 14;
          if (i === 3) return dayOfMonth >= 15 && dayOfMonth <= 21;
          return dayOfMonth >= 22;
        });

        const income = weekTrx.reduce((sum, trx) => sum + (Number(trx.total_amount) || 0), 0);
        const profit = weekTrx.reduce((sum, trx) => sum + (Number(trx.total_profit) || 0), 0);
        const outcome = income - profit;

        result.push({ name: `Minggu ${i}`, income, outcome });
      }
      return result;
    }
  }, [transactions, period]);

  const totalIncome = data.reduce((acc, curr) => acc + curr.income, 0);
  const totalOutcome = data.reduce((acc, curr) => acc + curr.outcome, 0);
  const totalProfit = totalIncome - totalOutcome;

  return (
    <Card className="p-6 bg-white rounded-[24px] border border-gray-100/80 shadow-sm space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#EDEBFD] text-[#6C5CE7] flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[#1E1B39]">
              Arus Kas & Analitik Keuangan
            </h3>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Pantau tren perbandingan total pemasukan dan pengeluaran operasional toko
          </p>
        </div>

        {/* Period Toggle Tabs */}
        <div className="flex items-center bg-gray-100/80 p-1 rounded-xl self-start sm:self-auto border border-gray-200/50">
          <button
            onClick={() => setPeriod("weekly")}
            className={clsx(
              "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
              period === "weekly"
                ? "bg-white text-[#4F46E5] shadow-xs"
                : "text-gray-500 hover:text-[#1E1B39]"
            )}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>7 Hari Terakhir</span>
          </button>
          <button
            onClick={() => setPeriod("monthly")}
            className={clsx(
              "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
              period === "monthly"
                ? "bg-white text-[#4F46E5] shadow-xs"
                : "text-gray-500 hover:text-[#1E1B39]"
            )}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Bulan Ini</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Pills above Chart */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="p-3.5 rounded-2xl bg-gray-50/60 border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-400">Total Pemasukan</p>
            <p className="text-lg sm:text-xl font-bold text-[#1E1B39] tracking-tight mt-1">
              Rp {totalIncome.toLocaleString("id-ID")}
            </p>
          </div>
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-gray-50/60 border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-400">Total Pengeluaran</p>
            <p className="text-lg sm:text-xl font-bold text-[#1E1B39] tracking-tight mt-1">
              Rp {totalOutcome.toLocaleString("id-ID")}
            </p>
          </div>
          <div className="w-8 h-8 rounded-xl bg-danger/10 text-danger flex items-center justify-center font-bold text-xs">
            <ArrowDownRight className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-success">Surplus Laba Bersih</p>
            <p className="text-lg sm:text-xl font-bold text-success tracking-tight mt-1">
              Rp {totalProfit.toLocaleString("id-ID")}
            </p>
          </div>
          <span className="text-[11px] font-bold px-2 py-1 rounded-lg bg-success text-white shadow-xs">
            +{Math.round((totalProfit / totalIncome) * 100 || 0)}% Margin
          </span>
        </div>
      </div>

      {/* Recharts Area Chart Container */}
      <div className="h-72 sm:h-80 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 25, left: -5, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorOutcome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#64748B", fontWeight: 600 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              width={80}
              tick={{ fontSize: 11, fill: "#94A3B8" }}
              tickFormatter={(value) => {
                if (value >= 1000000) {
                  return `Rp ${(value / 1000000).toFixed(1).replace(".", ",")} jt`;
                }
                if (value >= 1000) {
                  return `Rp ${value / 1000} rb`;
                }
                return `Rp ${value}`;
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="income"
              name="Pemasukan"
              stroke="#4F46E5"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorIncome)"
            />
            <Area
              type="monotone"
              dataKey="outcome"
              name="Pengeluaran"
              stroke="#EF4444"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorOutcome)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
