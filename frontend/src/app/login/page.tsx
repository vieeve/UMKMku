"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Store, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { clsx } from "clsx";
import { Logo } from "../../components/ui/Logo";
import { useApp } from "../../context/AppContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setError("");
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        router.push("/");
      } else {
        setError("Alamat email atau kata sandi salah.");
      }
    } catch (e) {
      setError("Terjadi kesalahan pada server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7FB] flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fadeIn">
        {/* Brand/Logo */}
        <div className="flex justify-center mb-8">
          <Logo large />
        </div>

        {/* Login Card */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#1E1B39]">Selamat Datang Kembali!</h1>
            <p className="text-sm text-gray-500 mt-2">Masuk untuk mengelola usaha Anda</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
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
              <div className="flex items-center justify-between ml-1">
                <label className="block text-xs font-bold text-gray-500">Kata Sandi</label>
                <Link href="#" className="text-xs font-bold text-primary hover:underline">
                  Lupa Sandi?
                </Link>
              </div>
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

            {error && (
              <div className="bg-danger/10 border border-danger/20 text-danger text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-2">
                {error}
              </div>
            )}

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
                  <span>Masuk ke UMKMku</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <p className="text-center text-sm font-medium text-gray-500 mt-8">
          Belum punya akun?{" "}
          <Link href="/daftar" className="font-bold text-primary hover:underline">
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
