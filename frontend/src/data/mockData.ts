export interface Product {
  id: string | number;
  name: string;
  sku: string;
  category_id?: string | number;
  category?: { id: string | number; name: string };
  unit: string;
  price: number;
  cost_price: number;
  stock: number;
  min_stock: number;
  status?: string;
  created_at?: string;
}

export interface CategoryItem {
  id: string | number;
  name: string;
  products_count?: number;
}

export interface TransactionItem {
  product_id: string | number;
  quantity: number;
  price: number; // price at transaction
  subtotal: number;
  cost_price: number;
  product?: Product;
}

export interface Transaction {
  id: string | number;
  invoice_no?: string;
  total_amount: number;
  total_profit: number;
  payment_method: "Tunai" | "QRIS" | "Transfer Bank" | string;
  items?: TransactionItem[];
  status: "Selesai" | "Pending" | "Batal" | string;
  created_at?: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: "IN" | "OUT";
  quantity: number;
  date: string;
  note: string;
}

export interface ActivityItem {
  id: string;
  type: "SALE" | "STOCK_ALERT" | "RESTOCK" | "PRODUCT_ADD" | "REPORT_GENERATE" | "EXPENSE";
  title: string;
  description: string;
  time: string;
  amount?: number;
}

export interface UserProfile {
  businessName: string;
  ownerName: string;
  phone: string;
  address: string;
  email: string;
  logoText: string;
}

export const initialProducts: Product[] = [];

export const initialCategories: CategoryItem[] = [];

export const initialTransactions: Transaction[] = [];

export const initialStockMovements: StockMovement[] = [];

export const initialActivities: ActivityItem[] = [];

export const initialProfile: UserProfile = {
  businessName: "Admin",
  ownerName: "Admin",
  phone: "-",
  address: "-",
  email: "admin@umkmku.com",
  logoText: "A",
};

export const chartDataWeekly: any[] = [
  { name: "Senin", income: 150000, outcome: 50000 },
  { name: "Selasa", income: 230000, outcome: 80000 },
  { name: "Rabu", income: 180000, outcome: 60000 },
  { name: "Kamis", income: 320000, outcome: 120000 },
  { name: "Jumat", income: 280000, outcome: 90000 },
  { name: "Sabtu", income: 450000, outcome: 150000 },
  { name: "Minggu", income: 500000, outcome: 200000 },
];

export const chartDataMonthly: any[] = [
  { name: "Minggu 1", income: 1200000, outcome: 400000 },
  { name: "Minggu 2", income: 1500000, outcome: 500000 },
  { name: "Minggu 3", income: 1800000, outcome: 600000 },
  { name: "Minggu 4", income: 2500000, outcome: 800000 },
];
