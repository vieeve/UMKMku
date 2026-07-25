import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "../context/AppContext";
import { MainLayout } from "../components/layout/MainLayout";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "UMKMku — Platform Manajemen Bisnis untuk Pelaku UMKM",
  description: "Aplikasi pencatatan transaksi penjualan, manajemen stok, dan laporan keuangan digital yang mudah digunakan untuk warung dan toko kelontong Indonesia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={quicksand.variable}>
      <body className="bg-background text-text-primary antialiased font-sans">
        <AppContextProvider>
          <MainLayout>{children}</MainLayout>
        </AppContextProvider>
      </body>
    </html>
  );
}
