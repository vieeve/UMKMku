"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../lib/api";
import {
  Product,
  CategoryItem,
  Transaction,
  TransactionItem,
  StockMovement,
  ActivityItem,
  UserProfile,
  initialStockMovements,
  initialActivities,
  initialProfile,
} from "../data/mockData";

interface CartItem extends TransactionItem {
  maxStock: number;
}

interface AppContextType {
  products: Product[];
  categories: CategoryItem[];
  transactions: Transaction[];
  stockMovements: StockMovement[];
  activities: ActivityItem[];
  userProfile: UserProfile;
  cart: CartItem[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  // Auth
  isInitializing: boolean;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, businessName: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  deleteAccount: () => Promise<boolean>;
  // Actions
  addProduct: (newProduct: Omit<Product, "id" | "status">) => Promise<boolean>;
  updateProduct: (id: string | number, updated: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string | number) => Promise<void>;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string | number) => void;
  updateCartQty: (productId: string | number, qty: number) => void;
  clearCart: () => void;
  checkoutTransaction: (paymentMethod: string) => Promise<any>;
  updateProfile: (updated: Partial<UserProfile>) => void;
  // Stats helpers
  getLowStockProducts: () => Product[];
  getTotalProductsCount: () => number;
  getTodaySalesTotal: () => number;
  getTodayProfitTotal: () => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // Masih pakai mock untuk fitur yang belum ada di backend
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(initialStockMovements);
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities);
  const [userProfile, setUserProfile] = useState<UserProfile>(initialProfile);
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [dashboardMetrics, setDashboardMetrics] = useState({ today_sales: 0, today_profit: 0 });

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      setIsAuthenticated(true);
    }
    setIsInitializing(false);
  }, []);

  const fetchData = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const [catRes, prodRes, trxRes, dashRes, userRes] = await Promise.all([
        api.get("/categories"),
        api.get("/products"),
        api.get("/transactions"),
        api.get("/dashboard"),
        api.get("/user"),
      ]);
      setCategories(catRes.data);
      setProducts(prodRes.data.map((p: any) => {
        const stock = Number(p.stock);
        const minStock = Number(p.min_stock);
        let computedStatus = "Tersedia";
        if (stock === 0) computedStatus = "Habis";
        else if (stock <= minStock) computedStatus = "Stok Menipis";

        return {
          ...p,
          price: Number(p.price),
          cost_price: Number(p.cost_price),
          stock,
          min_stock: minStock,
          status: computedStatus,
        };
      }));
      setTransactions(trxRes.data.map((t: any) => ({
        ...t,
        total_amount: Number(t.total_amount),
        total_profit: Number(t.total_profit),
      })));
      setDashboardMetrics({
        today_sales: Number(dashRes.data.metrics.today_sales) || 0,
        today_profit: Number(dashRes.data.metrics.today_profit) || 0,
      });
      setUserProfile((prev) => ({
        ...prev,
        businessName: userRes.data.business_name || userRes.data.name,
        ownerName: userRes.data.name,
        email: userRes.data.email,
        logoText: (userRes.data.business_name || userRes.data.name).substring(0, 2).toUpperCase(),
      }));

      // Generate dynamic activities based on real data
      const allActivitiesWithDates: { item: ActivityItem; date: Date }[] = [];
      
      // Recent sales (up to 8 to fill out the panel)
      const recentSales = trxRes.data.slice(0, 8);
      recentSales.forEach((t: any) => {
        const dateObj = t.created_at ? new Date(t.created_at) : new Date();
        allActivitiesWithDates.push({
          item: {
            id: `ACT-SALE-${t.id}`,
            type: "SALE",
            title: "Penjualan Berhasil",
            description: "Transaksi Kasir berhasil diselesaikan.",
            time: dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            amount: Number(t.total_amount),
          },
          date: dateObj,
        });
      });

      // Stock alerts using the actual updated_at time of the products!
      const lowStockProducts = prodRes.data.filter((p: any) => Number(p.stock) <= Number(p.min_stock) && Number(p.stock) > 0);
      const outOfStock = prodRes.data.filter((p: any) => Number(p.stock) === 0);

      if (outOfStock.length > 0) {
        // Get the latest timestamp among out of stock products
        const latestEmptyDate = outOfStock.reduce((latest: Date, p: any) => {
          const prodDate = p.updated_at ? new Date(p.updated_at) : new Date(0);
          return prodDate > latest ? prodDate : latest;
        }, new Date(0));

        const displayDate = latestEmptyDate.getTime() > 0 ? latestEmptyDate : new Date();

        allActivitiesWithDates.push({
          item: {
            id: "ACT-STOCK-EMPTY",
            type: "STOCK_EMPTY",
            title: "Stok Habis!",
            description: `${outOfStock.length} produk telah habis. Segera restok!`,
            time: displayDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          },
          date: displayDate,
        });
      }
      if (lowStockProducts.length > 0) {
        // Get the latest timestamp among low stock products
        const latestLowDate = lowStockProducts.reduce((latest: Date, p: any) => {
          const prodDate = p.updated_at ? new Date(p.updated_at) : new Date(0);
          return prodDate > latest ? prodDate : latest;
        }, new Date(0));

        const displayDate = latestLowDate.getTime() > 0 ? latestLowDate : new Date();

        allActivitiesWithDates.push({
          item: {
            id: "ACT-STOCK-LOW",
            type: "STOCK_ALERT",
            title: "Stok Menipis",
            description: `${lowStockProducts.length} produk hampir habis.`,
            time: displayDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          },
          date: displayDate,
        });
      }

      // Sort strictly by timestamp descending (newest at the top, oldest at the bottom)
      // If timestamps are identical, SALE comes first
      allActivitiesWithDates.sort((a, b) => {
        const diff = b.date.getTime() - a.date.getTime();
        if (diff !== 0) return diff;
        if (a.item.type === "SALE" && b.item.type !== "SALE") return -1;
        if (b.item.type === "SALE" && a.item.type !== "SALE") return 1;
        return 0;
      });

      // Limit to exactly 8 items so the panel height fills out nicely alongside the left chart!
      const topActivities = allActivitiesWithDates.slice(0, 8);
      
      setActivities(topActivities.map(a => a.item));

    } catch (error: any) {
      console.error("Gagal mengambil data dari API", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("auth_token");
        setIsAuthenticated(false);
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const login = async (email: string, pass: string) => {
    try {
      const res = await api.post("/login", { email, password: pass });
      localStorage.setItem("auth_token", res.data.token);
      setIsAuthenticated(true);
      return true;
    } catch (e) {
      return false;
    }
  };

  const register = async (name: string, businessName: string, email: string, pass: string) => {
    try {
      const res = await api.post("/register", { name, business_name: businessName, email, password: pass });
      localStorage.setItem("auth_token", res.data.token);
      setIsAuthenticated(true);
      return true;
    } catch (e) {
      return false;
    }
  };

  const logout = () => {
    api.post("/logout").catch(() => {});
    localStorage.removeItem("auth_token");
    setIsAuthenticated(false);
    setProducts([]);
    setCategories([]);
    setTransactions([]);
  };

  const deleteAccount = async () => {
    try {
      await api.delete("/user");
      localStorage.removeItem("auth_token");
      setIsAuthenticated(false);
      setProducts([]);
      setCategories([]);
      setTransactions([]);
      return true;
    } catch (e) {
      return false;
    }
  };

  const addProduct = async (newProduct: Omit<Product, "id" | "status">) => {
    try {
      await api.post("/products", newProduct);
      return true;
    } catch (e: any) {
      console.error("Failed to add product", e);
      const msg = e.response?.data?.message || e.message || "Terjadi kesalahan server saat menyimpan produk.";
      alert("Gagal menambahkan produk: " + msg);
      return false;
    } finally {
      fetchData();
    }
  };

  const updateProduct = async (id: string | number, updated: Partial<Product>) => {
    try {
      await api.put(`/products/${id}`, updated);
      return true;
    } catch (e: any) {
      console.error("Failed to update product", e);
      const msg = e.response?.data?.message || e.message || "Terjadi kesalahan server saat memperbarui produk.";
      alert("Gagal memperbarui produk: " + msg);
      return false;
    } finally {
      fetchData();
    }
  };

  const deleteProduct = async (id: string | number) => {
    try {
      await api.delete(`/products/${id}`);
    } catch (e) {
      console.error("Failed to delete product", e);
    } finally {
      fetchData();
    }
  };



  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product_id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.price }
            : item
        );
      }
      return [
        ...prev,
        {
          product_id: product.id,
          price: product.price,
          cost_price: product.cost_price,
          quantity: 1,
          subtotal: product.price,
          maxStock: product.stock,
          product: product, // include product relation for UI
        },
      ];
    });
  };

  const removeFromCart = (productId: string | number) => {
    setCart((prev) => prev.filter((item) => item.product_id !== productId));
  };

  const updateCartQty = (productId: string | number, qty: number) => {
    if (qty <= 0) return removeFromCart(productId);
    setCart((prev) =>
      prev.map((item) => {
        if (item.product_id === productId) {
          const newQty = Math.min(qty, item.maxStock);
          return { ...item, quantity: newQty, subtotal: newQty * item.price };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);

  const checkoutTransaction = async (paymentMethod: string) => {
    if (cart.length === 0) return null;

    try {
      const res = await api.post("/transactions", {
        payment_method: paymentMethod,
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity
        }))
      });
      clearCart();
      fetchData(); // Refresh all data to update stocks and transaction history
      return res.data;
    } catch (e) {
      console.error("Gagal melakukan checkout", e);
      throw e;
    }
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updated }));
  };

  const getLowStockProducts = () => {
    return products.filter((p) => p.stock <= p.min_stock);
  };

  const getTotalProductsCount = () => products.length;
  
  const getTodaySalesTotal = () => dashboardMetrics.today_sales;
  const getTodayProfitTotal = () => dashboardMetrics.today_profit;

  return (
    <AppContext.Provider
      value={{
        products,
        categories,
        transactions,
        stockMovements,
        activities,
        userProfile,
        cart,
        searchQuery,
        setSearchQuery,
        isInitializing,
        isAuthenticated,
        login,
        register,
        logout,
        deleteAccount,
        addProduct,
        updateProduct,
        deleteProduct,

        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        checkoutTransaction,
        updateProfile,
        getLowStockProducts,
        getTotalProductsCount,
        getTodaySalesTotal,
        getTodayProfitTotal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
