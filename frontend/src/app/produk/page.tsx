"use client";

import React, { useState, useMemo } from "react";
import {
  PlusCircle,
  Search,
  SlidersHorizontal,
  Edit2,
  Trash2,
  Package,
  X,
  Save,
  AlertCircle,
  ChevronDown,
  LayoutGrid,
  List,
  ArrowUpDown,
  History,
  TrendingUp,
  TrendingDown,
  Boxes,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Product } from "../../data/mockData";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { clsx } from "clsx";

// Removed hardcoded CATEGORIES


// ───────────── Product Add/Edit Form Modal ─────────────
interface ProductFormData {
  name: string;
  sku: string;
  category: string;
  unit: string;
  price: string;
  cost_price: string;
  stock: string;
  min_stock: string;
}

const emptyForm: ProductFormData = {
  name: "",
  sku: "",
  category: "",
  unit: "",
  price: "",
  cost_price: "",
  stock: "",
  min_stock: "",
};

interface ProductModalProps {
  mode: "add" | "edit";
  product?: Product | null;
  onClose: () => void;
  onSave: (data: ProductFormData) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ mode, product, onClose, onSave }) => {
  const [form, setForm] = useState<ProductFormData>(
    product
      ? {
          name: product.name,
          sku: product.sku,
          category: product.category?.name || "",
          unit: product.unit,
          price: product.price.toString(),
          cost_price: product.cost_price.toString(),
          stock: product.stock.toString(),
          min_stock: product.min_stock.toString(),
        }
      : emptyForm
  );
  const [errors, setErrors] = useState<Partial<ProductFormData>>({});
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);

  const { categories } = useApp();

  const validate = () => {
    const e: Partial<ProductFormData> = {};
    if (!form.name.trim()) e.name = "Nama produk wajib diisi";
    if (!form.sku.trim()) e.sku = "SKU wajib diisi";
    if (!form.unit.trim()) e.unit = "Satuan wajib diisi";
    if (!form.price || Number(form.price) <= 0) e.price = "Harga jual wajib diisi";
    if (!form.cost_price || Number(form.cost_price) <= 0) e.cost_price = "Harga modal wajib diisi";
    if (form.stock === "" || Number(form.stock) < 0) e.stock = "Stok tidak boleh negatif";
    if (!form.min_stock || Number(form.min_stock) < 0) e.min_stock = "Minimal stok wajib diisi";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSave(form);
  };

  const field = (
    label: string,
    key: keyof ProductFormData,
    type: string = "text",
    placeholder: string = ""
  ) => (
    <div>
      <label className="block text-xs font-bold text-[#1E1B39] mb-1.5">{label}</label>
      <div className="relative">
        {["price", "cost_price"].includes(key) && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">Rp</span>
        )}
        <input
          type={type}
          value={form[key]}
          onChange={(e) => {
            setForm({ ...form, [key]: e.target.value });
            if (errors[key]) setErrors({ ...errors, [key]: undefined });
          }}
          placeholder={placeholder}
          className={clsx(
            "w-full text-sm px-3.5 py-2.5 rounded-xl border focus:outline-none transition-all text-[#1E1B39]",
            errors[key]
              ? "border-danger focus:ring-2 focus:ring-danger/10"
              : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10",
            ["price", "cost_price"].includes(key) && "pl-9"
          )}
        />
      </div>
      {errors[key] && (
        <div className="flex items-center gap-1 mt-1.5 text-danger">
          <AlertCircle className="w-3.5 h-3.5" />
          <span className="text-[11px] font-semibold">{errors[key]}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90dvh] animate-fadeIn">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 bg-white border-b border-gray-100 px-6 py-5 flex items-center justify-between rounded-t-3xl">
          <div>
            <h2 className="text-lg font-bold text-[#1E1B39]">
              {mode === "add" ? "Tambah Produk Baru" : "Edit Produk"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {mode === "add" ? "Masukkan detail produk baru ke dalam katalog" : "Perbarui informasi produk ini"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-danger hover:border-danger/40 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body - Scrollable */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field("Nama Produk", "name", "text", "Cth: Kopi Kapal Api")}
            {field("SKU / Kode", "sku", "text", "Cth: KPA-001")}
            
            <div className="relative">
              <label className="block text-xs font-bold text-[#1E1B39] mb-1.5">Kategori</label>
              <div className="relative">
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => {
                    setForm({ ...form, category: e.target.value });
                    if (errors.category) setErrors({ ...errors, category: undefined });
                  }}
                  onFocus={() => setCatDropdownOpen(true)}
                  onBlur={() => setTimeout(() => setCatDropdownOpen(false), 200)}
                  placeholder="Cth: Sembako, Minuman"
                  className={clsx(
                    "w-full text-sm pl-3.5 pr-10 py-2.5 rounded-xl border focus:outline-none transition-all text-[#1E1B39]",
                    errors.category ? "border-danger focus:ring-2 focus:ring-danger/10" : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
                  )}
                />
                <ChevronDown className={clsx("absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none transition-transform", catDropdownOpen && "rotate-180")} />
              </div>
              {catDropdownOpen && categories.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto p-1.5">
                  {categories.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setForm({ ...form, category: c.name });
                        setCatDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm font-semibold text-[#1E1B39] hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
              {errors.category && (
                <div className="flex items-center gap-1 mt-1.5 text-danger">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-semibold">{errors.category}</span>
                </div>
              )}
            </div>

            {field("Satuan", "unit", "text", "Cth: bungkus, kg, pcs")}
          </div>

          <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field("Harga Modal", "cost_price", "number", "0")}
            {field("Harga Jual", "price", "number", "0")}
            {form.price && form.cost_price && Number(form.price) > Number(form.cost_price) && (
              <div className="col-span-full flex items-center justify-between bg-success-light/30 px-3 py-2 rounded-xl border border-success/20">
                <span className="text-xs font-bold text-[#1E1B39]">Potensi Laba:</span>
                <span className="text-sm font-extrabold text-success">
                  + Rp {(Number(form.price) - Number(form.cost_price)).toLocaleString("id-ID")}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field(mode === "add" ? "Stok Awal" : "Stok Saat Ini", "stock", "number", "0")}
            {field("Batas Stok Minimum", "min_stock", "number", "5")}
          </div>
          
          {/* Footer inside form to ensure it scrolls if screen is very small, but usually visible */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Save className="w-4 h-4" />
              {mode === "add" ? "Simpan Produk" : "Perbarui Produk"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// ───────────── Main Page ─────────────
export default function ProdukPage() {
  const { products, categories, stockMovements, addProduct, updateProduct, deleteProduct } = useApp();

  const [activeTab, setActiveTab] = useState<"katalog" | "riwayat">("katalog");
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("Semua");
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Modal States
  const [productModal, setProductModal] = useState<{ isOpen: boolean; mode: "add" | "edit"; product?: Product | null }>({
    isOpen: false,
    mode: "add",
  });


  const stats = useMemo(() => {
    return {
      totalSku: products.length,
      tersedia: products.filter((p) => p.status === "Tersedia").length,
      menipis: products.filter((p) => p.status === "Stok Menipis").length,
      habis: products.filter((p) => p.status === "Habis").length,
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (filterCategory !== "Semua") {
      list = list.filter((p) => p.category?.name === filterCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }
    return list;
  }, [products, search, filterCategory]);

  const filteredMovements = useMemo(() => {
    if (!search.trim()) return stockMovements;
    const q = search.toLowerCase();
    return stockMovements.filter((m) => m.productName.toLowerCase().includes(q) || m.productId.toLowerCase().includes(q));
  }, [stockMovements, search]);

  const handleSaveProduct = async (data: ProductFormData) => {
    let success = false;
    if (productModal.mode === "add") {
      success = await addProduct({
        name: data.name,
        sku: data.sku,
        category: data.category,
        unit: data.unit,
        price: Number(data.price),
        cost_price: Number(data.cost_price),
        stock: Number(data.stock),
        min_stock: Number(data.min_stock),
      });
    } else if (productModal.product) {
      success = await updateProduct(productModal.product.id, {
        name: data.name,
        sku: data.sku,
        category: data.category,
        unit: data.unit,
        price: Number(data.price),
        cost_price: Number(data.cost_price),
        stock: Number(data.stock),
        min_stock: Number(data.min_stock),
      });
    }
    
    if (success) {
      setProductModal({ isOpen: false, mode: "add" });
    }
  };



  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1E1B39]">Produk & Stok</h1>
          <p className="text-sm text-gray-400 mt-1">
            Kelola katalog produk, harga, batas minimum, dan pantau riwayat mutasi stok.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Restock button removed */}
          <button
            onClick={() => setProductModal({ isOpen: true, mode: "add" })}
            className="flex items-center gap-2 bg-primary text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-sm hover:bg-primary-dark active:scale-95 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Tambah Produk
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total SKU Produk", value: stats.totalSku, color: "text-[#1E1B39]", icon: Package },
          { label: "Stok Tersedia", value: stats.tersedia, color: "text-success", icon: Package },
          { label: "Stok Menipis", value: stats.menipis, color: "text-amber-500", icon: AlertCircle },
          { label: "Stok Habis", value: stats.habis, color: "text-danger", icon: Trash2 }, // Using Trash2 as a placeholder for Empty, maybe a different icon would be better, but keeping it simple
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400">{s.label}</p>
              <p className={`text-2xl font-bold tracking-tight mt-1 ${s.color}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => { setActiveTab("katalog"); setSearch(""); }}
          className={clsx(
            "px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2",
            activeTab === "katalog" ? "border-primary text-primary" : "border-transparent text-gray-400 hover:text-[#1E1B39]"
          )}
        >
          <Package className="w-4 h-4" />
          Katalog Produk
        </button>
        <button
          onClick={() => { setActiveTab("riwayat"); setSearch(""); }}
          className={clsx(
            "px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2",
            activeTab === "riwayat" ? "border-primary text-primary" : "border-transparent text-gray-400 hover:text-[#1E1B39]"
          )}
        >
          <History className="w-4 h-4" />
          Riwayat Mutasi Stok
        </button>
      </div>

      {/* Filters Area */}
      <Card className="p-3 bg-white rounded-2xl border border-gray-100 shadow-xs mb-6 relative z-20">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto flex-1">
            {/* Search */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={activeTab === "katalog" ? "Cari nama produk, SKU..." : "Cari riwayat mutasi..."}
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-[#1E1B39]"
              />
            </div>
            {/* Category Filter (only for katalog) */}
            {activeTab === "katalog" && (
              <div className="relative w-full sm:w-auto z-10">
                <button
                  onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                  className={clsx(
                    "w-full sm:w-48 text-left pl-10 pr-8 py-2.5 rounded-xl border focus:outline-none transition-all flex items-center justify-between",
                    filterDropdownOpen ? "border-primary ring-2 ring-primary/10" : "border-gray-200 hover:bg-gray-50",
                    "text-sm font-semibold text-[#1E1B39] bg-white"
                  )}
                >
                  <SlidersHorizontal className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  {filterCategory}
                  <ChevronDown className={clsx("absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform pointer-events-none", filterDropdownOpen && "rotate-180")} />
                </button>
                
                {filterDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setFilterDropdownOpen(false)} />
                    <div className="absolute left-0 mt-2 bg-white rounded-2xl border border-gray-100 shadow-xl z-50 p-2 space-y-0.5 min-w-[200px]">
                      {(() => {
                        const activeCategories = categories.filter(c => (c.products_count || 0) > 0);
                        const dropdownItems = [
                          { name: "Semua", count: products.length },
                          ...activeCategories.map(c => ({ name: c.name, count: c.products_count || 0 }))
                        ];
                        
                        return dropdownItems.map((cat) => (
                          <button
                            key={cat.name}
                            type="button"
                            onClick={() => {
                              setFilterCategory(cat.name);
                              setFilterDropdownOpen(false);
                            }}
                            className={clsx(
                              "w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all",
                              filterCategory === cat.name
                                ? "bg-primary text-white font-bold shadow-sm"
                                : "text-[#1E1B39] hover:bg-gray-50/80 font-medium"
                            )}
                          >
                            <span className="text-sm">{cat.name}</span>
                            <span className={clsx(
                              "text-[10px] px-2 py-0.5 rounded-md font-bold",
                              filterCategory === cat.name
                                ? "bg-white/20 text-white"
                                : "bg-gray-100 text-gray-500"
                            )}>
                              {cat.count}
                            </span>
                          </button>
                        ));
                      })()}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* View Toggle (only for katalog) */}
          {activeTab === "katalog" && (
            <div className="flex items-center p-1 bg-gray-100 rounded-xl border border-gray-200/50 w-full sm:w-auto">
              <button
                onClick={() => setViewMode("table")}
                className={clsx(
                  "flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                  viewMode === "table" ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-[#1E1B39]"
                )}
              >
                <List className="w-4 h-4" /> Table
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={clsx(
                  "flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                  viewMode === "grid" ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-[#1E1B39]"
                )}
              >
                <LayoutGrid className="w-4 h-4" /> Card
              </button>
            </div>
          )}
        </div>
      </Card>

      {/* Content Area */}
      {activeTab === "katalog" ? (
        filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-gray-150 flex items-center justify-center mx-auto text-gray-400">
              <Package className="w-7 h-7" />
            </div>
            <p className="text-sm font-semibold text-gray-500">Katalog kosong atau tidak ada produk yang cocok</p>
          </div>
        ) : viewMode === "table" ? (
          <Card padding="none" className="overflow-hidden bg-white rounded-[24px] border border-gray-100 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    <th className="py-4 px-5">Info Produk</th>
                    <th className="py-4 px-5 text-right">Harga Modal</th>
                    <th className="py-4 px-5 text-right">Harga Jual</th>
                    <th className="py-4 px-5 text-center">Stok & Batas</th>
                    <th className="py-4 px-5 text-center">Status</th>
                    <th className="py-4 px-5 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-55 text-sm">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-400 flex items-center justify-center flex-shrink-0">
                            <Package className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-[#1E1B39] text-xs">{p.name}</p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="font-mono text-[10px] text-gray-400 bg-gray-150 px-1.5 py-0.5 rounded-md">{p.sku}</span>
                              <span className="text-[10px] font-semibold text-gray-400">{p.category?.name || "-"}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-right font-medium text-gray-500">
                        Rp {p.cost_price.toLocaleString("id-ID")}
                      </td>
                      <td className="py-4 px-5 text-right font-bold text-[#1E1B39]">
                        Rp {p.price.toLocaleString("id-ID")}
                      </td>
                      <td className="py-4 px-5 text-center">
                        <p className={clsx("font-bold text-xs", p.stock === 0 ? "text-danger" : p.stock <= p.min_stock ? "text-amber-500" : "text-[#1E1B39]")}>
                          {p.stock} <span className="font-medium text-[11px] text-gray-400">{p.unit}</span>
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Min: {p.min_stock}</p>
                      </td>
                      <td className="py-4 px-5 text-center">
                        <Badge status={p.status} size="sm" />
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setProductModal({ isOpen: true, mode: "edit", product: p })}
                            className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-warning hover:text-white transition-all"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-danger hover:text-white transition-all"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((p) => (
              <Card key={p.id} hoverable className="p-4 bg-white rounded-[24px] flex flex-col h-full border border-gray-100/80">
                <div className="flex justify-between items-start mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300">
                    <Package className="w-6 h-6" />
                  </div>
                  <Badge status={p.status} size="sm" />
                </div>
                
                <div className="flex-1 min-h-0">
                  <h3 className="font-bold text-sm text-[#1E1B39] line-clamp-2 leading-tight">{p.name}</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="font-mono text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-md">{p.sku}</span>
                    <span className="text-[11px] font-semibold text-gray-400">{p.category?.name || "-"}</span>
                  </div>
                  
                  <div className="mt-4 p-3 rounded-xl bg-gray-50/50 border border-gray-100 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500 font-medium">Harga</span>
                      <span className="font-bold text-primary">Rp {p.price.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500 font-medium">Stok</span>
                      <span className={clsx("font-bold", p.stock === 0 ? "text-danger" : p.stock <= p.min_stock ? "text-amber-500" : "text-[#1E1B39]")}>
                        {p.stock} <span className="font-medium text-[10px] text-gray-400">{p.unit}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setProductModal({ isOpen: true, mode: "edit", product: p })}
                    className="flex-1 py-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-warning hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="flex-1 py-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-danger hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Hapus
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )
      ) : (
        /* Riwayat Mutasi List */
        <Card padding="none" className="overflow-hidden bg-white rounded-[24px] border border-gray-100 shadow-sm">
          {filteredMovements.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-gray-150 flex items-center justify-center mx-auto text-gray-400">
                <History className="w-7 h-7" />
              </div>
              <p className="text-sm font-semibold text-gray-500">Belum ada mutasi stok</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    <th className="py-3.5 px-5">Waktu Mutasi</th>
                    <th className="py-3.5 px-5">Nama Produk</th>
                    <th className="py-3.5 px-5 text-center">Tipe</th>
                    <th className="py-3.5 px-5 text-right">Jumlah</th>
                    <th className="py-3.5 px-5">Keterangan / Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-55 text-sm">
                  {filteredMovements.map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-5 text-xs text-gray-400 font-medium">{m.date} WIB</td>
                      <td className="py-4 px-5 font-bold text-[#1E1B39] text-xs">{m.productName}</td>
                      <td className="py-4 px-5 text-center">
                        <span className={clsx(
                          "inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full",
                          m.type === "IN" ? "bg-success-light text-success" : "bg-danger-light text-danger"
                        )}>
                          {m.type === "IN" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {m.type === "IN" ? "STOK MASUK" : "STOK KELUAR"}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right font-bold">
                        <span className={m.type === "IN" ? "text-success" : "text-danger"}>
                          {m.type === "IN" ? "+" : "-"}{m.quantity}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-xs text-gray-500 font-medium leading-relaxed max-w-xs truncate" title={m.note}>
                        {m.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* Modals */}
      {productModal.isOpen && (
        <ProductModal
          mode={productModal.mode}
          product={productModal.product}
          onClose={() => setProductModal({ isOpen: false, mode: "add" })}
          onSave={handleSaveProduct}
        />
      )}
      

    </div>
  );
}
