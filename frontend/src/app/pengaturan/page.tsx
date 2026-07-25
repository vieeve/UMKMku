"use client";

import React, { useState, useEffect } from "react";
import { 
  Store, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Save, 
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  AlertTriangle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useApp } from "../../context/AppContext";
import { Card } from "../../components/ui/Card";
import { clsx } from "clsx";

export default function PengaturanPage() {
  const router = useRouter();
  const { userProfile, updateProfile, deleteAccount } = useApp();
  
  // Local state for the form
  const [formData, setFormData] = useState(userProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sync form when context changes (if it loads later)
  useEffect(() => {
    setFormData(userProfile);
  }, [userProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate network delay
    setTimeout(() => {
      updateProfile(formData);
      setIsSaving(false);
      setShowToast(true);
      
      // Hide toast after 3 seconds
      setTimeout(() => setShowToast(false), 3000);
    }, 600);
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = async () => {
    setIsDeleting(true);
    const success = await deleteAccount();
    if (success) {
      router.push("/login");
    } else {
      setIsDeleting(false);
      setShowDeleteModal(false);
      alert("Gagal menghapus akun.");
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-slideDown">
          <div className="bg-gray-900/95 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <span className="text-sm font-bold">Perubahan berhasil disimpan!</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#1E1B39]">Pengaturan Usaha</h1>
        <p className="text-sm text-gray-400 mt-1">
          Kelola profil toko, nomor kontak, dan alamat usaha Anda.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Quick Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 bg-white rounded-[24px] border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-[#8A7DFF] text-white flex items-center justify-center text-3xl font-extrabold shadow-md mb-4 relative group cursor-pointer overflow-hidden">
              <span>{formData.logoText}</span>
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ImageIcon className="w-6 h-6 text-white mb-1" />
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Ubah Logo</span>
              </div>
            </div>
            <h2 className="text-lg font-bold text-[#1E1B39] mb-1">{formData.businessName || "Nama Toko"}</h2>
            <p className="text-xs text-gray-500 font-medium">{formData.email || "email@contoh.com"}</p>
            
            <div className="w-full mt-6 pt-6 border-t border-gray-100">
              <div className="w-full relative">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 text-left">
                  Inisial Logo (Maks 2 Huruf)
                </label>
                <input
                  type="text"
                  name="logoText"
                  value={formData.logoText}
                  onChange={handleChange}
                  maxLength={2}
                  className="w-full text-center bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-[#1E1B39] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Form Fields */}
        <div className="lg:col-span-2">
          <Card className="p-0 bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="px-6 py-5 border-b border-gray-100">
              <h3 className="text-base font-bold text-[#1E1B39]">Informasi Profil</h3>
              <p className="text-xs text-gray-400 mt-1">Ubah data identitas usaha Anda di bawah ini.</p>
            </div>
            
            <div className="p-6 space-y-5 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Nama Usaha */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-500">Nama Toko / Usaha</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Store className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold text-[#1E1B39] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="Contoh: Toko Barokah Jaya"
                    />
                  </div>
                </div>

                {/* Nama Pemilik */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-500">Nama Pemilik</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold text-[#1E1B39] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="Nama lengkap Anda"
                    />
                  </div>
                </div>

                {/* Nomor Telepon */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-500">No. WhatsApp / Telepon</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Phone className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold text-[#1E1B39] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="081234567890"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-500">Alamat Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold text-[#1E1B39] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="email@usaha.com"
                    />
                  </div>
                </div>
              </div>

              {/* Alamat Lengkap */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500">Alamat Lengkap Usaha</label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <MapPin className="w-4 h-4 text-gray-400" />
                  </div>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold text-[#1E1B39] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    placeholder="Alamat lengkap toko fisik atau rumah produksi Anda"
                  />
                </div>
              </div>
            </div>

            {/* Footer / Actions */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="px-4 py-2 text-sm font-bold text-danger hover:bg-danger/10 rounded-xl transition-all flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Hapus Akun
              </button>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(userProfile)}
                  className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
                >
                  Batal
                </button>
                <button
                type="submit"
                disabled={isSaving}
                className={clsx(
                  "px-5 py-2 text-sm font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-sm transition-all flex items-center gap-2",
                  isSaving ? "opacity-70 cursor-not-allowed" : "active:scale-95"
                )}
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Simpan Perubahan
                  </>
                )}
              </button>
              </div>
            </div>
          </Card>
        </div>
      </form>

      {/* Custom Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden animate-slideUp">
            <div className="p-6 sm:p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-danger/10 text-danger flex items-center justify-center mx-auto mb-5">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#1E1B39] mb-2">Hapus Akun Permanen?</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Apakah Anda yakin ingin menghapus akun secara permanen? Semua data usaha, produk, dan riwayat transaksi akan dihapus dari sistem dan <strong>tidak dapat dikembalikan!</strong>
              </p>
            </div>
            <div className="p-4 bg-gray-50 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-all"
              >
                Batal
              </button>
              <button
                onClick={confirmDeleteAccount}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 text-sm font-bold text-white bg-danger hover:bg-red-600 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {isDeleting ? "Menghapus..." : "Ya, Hapus Akun"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
