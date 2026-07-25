"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Store, Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { clsx } from "clsx";
import { Logo } from "../../components/ui/Logo";
import { useApp } from "../../context/AppContext";

export default function DaftarPage() {
  const router = useRouter();
  const { register } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !businessName || !email || !password) return;

    setIsLoading(true);
    setError("");
    const success = await register(name, businessName, email, password);
    setIsLoading(false);

    if (success) {
      router.push("/");
    } else {
      setError("Email sudah digunakan atau terjadi kesalahan server.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7FB] flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md animate-fadeIn">
        {/* Brand/Logo */}
        <div className="flex justify-center mb-8">
          <Logo large />
        </div>

        {/* Register Card */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#1E1B39]">Buat Akun Baru</h1>
            <p className="text-sm text-gray-500 mt-2">Mulai kelola usaha Anda dengan lebih baik</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {error && (
              <div className="bg-danger/10 text-danger p-3 rounded-xl text-sm font-semibold text-center mb-4">
                {error}
              </div>
            )}
            {/* Name Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500 ml-1">Nama Lengkap</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-semibold text-[#1E1B39] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Nama Anda"
                />
              </div>
            </div>

            {/* Business Name Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500 ml-1">Nama Usaha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Store className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-semibold text-[#1E1B39] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Nama Toko/Usaha Anda"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500 ml-1">Alamat Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-semibold text-[#1E1B39] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="email@usaha.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500 ml-1">Kata Sandi</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl pl-12 pr-12 py-3.5 text-sm font-semibold text-[#1E1B39] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={clsx(
                "w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl font-bold text-white shadow-lg transition-all mt-4",
                isLoading
                  ? "bg-primary/70 shadow-none cursor-not-allowed"
                  : "bg-primary hover:bg-primary-hover shadow-primary/25 active:scale-[0.98]"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>Buat Akun Sekarang</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <p className="text-center text-sm font-medium text-gray-500 mt-8">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-bold text-primary hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
