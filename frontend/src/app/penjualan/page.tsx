"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  X,
  CheckCircle2,
  Package,
  AlertTriangle,
  Receipt,
  HelpCircle,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { clsx } from "clsx";

// ─────────── Confirmation Modal ───────────
interface ConfirmModalProps {
  totalAmount: number;
  itemCount: number;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ totalAmount, itemCount, onClose, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 space-y-5 animate-fadeIn">
      <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
        <HelpCircle className="w-7 h-7" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-bold text-[#1E1B39]">Konfirmasi Penjualan</h3>
        <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
          Apakah Anda yakin ingin menyelesaikan transaksi ini sebesar <span className="font-bold text-[#1E1B39]">Rp {totalAmount.toLocaleString("id-ID")}</span> untuk <span className="font-semibold text-[#1E1B39]">{itemCount} item</span>?
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
        >
          Batal
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-all shadow-sm"
        >
          Ya, Selesaikan
        </button>
      </div>
    </div>
  </div>
);

// ─────────── Success Modal ───────────
interface SuccessModalProps {
  totalAmount: number;
  itemCount: number;
  trxId: string;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ totalAmount, itemCount, trxId, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center space-y-5 animate-fadeIn">
      <div className="w-20 h-20 rounded-full bg-success/15 flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-10 h-10 text-success" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-[#1E1B39]">Transaksi Berhasil!</h2>
        <p className="text-sm text-gray-400 mt-1">Penjualan telah dicatat ke riwayat toko</p>
      </div>
      <div className="bg-gray-50 rounded-2xl p-4 space-y-2 text-left">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400 font-medium">ID Transaksi</span>
          <span className="font-mono font-bold text-xs text-[#1E1B39]">{trxId}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400 font-medium">Total Item</span>
          <span className="font-bold text-[#1E1B39]">{itemCount} produk</span>
        </div>
        <div className="border-t border-gray-200 my-1" />
        <div className="flex justify-between items-center">
          <span className="font-bold text-[#1E1B39]">Total Belanja</span>
          <span className="font-bold text-xl text-primary">Rp {totalAmount.toLocaleString("id-ID")}</span>
        </div>
      </div>
      <button
        onClick={onClose}
        className="w-full py-3 rounded-2xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-all shadow-sm"
      >
        Tutup & Transaksi Baru
      </button>
    </div>
  </div>
);

// ─────────── Main Page ───────────
export default function PenjualanPage() {
  const {
    products,
    cart,
    addToCart,
    removeFromCart,
    updateCartQty,
    clearCart,
    checkoutTransaction,
    transactions,
  } = useApp();

  const [search, setSearch] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [successModal, setSuccessModal] = useState<{
    totalAmount: number;
    itemCount: number;
    trxId: string;
  } | null>(null);

  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
    );
  }, [products, search]);

  const totalAmount = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckoutClick = () => {
    if (cart.length === 0) return;
    setShowConfirm(true);
  };

  const handleConfirmCheckout = async () => {
    setShowConfirm(false);
    const itemCount = cart.reduce((s, i) => s + i.quantity, 0);
    const amount = totalAmount;
    const trxId = `TRX-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${String(transactions.length + 1).padStart(3, "0")}`;
    
    try {
      await checkoutTransaction("Tunai");
      setSuccessModal({ totalAmount: amount, itemCount, trxId });
    } catch (error) {
      // The error is already logged in AppContext, we just prevent the success modal
      alert("Terjadi kesalahan saat menyelesaikan transaksi. Pastikan stok mencukupi.");
    }
  };

  const getCartQty = (productId: string | number) =>
    cart.find((c) => c.product_id === productId)?.quantity ?? 0;

  return (
    <div className="animate-fadeIn pb-12">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-[#1E1B39]">Penjualan</h1>
        <p className="text-sm text-gray-400 mt-1">Pilih produk, isi keranjang, lalu simpan penjualan.</p>
      </div>

      {/* 2-Column Layout */}
      <div className="flex flex-col xl:flex-row gap-6 items-start">

        {/* ── LEFT: Product List ── */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari produk berdasarkan nama atau SKU..."
              className="w-full pl-11 pr-4 py-3 text-sm rounded-2xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-gray-400 text-[#1E1B39]"
            />
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredProducts.map((product) => {
              const inCart = getCartQty(product.id);
              const isHabis = product.status === "Habis";
              const isMenipis = product.status === "Stok Menipis";

              return (
                <button
                  key={product.id}
                  onClick={() => !isHabis && addToCart(product)}
                  disabled={isHabis}
                  className={clsx(
                    "relative p-3.5 rounded-2xl border text-left transition-all",
                    isHabis
                      ? "opacity-40 cursor-not-allowed bg-gray-50 border-gray-200"
                      : inCart > 0
                      ? "bg-primary/5 border-primary/40 shadow-sm hover:bg-primary/10"
                      : "bg-white border-gray-100 shadow-sm hover:border-primary/30 hover:shadow-md active:scale-[0.97]"
                  )}
                >
                  {/* Qty Badge */}
                  {inCart > 0 && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-md z-10">
                      {inCart}
                    </div>
                  )}

                  <div className={clsx(
                    "w-10 h-10 rounded-xl flex items-center justify-center mb-2.5",
                    isHabis ? "bg-gray-100 text-gray-300" : inCart > 0 ? "bg-primary text-white shadow-sm" : "bg-primary/10 text-primary"
                  )}>
                    <Package className="w-5 h-5" />
                  </div>

                  <p className={clsx(
                    "text-xs font-bold leading-snug line-clamp-2 mb-1.5",
                    inCart > 0 ? "text-primary" : "text-[#1E1B39]"
                  )}>
                    {product.name}
                  </p>

                  <p className="text-sm font-bold text-[#1E1B39]">
                    Rp {product.price.toLocaleString("id-ID")}
                  </p>

                  <div className={clsx(
                    "mt-1 flex items-center gap-1",
                    isMenipis ? "text-amber-500" : isHabis ? "text-danger" : "text-gray-400"
                  )}>
                    {isMenipis && <AlertTriangle className="w-3 h-3" />}
                    <p className="text-[11px] font-semibold">
                      {isHabis ? "Habis" : `Stok: ${product.stock} ${product.unit}`}
                    </p>
                  </div>
                </button>
              );
            })}

            {filteredProducts.length === 0 && (
              <div className="col-span-full py-14 text-center space-y-2">
                <Package className="w-8 h-8 text-gray-300 mx-auto" />
                <p className="text-sm font-semibold text-gray-400">Produk tidak ditemukan</p>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: Cart Panel ── */}
        <div className="w-full xl:w-[360px] flex-shrink-0 sticky top-6">
          <div className="bg-white rounded-[24px] border border-gray-200/70 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                <h2 className="text-base font-bold text-[#1E1B39]">Keranjang</h2>
                {cart.length > 0 && (
                  <span className="bg-primary text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </div>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-[11px] font-semibold text-danger hover:underline flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Kosongkan
                </button>
              )}
            </div>

            {/* Items */}
            <div className="px-4 py-3 space-y-2.5 min-h-[180px] max-h-[360px] overflow-y-auto">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[180px] space-y-2">
                  <ShoppingCart className="w-8 h-8 text-gray-200" />
                  <p className="text-sm font-semibold text-gray-300">Keranjang kosong</p>
                  <p className="text-xs text-gray-300">Klik produk di kiri untuk menambahkan</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.product_id} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <Package className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#1E1B39] truncate">{item.product?.name}</p>
                      <p className="text-[11px] text-gray-400">Rp {item.price.toLocaleString("id-ID")}</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => updateCartQty(item.product_id, item.quantity - 1)}
                        className="w-6 h-6 rounded-lg bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-danger/20 hover:text-danger transition-all"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-[#1E1B39]">{item.quantity}</span>
                      <button
                        onClick={() => {
                          const prod = products.find(p => p.id === item.product_id);
                          if (prod && item.quantity < prod.stock) updateCartQty(item.product_id, item.quantity + 1);
                        }}
                        className="w-6 h-6 rounded-lg bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-bold text-[#1E1B39]">Rp {item.subtotal.toLocaleString("id-ID")}</p>
                      <button onClick={() => removeFromCart(item.product_id)} className="text-[10px] text-danger hover:underline font-semibold mt-0.5">Hapus</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Total + Selesaikan Penjualan */}
            <div className="px-5 py-4 border-t border-gray-100 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">{totalItems} item</span>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Total Pembayaran</p>
                  <p className="text-xl font-bold text-[#1E1B39]">
                    Rp {totalAmount.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              <button
                onClick={handleCheckoutClick}
                disabled={cart.length === 0}
                className={clsx(
                  "w-full py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2",
                  cart.length === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-primary text-white shadow-md hover:bg-primary-dark hover:shadow-lg active:scale-[0.98]"
                )}
              >
                <Receipt className="w-4 h-4" />
                {cart.length === 0 ? "Keranjang Kosong" : `Selesaikan Penjualan · Rp ${totalAmount.toLocaleString("id-ID")}`}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <ConfirmModal
          totalAmount={totalAmount}
          itemCount={totalItems}
          onClose={() => setShowConfirm(false)}
          onConfirm={handleConfirmCheckout}
        />
      )}

      {/* Success Modal */}
      {successModal && (
        <SuccessModal
          totalAmount={successModal.totalAmount}
          itemCount={successModal.itemCount}
          trxId={successModal.trxId}
          onClose={() => setSuccessModal(null)}
        />
      )}
    </div>
  );
}
